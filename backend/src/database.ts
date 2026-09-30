import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'calendar.db');
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      calendar_type TEXT NOT NULL DEFAULT 'solar',
      day INTEGER NOT NULL,
      month INTEGER NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      summary TEXT,
      meaning TEXT,
      traditions TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Daily quotes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      author TEXT,
      applicable_day INTEGER,
      applicable_month INTEGER,
      theme TEXT DEFAULT 'general'
    );
  `);

  // 3. App config table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT
    );
  `);

  // 4. Analytics stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      active_users INTEGER DEFAULT 0,
      reminders_created INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0
    );
  `);

  // Check if events need seeding
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM events');
  const result = countStmt.get() as { count: number };

  if (result.count === 0) {
    console.log('Seeding initial events matching wireframe...');
    const insertEvent = db.prepare(`
      INSERT INTO events (title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Matches Screen 11 wireframe table:
    // 1/1: Tết Dương lịch (Lễ Việt Nam)
    // 26/1: Tết Nguyên Đán (Lễ Việt Nam)
    // 15/8: Tết Trung Thu (Âm lịch)
    // 20/11: Ngày Nhà giáo VN (Lễ Việt Nam)
    // 24/12: Giáng Sinh (Quốc tế)
    // Plus other traditional Vietnamese holidays from Screen 9 & 10
    const seedEvents = [
      {
        title: 'Tết Dương lịch',
        calendar_type: 'solar',
        day: 1,
        month: 1,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Ngày đầu tiên của năm mới theo Dương lịch',
        meaning: 'Khởi đầu một năm mới với nhiều hy vọng, may mắn và hạnh phúc.',
        traditions: 'Đón giao thừa, sum họp bạn bè, chúc Tết đầu năm.',
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
      },
      {
        title: 'Tết Nguyên Đán',
        calendar_type: 'solar',
        day: 26,
        month: 1,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Tết cổ truyền lớn nhất của dân tộc Việt Nam (29 tháng Chạp)',
        meaning: 'Dịp đoàn tụ gia đình thiêng liêng nhất, tạ ơn tổ tiên và đón chào năm mới an khang thịnh vượng.',
        traditions: 'Gói bánh chưng, cúng tất niên, chúc Tết ông bà cha mẹ, mừng tuổi đầu xuân.',
        image_url: 'https://images.unsplash.com/photo-1548625361-16eb1cb19999?w=800'
      },
      {
        title: 'Rằm tháng Giêng',
        calendar_type: 'lunar',
        day: 15,
        month: 1,
        category: 'Âm lịch',
        status: 'active',
        summary: 'Tết Thượng Nguyên - Cúng cả năm không bằng Rằm tháng Giêng',
        meaning: 'Cầu mong sự bình an, giải hạn và phúc lộc cho cả gia đình trong cả năm.',
        traditions: 'Đi chùa cầu an, ăn chay, làm lễ cúng gia tiên thịnh soạn.',
        image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800'
      },
      {
        title: 'Giỗ Tổ Hùng Vương',
        calendar_type: 'lunar',
        day: 10,
        month: 3,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba',
        meaning: 'Tưởng nhớ công ơn dựng nước của các Vua Hùng, phát huy tinh thần yêu nước và uống nước nhớ nguồn.',
        traditions: 'Lễ rước kiệu, dâng hương tại Đền Hùng Phú Thọ, các hoạt động văn hóa dân gian.',
        image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'
      },
      {
        title: 'Ngày Giải phóng miền Nam',
        calendar_type: 'solar',
        day: 30,
        month: 4,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Kỷ niệm ngày Thống nhất non sông đất nước (30/4/1975)',
        meaning: 'Khẳng định độc lập chủ quyền, tri ân các anh hùng liệt sĩ đã hy sinh vì Tổ quốc.',
        traditions: 'Mít tinh, văn nghệ kỷ niệm, thăm viếng nghĩa trang liệt sĩ.',
        image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800'
      },
      {
        title: 'Quốc tế Lao động',
        calendar_type: 'solar',
        day: 1,
        month: 5,
        category: 'Quốc tế',
        status: 'active',
        summary: 'Ngày kỷ niệm phong trào công nhân và người lao động toàn cầu',
        meaning: 'Tôn vinh giá trị của sức lao động chân chính và đoàn kết của giai cấp công nhân.',
        traditions: 'Nghỉ ngơi, du lịch, họp mặt gia đình.',
        image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
      },
      {
        title: 'Ngày Quốc tế Bảo vệ Tầng Ozone',
        calendar_type: 'solar',
        day: 16,
        month: 9,
        category: 'Quốc tế',
        status: 'active',
        summary: 'Nâng cao ý thức bảo vệ môi trường và bầu khí quyển của Trái Đất',
        meaning: 'Nhắc nhở trách nhiệm bảo vệ hành tinh xanh cho các thế hệ tương lai.',
        traditions: 'Tuyên truyền môi trường, giảm thiểu khí thải nhà kính.',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
      },
      {
        title: 'Tết Trung Thu',
        calendar_type: 'lunar',
        day: 15,
        month: 8,
        category: 'Âm lịch',
        status: 'active',
        summary: 'Rằm tháng 8 - Tết của tình thân, sum vầy và đoàn viên gia đình',
        meaning: 'Tết Trung Thu là dịp để gia đình sum vầy, trẻ em được vui chơi, rước đèn, phá cỗ. Đây cũng là dịp thể hiện tình thân và truyền thống văn hóa tốt đẹp của dân tộc.',
        traditions: '• Rước đèn ông sao, múa lân sư rồng\n• Phá cỗ trông trăng, ăn bánh nướng, bánh dẻo\n• Tặng quà và chúc phúc cho người thân',
        image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'
      },
      {
        title: 'Ngày Quốc khánh 2/9',
        calendar_type: 'solar',
        day: 2,
        month: 9,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình (1945)',
        meaning: 'Khai sinh ra nước Việt Nam Dân chủ Cộng hòa, ngày hội non sông của toàn thể nhân dân.',
        traditions: 'Treo cờ Tổ quốc, dâng hoa Lăng Bác, bắn pháo hoa.',
        image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800'
      },
      {
        title: 'Ngày Nhà giáo VN',
        calendar_type: 'solar',
        day: 20,
        month: 11,
        category: 'Lễ Việt Nam',
        status: 'active',
        summary: 'Tôn vinh nghề giáo cao quý và truyền thống Tôn sư trọng đạo',
        meaning: 'Tri ân các thầy cô giáo đã tận tụy dạy dỗ, truyền đạt tri thức và đạo làm người.',
        traditions: 'Tặng hoa thầy cô, họp lớp, lễ tri ân tại các trường học.',
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
      },
      {
        title: 'Giáng Sinh',
        calendar_type: 'solar',
        day: 24,
        month: 12,
        category: 'Quốc tế',
        status: 'active',
        summary: 'Lễ hội mừng Chúa Giáng sinh và dịp an lành cuối năm',
        meaning: 'Cầu chúc hòa bình, an lành, tình yêu thương và sẻ chia giữa mọi người.',
        traditions: 'Trang trí cây thông noel, tặng quà, đi nhà thờ cầu nguyện.',
        image_url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800'
      }
    ];

    for (const ev of seedEvents) {
      insertEvent.run(
        ev.title,
        ev.calendar_type,
        ev.day,
        ev.month,
        ev.category,
        ev.status,
        ev.summary,
        ev.meaning,
        ev.traditions,
        ev.image_url
      );
    }
  }

  // Seed daily quotes if needed
  const quoteCount = db.prepare('SELECT COUNT(*) as count FROM daily_quotes').get() as { count: number };
  if (quoteCount.count === 0) {
    const insertQuote = db.prepare('INSERT INTO daily_quotes (quote, author, applicable_day, applicable_month, theme) VALUES (?, ?, ?, ?, ?)');
    insertQuote.run('Trung thu là tết của tình thân, là dịp để gia đình sum vầy.', 'Dân gian', 15, 8, 'mid_autumn');
    insertQuote.run('An khang thịnh vượng, vạn sự như ý.', 'Lời chúc Tết', 1, 1, 'tet');
    insertQuote.run('Mỗi ngày mới là một khởi đầu bình an và trọn vẹn.', 'Lịch An Nhiên', null, null, 'daily');
    insertQuote.run('Gia đình là điểm tựa bình yên nhất của đời người.', 'Danh ngôn', null, null, 'family');
    insertQuote.run('Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây.', 'Tục ngữ Việt Nam', 10, 3, 'tradition');
  }

  // Seed app config if needed
  const configCount = db.prepare('SELECT COUNT(*) as count FROM app_config').get() as { count: number };
  if (configCount.count === 0) {
    const insertConfig = db.prepare('INSERT INTO app_config (key, value, description) VALUES (?, ?, ?)');
    insertConfig.run('app_name', 'Lịch An Nhiên', 'Tên ứng dụng');
    insertConfig.run('zodiac_year_2025', 'Ất Tỵ', 'Con giáp năm 2025');
    insertConfig.run('zodiac_year_2026', 'Bính Ngọ', 'Con giáp năm 2026');
    insertConfig.run('splash_greeting', 'An khang • Thịnh vượng • Vạn sự như ý', 'Lời chúc khởi đầu');
    insertConfig.run('slogan', 'Giữ truyền thống, gần gũi mỗi ngày!', 'Khẩu hiệu sản phẩm');
  }

  // Seed sample analytics if needed
  const statsCount = db.prepare('SELECT COUNT(*) as count FROM analytics_stats').get() as { count: number };
  if (statsCount.count === 0) {
    const insertStat = db.prepare('INSERT INTO analytics_stats (date, active_users, reminders_created, page_views) VALUES (?, ?, ?, ?)');
    insertStat.run('2026-09-16', 1420, 85, 4890);
    insertStat.run('2026-09-17', 1530, 92, 5120);
    insertStat.run('2026-09-18', 1680, 104, 5630);
  }
}
