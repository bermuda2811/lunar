import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, initDatabase } from './database';
import { getAdminHtml } from './admin/adminHtml';
import { getFullDayData, solarToLunar, getDayOfWeekName } from '../../shared/calendar/lunarCalendar';

// Initialize database & tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Admin CMS at /admin and /
app.get('/', (req: Request, res: Response) => {
  res.send(getAdminHtml());
});

app.get('/admin', (req: Request, res: Response) => {
  res.send(getAdminHtml());
});

// --- API ENDPOINTS ---

// Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/calendar/day?date=YYYY-MM-DD
app.get('/api/v1/calendar/day', (req: Request, res: Response) => {
  try {
    let day: number, month: number, year: number;
    if (req.query.date && typeof req.query.date === 'string') {
      const parts = req.query.date.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      const now = new Date();
      day = now.getDate();
      month = now.getMonth() + 1;
      year = now.getFullYear();
    }

    const dayData = getFullDayData(day, month, year);
    const lunar = dayData.lunar;

    // Fetch relevant events from DB for this solar or lunar date
    const eventsQuery = db.prepare(`
      SELECT * FROM events 
      WHERE status = 'active' AND (
        (calendar_type = 'solar' AND day = ? AND month = ?) OR
        (calendar_type = 'lunar' AND day = ? AND month = ?)
      )
    `);
    const events = eventsQuery.all(day, month, lunar.day, lunar.month);

    // Fetch daily quote
    let quote = db.prepare(`
      SELECT quote, author FROM daily_quotes 
      WHERE applicable_day = ? AND applicable_month = ?
      LIMIT 1
    `).get(lunar.day, lunar.month) as { quote: string; author?: string } | undefined;

    if (!quote) {
      quote = db.prepare(`
        SELECT quote, author FROM daily_quotes 
        WHERE theme = 'daily' OR applicable_day IS NULL 
        ORDER BY RANDOM() LIMIT 1
      `).get() as { quote: string; author?: string } | undefined;
    }

    res.json({
      success: true,
      data: {
        ...dayData,
        events,
        quote: quote ? { text: quote.quote, author: quote.author } : { text: 'An lành mỗi ngày, vạn sự như ý.' }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/events
app.get('/api/v1/events', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM events';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== 'all' && category !== 'Tất cả') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(title LIKE ? OR summary LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY month ASC, day ASC';

    const stmt = db.prepare(query);
    const events = stmt.all(...params);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/events/:id
app.get('/api/v1/events/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/events
app.post('/api/v1/events', (req: Request, res: Response) => {
  try {
    const { title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url } = req.body;

    if (!title || !day || !month) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ tên, ngày và tháng' });
    }

    const stmt = db.prepare(`
      INSERT INTO events (title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      title,
      calendar_type || 'solar',
      day,
      month,
      category || 'Lễ Việt Nam',
      status || 'active',
      summary || null,
      meaning || null,
      traditions || null,
      image_url || null
    );

    res.status(201).json({
      success: true,
      data: { id: info.lastInsertRowid, ...req.body }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/v1/events/:id
app.put('/api/v1/events/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url } = req.body;

    const stmt = db.prepare(`
      UPDATE events
      SET title = ?, calendar_type = ?, day = ?, month = ?, category = ?, status = ?,
          summary = ?, meaning = ?, traditions = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const info = stmt.run(
      title,
      calendar_type,
      day,
      month,
      category,
      status,
      summary,
      meaning,
      traditions,
      image_url,
      id
    );

    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }

    res.json({ success: true, message: 'Cập nhật sự kiện thành công' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/events/:id
app.delete('/api/v1/events/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const info = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }
    res.json({ success: true, message: 'Đã xóa sự kiện' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/quotes
app.get('/api/v1/quotes', (req: Request, res: Response) => {
  try {
    const quotes = db.prepare('SELECT * FROM daily_quotes').all();
    res.json({ success: true, data: quotes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/config
app.get('/api/v1/config', (req: Request, res: Response) => {
  try {
    const configs = db.prepare('SELECT * FROM app_config').all();
    const configMap = (configs as any[]).reduce((acc: any, cur: any) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {});
    res.json({ success: true, data: configMap });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/stats
app.get('/api/v1/stats', (req: Request, res: Response) => {
  try {
    const totalEvents = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
    const activeEvents = (db.prepare("SELECT COUNT(*) as count FROM events WHERE status = 'active'").get() as any).count;
    const lunarEvents = (db.prepare("SELECT COUNT(*) as count FROM events WHERE calendar_type = 'lunar'").get() as any).count;
    const stats = db.prepare('SELECT * FROM analytics_stats ORDER BY date DESC LIMIT 7').all();

    res.json({
      success: true,
      data: {
        totalEvents,
        activeEvents,
        lunarEvents,
        recentStats: stats
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 Lịch Việt Backend Server & Admin CMS Live!`);
  console.log(`📍 Web Admin CMS:   http://localhost:${PORT}/admin`);
  console.log(`📍 REST API:        http://localhost:${PORT}/api/v1`);
  console.log(`================================================`);
});
