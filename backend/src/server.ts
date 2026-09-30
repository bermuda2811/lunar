import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { db, initDatabase } from './database';
import { getAdminHtml } from './admin/adminHtml';
import { getFullDayData, solarToLunar, getDayOfWeekName } from '../../shared/calendar/lunarCalendar';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Initialize MySQL database & tables
initDatabase().catch(err => {
  console.error('[DATABASE] Lỗi khởi tạo MySQL:', err);
});

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
    database: 'mysql',
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/calendar/day?date=YYYY-MM-DD
app.get('/api/v1/calendar/day', async (req: Request, res: Response) => {
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

    // Fetch relevant events from MySQL for this solar or lunar date
    const events = await db.all(`
      SELECT * FROM events 
      WHERE status = 'active' AND (
        (calendar_type = 'solar' AND day = ? AND month = ?) OR
        (calendar_type = 'lunar' AND day = ? AND month = ?)
      )
    `, [day, month, lunar.day, lunar.month]);

    // Fetch daily quote
    let quote = await db.get(`
      SELECT quote, author FROM daily_quotes 
      WHERE applicable_day = ? AND applicable_month = ?
      LIMIT 1
    `, [lunar.day, lunar.month]);

    if (!quote) {
      quote = await db.get(`
        SELECT quote, author FROM daily_quotes 
        WHERE theme = 'daily' OR applicable_day IS NULL 
        ORDER BY RAND() LIMIT 1
      `);
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
app.get('/api/v1/events', async (req: Request, res: Response) => {
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

    const events = await db.all(query, params);

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
app.get('/api/v1/events/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const event = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/events
app.post('/api/v1/events', async (req: Request, res: Response) => {
  try {
    const { title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url } = req.body;

    if (!title || !day || !month) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ tên, ngày và tháng' });
    }

    const info = await db.run(`
      INSERT INTO events (title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ]);

    res.status(201).json({
      success: true,
      data: { id: info.insertId, ...req.body }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/v1/events/:id
app.put('/api/v1/events/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url } = req.body;

    const info = await db.run(`
      UPDATE events
      SET title = ?, calendar_type = ?, day = ?, month = ?, category = ?, status = ?,
          summary = ?, meaning = ?, traditions = ?, image_url = ?
      WHERE id = ?
    `, [
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
    ]);

    if (info.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }

    res.json({ success: true, message: 'Cập nhật sự kiện thành công' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/events/:id
app.delete('/api/v1/events/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const info = await db.run('DELETE FROM events WHERE id = ?', [id]);
    if (info.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }
    res.json({ success: true, message: 'Đã xóa sự kiện' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/quotes
app.get('/api/v1/quotes', async (req: Request, res: Response) => {
  try {
    const quotes = await db.all('SELECT * FROM daily_quotes');
    res.json({ success: true, data: quotes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/config
app.get('/api/v1/config', async (req: Request, res: Response) => {
  try {
    const configs = await db.all('SELECT * FROM app_config');
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
app.get('/api/v1/stats', async (req: Request, res: Response) => {
  try {
    const totalEventsRow = await db.get('SELECT COUNT(*) as count FROM events');
    const totalEvents = totalEventsRow?.count || 0;
    const activeEventsRow = await db.get("SELECT COUNT(*) as count FROM events WHERE status = 'active'");
    const activeEvents = activeEventsRow?.count || 0;
    const lunarEventsRow = await db.get("SELECT COUNT(*) as count FROM events WHERE calendar_type = 'lunar'");
    const lunarEvents = lunarEventsRow?.count || 0;
    const stats = await db.all('SELECT * FROM analytics_stats ORDER BY date DESC LIMIT 7');

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

// --- AUTH & USER ENDPOINTS ---

// POST /api/v1/auth/guest: Register or confirm anonymous guest account
app.post('/api/v1/auth/guest', async (req: Request, res: Response) => {
  try {
    const guestId = req.body.guestId || ('guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));
    const existing = await db.get('SELECT * FROM users WHERE id = ?', [guestId]);
    if (!existing) {
      await db.run('INSERT INTO users (id, is_guest) VALUES (?, 1)', [guestId]);
    } else {
      await db.run("UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?", [guestId]);
    }
    res.json({
      success: true,
      data: {
        id: guestId,
        isGuest: true
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function generateOtpEmailHtml(otp: string, email: string) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Mã xác nhận Lịch An Nhiên</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FDFBF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1E293B;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:20px auto;background:#ffffff;border-radius:20px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#B3261E 0%,#8B1D1D 100%);padding:28px 20px;color:#ffffff;">
            <h1 style="margin:0 0 6px 0;font-size:22px;font-weight:bold;letter-spacing:1px;">LỊCH AN NHIÊN</h1>
            <p style="margin:0;font-size:13px;opacity:0.9;font-style:italic;">Giữ truyền thống, gần gũi mỗi ngày!</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;">
            <p style="font-size:15px;font-weight:600;margin:0 0 12px 0;color:#0F172A;">
              Kính chào quý vị,
            </p>
            <p style="font-size:14px;line-height:22px;color:#475569;margin:0 0 20px 0;">
              Bạn vừa yêu cầu đăng nhập vào ứng dụng <strong>Lịch An Nhiên (Lịch Việt)</strong> bằng hòm thư <strong>${email}</strong>.
              Dưới đây là mã xác nhận một lần (OTP) của bạn:
            </p>

            <div style="background:#FFF1F2;border:2px dashed #B3261E;border-radius:16px;padding:20px;text-align:center;margin:0 0 20px 0;">
              <div style="font-size:12px;font-weight:bold;color:#9F1239;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                Mã xác nhận 6 số của bạn
              </div>
              <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#B3261E;font-family:monospace;">
                ${otp}
              </div>
              <div style="font-size:12px;color:#E11D48;margin-top:8px;">
                ⏱ Mã có hiệu lực trong vòng <strong>10 phút</strong>
              </div>
            </div>

            <p style="font-size:13px;line-height:20px;color:#64748B;margin:0 0 8px 0;">
              🔒 <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai.
            </p>
            <p style="font-size:12px;line-height:18px;color:#94A3B8;margin:0;">
              Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email. Dữ liệu ngày giỗ, lịch cúng của bạn vẫn hoàn toàn được bảo mật.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#F8FAFC;padding:16px;text-align:center;border-top:1px solid #F1F5F9;font-size:12px;color:#94A3B8;">
            © 2026 Lịch An Nhiên (Lịch Việt) — Bản quyền thuộc về đội ngũ phát triển.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// POST /api/v1/auth/send-otp: Send 6-digit OTP to email via Resend
app.post('/api/v1/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '); // 10 mins

    await db.run(`
      INSERT INTO email_otps (email, otp_code, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)
    `, [cleanEmail, otp, expiresAt]);

    let sentViaResend = false;
    if (resend) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Lịch An Nhiên <onboarding@resend.dev>';
        const sendResult = await resend.emails.send({
          from: fromEmail,
          to: cleanEmail,
          subject: `[Lịch An Nhiên] Mã xác nhận đăng nhập của bạn là: ${otp}`,
          html: generateOtpEmailHtml(otp, cleanEmail),
        });
        if (sendResult.error) {
          console.error('[RESEND API ERROR]', sendResult.error);
        } else {
          sentViaResend = true;
          console.log(`[RESEND SUCCESS] Sent real OTP to ${cleanEmail}, Email ID: ${sendResult.data?.id}`);
        }
      } catch (err: any) {
        console.error('[RESEND EXCEPTION]', err.message || err);
      }
    } else {
      console.log(`[AUTH] Resend API key not configured. Mock OTP for ${cleanEmail}: ${otp}`);
    }

    res.json({
      success: true,
      message: sentViaResend
        ? 'Mã xác nhận 6 số đã được gửi tới email của bạn.'
        : 'Mã xác nhận 6 số đã được tạo (Mã thử nghiệm: 123456).',
      sentViaResend,
      testOtpHint: '123456',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/auth/google: Google Sign-In verification & account link
app.post('/api/v1/auth/google', async (req: Request, res: Response) => {
  try {
    const { token, credential, email, name, avatar, guestId, mergeGuestData } = req.body;

    let verifiedEmail = email;
    let verifiedName = name;
    let verifiedAvatar = avatar;
    let googleId = '';

    const googleToken = credential || token;
    if (googleToken && typeof googleToken === 'string') {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
        if (verifyRes.ok) {
          const payload = (await verifyRes.json()) as any;
          if (payload.email) {
            verifiedEmail = payload.email.toLowerCase();
            verifiedName = payload.name || verifiedName;
            verifiedAvatar = payload.picture || verifiedAvatar;
            googleId = payload.sub || '';
          }
        }
      } catch (verifyErr) {
        console.warn('[GOOGLE VERIFY WARNING]', verifyErr);
      }
    }

    if (!verifiedEmail || typeof verifiedEmail !== 'string' || !verifiedEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Không thể xác thực thông tin tài khoản Google' });
    }

    const cleanEmail = verifiedEmail.trim().toLowerCase();

    let user = await db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]) as any;
    if (!user) {
      const newUserId = 'user_g_' + (googleId || Date.now());
      await db.run(`
        INSERT INTO users (id, email, name, avatar, is_guest, auth_provider, role, status, last_login_at)
        VALUES (?, ?, ?, ?, 0, 'google', 'user', 'active', CURRENT_TIMESTAMP)
      `, [newUserId, cleanEmail, verifiedName || cleanEmail.split('@')[0], verifiedAvatar || null]);

      user = {
        id: newUserId,
        email: cleanEmail,
        name: verifiedName || cleanEmail.split('@')[0],
        avatar: verifiedAvatar,
        is_guest: 0,
        auth_provider: 'google',
        role: 'user',
        status: 'active',
      };

      if (guestId && mergeGuestData) {
        await db.run('UPDATE user_reminders SET user_id = ? WHERE user_id = ?', [newUserId, guestId]);
      }
    } else {
      await db.run(`
        UPDATE users
        SET name = COALESCE(?, name),
            avatar = COALESCE(?, avatar),
            is_guest = 0,
            auth_provider = 'google',
            status = 'active',
            last_active_at = CURRENT_TIMESTAMP,
            last_login_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [verifiedName || null, verifiedAvatar || null, user.id]);

      if (guestId && mergeGuestData) {
        await db.run('UPDATE user_reminders SET user_id = ? WHERE user_id = ?', [user.id, guestId]);
      }
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: verifiedName || user.name || cleanEmail.split('@')[0],
        avatar: verifiedAvatar || user.avatar,
        isGuest: false,
        authProvider: 'google',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/auth/verify-otp: Verify OTP and login/link account
app.post('/api/v1/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp, guestId, mergeGuestData } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Thiếu email hoặc mã xác nhận' });
    }
    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP (allow 123456 as universal test OTP, or match DB)
    const record = await db.get('SELECT * FROM email_otps WHERE email = ?', [cleanEmail]) as any;
    const isValid = otp === '123456' || (record && record.otp_code === otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Mã xác nhận không chính xác' });
    }

    // Check if user exists with this email
    let user = await db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]) as any;
    if (!user) {
      // Create new user account
      const newUserId = 'user_' + Date.now();
      await db.run(`
        INSERT INTO users (id, email, is_guest, auth_provider, role, status, last_login_at)
        VALUES (?, ?, 0, 'email_otp', 'user', 'active', CURRENT_TIMESTAMP)
      `, [newUserId, cleanEmail]);
      user = { id: newUserId, email: cleanEmail, is_guest: 0, auth_provider: 'email_otp', role: 'user' };

      // If guest data exists and merge requested, transfer reminders to new user
      if (guestId && mergeGuestData) {
        await db.run('UPDATE user_reminders SET user_id = ? WHERE user_id = ?', [newUserId, guestId]);
      }
    } else {
      // User exists, update active time
      await db.run(`
        UPDATE users 
        SET last_active_at = CURRENT_TIMESTAMP,
            last_login_at = CURRENT_TIMESTAMP,
            auth_provider = 'email_otp',
            status = 'active'
        WHERE id = ?
      `, [user.id]);
      if (guestId && mergeGuestData) {
        await db.run('UPDATE user_reminders SET user_id = ? WHERE user_id = ?', [user.id, guestId]);
      }
    }

    // Clean up used OTP
    await db.run('DELETE FROM email_otps WHERE email = ?', [cleanEmail]);

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name || cleanEmail.split('@')[0],
        avatar: user.avatar,
        isGuest: false,
        authProvider: 'email_otp',
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/user/reminders?userId=...
app.get('/api/v1/user/reminders', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'Thiếu userId' });
    }
    const reminders = await db.all('SELECT * FROM user_reminders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json({ success: true, data: reminders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/user/reminders/sync: Sync reminders for a specific user account
app.post('/api/v1/user/reminders/sync', async (req: Request, res: Response) => {
  try {
    const { userId, reminders } = req.body;
    if (!userId || !Array.isArray(reminders)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    for (const item of reminders) {
      await db.run(`
        INSERT INTO user_reminders (
          id, user_id, title, calendar_type, solar_date, lunar_day, lunar_month,
          lunar_year, lunar_formatted, is_leap_month, time, repeat_type, remind_before_days, icon, notes, is_completed, sync_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          calendar_type = VALUES(calendar_type),
          solar_date = VALUES(solar_date),
          lunar_day = VALUES(lunar_day),
          lunar_month = VALUES(lunar_month),
          lunar_year = VALUES(lunar_year),
          lunar_formatted = VALUES(lunar_formatted),
          is_leap_month = VALUES(is_leap_month),
          time = VALUES(time),
          repeat_type = VALUES(repeat_type),
          remind_before_days = VALUES(remind_before_days),
          icon = VALUES(icon),
          notes = VALUES(notes),
          is_completed = VALUES(is_completed),
          sync_status = VALUES(sync_status)
      `, [
        item.id,
        userId,
        item.title,
        item.calendarType || 'both',
        item.solarDate,
        item.lunarDay,
        item.lunarMonth,
        item.lunarYear || null,
        item.lunarFormatted || null,
        item.isLunarLeapMonth ? 1 : (item.is_leap_month ? 1 : 0),
        item.time || 'all_day',
        item.repeat || item.repeat_type || 'yearly',
        item.remindBeforeDays || item.remind_before_days || 1,
        item.icon || 'cake',
        item.notes || null,
        item.isCompleted ? 1 : 0,
        1
      ]);
    }

    const updatedList = await db.all('SELECT * FROM user_reminders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json({ success: true, data: updatedList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- DONATION & VIETQR TRANSACTION ENDPOINTS ---

function generateThankYouEmailHtml(name: string, amount: number, transactionCode: string, message?: string) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Thư tri ân từ Lịch An Nhiên</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FDFBF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1E293B;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:20px auto;background:#ffffff;border-radius:20px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#B3261E 0%,#8B1D1D 100%);padding:28px 20px;color:#ffffff;">
            <h1 style="margin:0 0 6px 0;font-size:22px;font-weight:bold;letter-spacing:1px;">LỊCH AN NHIÊN</h1>
            <p style="margin:0;font-size:13px;opacity:0.9;font-style:italic;">Giữ truyền thống, gần gũi mỗi ngày!</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;">
            <div style="text-align:center;margin-bottom:20px;">
              <span style="font-size:40px;">🧧</span>
              <h2 style="font-size:18px;color:#B3261E;margin:8px 0 4px 0;">THƯ TRI ÂN TẤM LÒNG VÀNG</h2>
              <p style="font-size:13px;color:#64748B;margin:0;">Mã ủng hộ: <strong>${transactionCode}</strong></p>
            </div>

            <p style="font-size:15px;font-weight:600;margin:0 0 12px 0;color:#0F172A;">
              Kính gửi Quý bạn <strong>${name}</strong>,
            </p>
            <p style="font-size:14px;line-height:22px;color:#475569;margin:0 0 16px 0;">
              Đội ngũ phát triển <strong>Lịch An Nhiên (Lịch Việt)</strong> đã nhận được món quà ủng hộ trị giá 
              <strong style="color:#B3261E;font-size:16px;">${amount.toLocaleString('vi-VN')} VNĐ</strong> từ bạn.
            </p>

            ${message ? `
              <div style="background:#FFF8F0;border-left:4px solid #D97706;border-radius:8px;padding:12px 16px;margin:0 0 20px 0;">
                <p style="font-size:12px;font-weight:bold;color:#B45309;margin:0 0 4px 0;">Lời nhắn của bạn:</p>
                <p style="font-size:13px;font-style:italic;color:#78350F;margin:0;">"${message}"</p>
              </div>
            ` : ''}

            <p style="font-size:14px;line-height:22px;color:#475569;margin:0 0 16px 0;">
              Nhờ có sự tiếp sức quý báu này, ứng dụng sẽ tiếp tục duy trì hoạt động hoàn toàn miễn phí, không chèn quảng cáo và không ngừng hoàn thiện để phục vụ cộng đồng, đặc biệt là các bậc cao niên.
            </p>

            <p style="font-size:14px;line-height:22px;color:#475569;margin:0 0 20px 0;">
              Kính chúc bạn và toàn thể gia đình luôn dồi dào sức khỏe, an khang thịnh vượng, vạn sự cát tường và an yên!
            </p>

            <div style="text-align:right;border-top:1px dashed #E2E8F0;padding-top:16px;">
              <p style="font-size:13px;font-weight:bold;color:#0F172A;margin:0;">Đội ngũ Lịch An Nhiên</p>
              <p style="font-size:12px;color:#94A3B8;margin:2px 0 0 0;">Trân trọng cảm ơn</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#F8FAFC;padding:16px;text-align:center;border-top:1px solid #F1F5F9;font-size:12px;color:#94A3B8;">
            © 2026 Lịch An Nhiên (Lịch Việt) — Giữ gìn nét đẹp văn hóa Việt Nam.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// GET /api/v1/donation/config & GET /api/v1/donation: Lấy thông tin cấu hình QR Code & Tài khoản nhận
app.get(['/api/v1/donation', '/api/v1/donation/config'], async (req: Request, res: Response) => {
  try {
    const config = await db.get('SELECT * FROM donation_config LIMIT 1') as any;
    if (!config) {
      return res.json({
        success: true,
        data: {
          bankBin: '970422',
          bankName: 'MB Bank (Ngân hàng Quân Đội)',
          accountNumber: '0988668899',
          accountHolder: 'NGUYEN TRUNG',
          qrTemplate: 'compact2',
          suggestedAmounts: [10000, 30000, 50000, 100000, 200000],
          momoPhone: '0988668899',
          momoName: 'NGUYEN TRUNG',
          transferSyntax: 'LICHVIET',
          thankYouMessage: 'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm của bạn!',
          isActive: 1,
          defaultVietQrUrl: 'https://img.vietqr.io/image/970422-0988668899-compact2.png?amount=0&addInfo=LICHVIET&accountName=NGUYEN%20TRUNG',
        }
      });
    }

    let parsedAmounts = [10000, 30000, 50000, 100000, 200000];
    try {
      if (config.suggested_amounts) {
        parsedAmounts = JSON.parse(config.suggested_amounts);
      }
    } catch (e) {}

    const defaultVietQrUrl = `https://img.vietqr.io/image/${config.bank_bin || '970422'}-${config.account_number}-${config.qr_template || 'compact2'}.png?amount=0&addInfo=${encodeURIComponent(config.transfer_syntax || 'LICHVIET')}&accountName=${encodeURIComponent(config.account_holder)}`;

    res.json({
      success: true,
      data: {
        id: config.id,
        bankBin: config.bank_bin || '970422',
        bankName: config.bank_name,
        accountNumber: config.account_number,
        accountHolder: config.account_holder,
        qrTemplate: config.qr_template || 'compact2',
        customQrUrl: config.custom_qr_url,
        suggestedAmounts: parsedAmounts,
        momoPhone: config.momo_phone,
        momoName: config.momo_name || config.account_holder,
        transferSyntax: config.transfer_syntax || 'LICHVIET',
        thankYouMessage: config.thank_you_message,
        isActive: config.is_active === 1,
        defaultVietQrUrl,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/donation/config: Cập nhật cấu hình QR & tài khoản nhận (cho Admin CMS)
app.post('/api/v1/donation/config', async (req: Request, res: Response) => {
  try {
    const {
      bankBin, bankName, accountNumber, accountHolder,
      qrTemplate, customQrUrl, suggestedAmounts,
      momoPhone, momoName, transferSyntax, thankYouMessage, isActive
    } = req.body;

    const suggestedAmountsStr = Array.isArray(suggestedAmounts) 
      ? JSON.stringify(suggestedAmounts) 
      : '[10000, 30000, 50000, 100000, 200000]';

    const existing = await db.get('SELECT id FROM donation_config LIMIT 1') as any;
    if (existing) {
      await db.run(`
        UPDATE donation_config
        SET bank_bin = COALESCE(?, bank_bin),
            bank_name = COALESCE(?, bank_name),
            account_number = COALESCE(?, account_number),
            account_holder = COALESCE(?, account_holder),
            qr_template = COALESCE(?, qr_template),
            custom_qr_url = ?,
            suggested_amounts = ?,
            momo_phone = ?,
            momo_name = ?,
            transfer_syntax = COALESCE(?, transfer_syntax),
            thank_you_message = COALESCE(?, thank_you_message),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        bankBin, bankName, accountNumber, accountHolder,
        qrTemplate, customQrUrl || null, suggestedAmountsStr,
        momoPhone || null, momoName || null, transferSyntax, thankYouMessage,
        isActive !== undefined ? (isActive ? 1 : 0) : 1,
        existing.id
      ]);
    } else {
      await db.run(`
        INSERT INTO donation_config (
          bank_bin, bank_name, account_number, account_holder,
          qr_template, custom_qr_url, suggested_amounts,
          momo_phone, momo_name, transfer_syntax, thank_you_message, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bankBin || '970422', bankName || 'MB Bank', accountNumber, accountHolder,
        qrTemplate || 'compact2', customQrUrl || null, suggestedAmountsStr,
        momoPhone || null, momoName || null, transferSyntax || 'LICHVIET',
        thankYouMessage, isActive ? 1 : 0
      ]);
    }

    res.json({ success: true, message: 'Cập nhật cấu hình ủng hộ thành công' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/donation/transactions: Tạo giao dịch ủng hộ với mã thanh toán riêng & VietQR động
app.post('/api/v1/donation/transactions', async (req: Request, res: Response) => {
  try {
    const { userId, amount, paymentMethod, senderName, senderEmail, message, isAnonymous } = req.body;

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền ủng hộ không hợp lệ' });
    }

    // Lấy config hiện tại từ MySQL
    const config = await db.get('SELECT * FROM donation_config LIMIT 1') as any;
    const bankBin = config?.bank_bin || '970422';
    const accNumber = config?.account_number || '0988668899';
    const accHolder = config?.account_holder || 'NGUYEN TRUNG';
    const qrTemplate = config?.qr_template || 'compact2';
    const syntaxPrefix = config?.transfer_syntax || 'LICHVIET';

    // Tạo mã giao dịch duy nhất
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const transactionCode = `${syntaxPrefix}_${randomCode}`;
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const displayName = isAnonymous ? 'Nhà hảo tâm ẩn danh' : (senderName?.trim() || 'Người dùng Lịch An Nhiên');

    // Lưu vào bảng transactions trong MySQL
    await db.run(`
      INSERT INTO transactions (
        id, user_id, amount, currency, payment_method, transaction_code,
        sender_name, sender_email, message, status, is_anonymous
      ) VALUES (?, ?, ?, 'VND', ?, ?, ?, ?, ?, 'pending', ?)
    `, [
      txnId,
      userId || null,
      parsedAmount,
      paymentMethod || 'vietqr',
      transactionCode,
      displayName,
      senderEmail?.trim() || null,
      message?.trim() || null,
      isAnonymous ? 1 : 0
    ]);

    // Sinh đường dẫn VietQR động chuẩn xác cho đúng giao dịch này
    const dynamicVietQrUrl = `https://img.vietqr.io/image/${bankBin}-${accNumber}-${qrTemplate}.png?amount=${parsedAmount}&addInfo=${encodeURIComponent(transactionCode)}&accountName=${encodeURIComponent(accHolder)}`;

    res.json({
      success: true,
      data: {
        id: txnId,
        transactionCode,
        amount: parsedAmount,
        currency: 'VND',
        paymentMethod: paymentMethod || 'vietqr',
        senderName: displayName,
        senderEmail: senderEmail || null,
        message: message || null,
        status: 'pending',
        isAnonymous: isAnonymous ? 1 : 0,
        vietQrUrl: dynamicVietQrUrl,
        bankInfo: {
          bankBin,
          bankName: config?.bank_name || 'MB Bank (Ngân hàng Quân Đội)',
          accountNumber: accNumber,
          accountHolder: accHolder,
          syntax: transactionCode,
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/donation/transactions: Lấy danh sách giao dịch (cho Admin hoặc Bảng vàng tri ân)
app.get('/api/v1/donation/transactions', async (req: Request, res: Response) => {
  try {
    const { status, limit, publicOnly } = req.query;
    const maxLimit = Math.min(parseInt(limit as string, 10) || 20, 100);

    if (publicOnly === 'true' || publicOnly === '1') {
      // Chỉ lấy các giao dịch thành công cho bảng tri ân công khai
      const list = await db.all(`
        SELECT id, amount, currency, payment_method, sender_name, message, is_anonymous, created_at, completed_at
        FROM transactions
        WHERE status = 'completed'
        ORDER BY created_at DESC
        LIMIT ?
      `, [maxLimit]) as any[];

      const sanitized = list.map(item => ({
        ...item,
        sender_name: item.is_anonymous ? 'Nhà hảo tâm ẩn danh' : item.sender_name,
      }));

      return res.json({ success: true, data: sanitized });
    }

    // Admin query: Lấy đầy đủ
    let query = 'SELECT * FROM transactions';
    const params: any[] = [];
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(maxLimit);

    const rows = await db.all(query, params);
    res.json({ success: true, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/v1/donation/transactions/:id/confirm: Xác nhận giao dịch thành công & gửi thư cảm ơn
app.patch('/api/v1/donation/transactions/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const txn = await db.get('SELECT * FROM transactions WHERE id = ?', [id]) as any;
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }

    await db.run(`
      UPDATE transactions
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    // Gửi email cảm ơn nếu có sender_email và Resend đã cấu hình
    if (txn.sender_email && resend) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Lịch An Nhiên <onboarding@resend.dev>';
        await resend.emails.send({
          from: fromEmail,
          to: txn.sender_email,
          subject: `🧧 Thư tri ân tấm lòng vàng từ Lịch An Nhiên (${txn.transaction_code})`,
          html: generateThankYouEmailHtml(
            txn.sender_name || 'Quý bạn',
            txn.amount,
            txn.transaction_code,
            txn.message
          ),
        });
        console.log(`[DONATION] Đã gửi thư cảm ơn tới ${txn.sender_email}`);
      } catch (emailErr) {
        console.warn('[DONATION EMAIL WARN]', emailErr);
      }
    }

    const updated = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 Lịch Việt Backend Server & Admin CMS Live!`);
  console.log(`🗄️ Database:        MySQL (database: ${process.env.DB_NAME || 'lich_an_nhien'})`);
  console.log(`📍 Web Admin CMS:   http://localhost:${PORT}/admin`);
  console.log(`📍 REST API:        http://localhost:${PORT}/api/v1`);
  console.log(`================================================`);
});
