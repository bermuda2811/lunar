import dns from 'dns';
import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const rawHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USERNAME || process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'root';
const dbName = process.env.DB_DATABASE || process.env.DB_NAME || 'luna';

let poolInstance: Pool | null = null;

export async function getPool(): Promise<Pool> {
  if (!poolInstance) {
    let resolvedHost = rawHost;
    if (rawHost === 'mysql' || rawHost === 'shared_mysql') {
      try {
        await dns.promises.lookup(rawHost);
        resolvedHost = rawHost;
      } catch {
        // Khi chạy trực tiếp trên máy host (ngoài mạng docker), 'shared_mysql' chưa trỏ DNS
        // Tự động kết nối tới port 3306 được ánh xạ ở 127.0.0.1
        resolvedHost = '127.0.0.1';
      }
    }

    poolInstance = mysql.createPool({
      host: resolvedHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return poolInstance;
}

export const pool: Pool = new Proxy({} as Pool, {
  get(target, prop) {
    return async (...args: any[]) => {
      const realPool = await getPool();
      const fn = (realPool as any)[prop];
      if (typeof fn === 'function') {
        return fn.apply(realPool, args);
      }
      return fn;
    };
  }
});

export const db = {
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  },

  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const [rows] = await pool.query(sql, params);
    const arr = rows as T[];
    return arr.length > 0 ? arr[0] : undefined;
  },

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  },

  async run(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId: number }> {
    const [result] = await pool.query(sql, params) as any;
    return {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
    };
  },

  async execute(sql: string, params: any[] = []): Promise<any> {
    const [result] = await pool.execute(sql, params);
    return result;
  }
};

export async function initDatabase() {
  const activePool = await getPool();
  console.log(`[DATABASE] Đang kết nối MySQL: ${dbUser}@${rawHost}:${dbPort}/${dbName}`);

  // 1. Events table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      calendar_type VARCHAR(20) NOT NULL DEFAULT 'solar',
      day INT NOT NULL,
      month INT NOT NULL,
      category VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      summary TEXT,
      meaning TEXT,
      traditions TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Daily quotes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_quotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quote TEXT NOT NULL,
      author VARCHAR(255),
      applicable_day INT,
      applicable_month INT,
      theme VARCHAR(50) DEFAULT 'general'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. App config table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_config (
      \`key\` VARCHAR(100) PRIMARY KEY,
      \`value\` TEXT NOT NULL,
      description VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Analytics stats table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date VARCHAR(20) NOT NULL,
      active_users INT DEFAULT 0,
      reminders_created INT DEFAULT 0,
      page_views INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(100) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      name VARCHAR(255),
      avatar TEXT,
      is_guest TINYINT DEFAULT 1,
      auth_provider VARCHAR(50) DEFAULT 'guest',
      role VARCHAR(50) DEFAULT 'user',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. User reminders table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_reminders (
      id VARCHAR(100) PRIMARY KEY,
      user_id VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      calendar_type VARCHAR(20) NOT NULL DEFAULT 'both',
      solar_date VARCHAR(20) NOT NULL,
      lunar_day INT NOT NULL,
      lunar_month INT NOT NULL,
      lunar_year INT NULL,
      lunar_formatted VARCHAR(100) NULL,
      is_leap_month TINYINT DEFAULT 0,
      time VARCHAR(20) DEFAULT 'all_day',
      repeat_type VARCHAR(50) DEFAULT 'yearly',
      remind_before_days INT DEFAULT 1,
      icon VARCHAR(50) DEFAULT 'cake',
      notes TEXT,
      is_completed TINYINT DEFAULT 0,
      sync_status TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_reminders_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 7. Email OTP table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_otps (
      email VARCHAR(255) PRIMARY KEY,
      otp_code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 8. Donation config table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS donation_config (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bank_bin VARCHAR(20) NOT NULL DEFAULT '970422',
      bank_name VARCHAR(255) NOT NULL DEFAULT 'MB Bank (Ngân hàng Quân Đội)',
      account_number VARCHAR(50) NOT NULL DEFAULT '0988668899',
      account_holder VARCHAR(255) NOT NULL DEFAULT 'NGUYEN TRUNG',
      qr_template VARCHAR(50) NOT NULL DEFAULT 'compact2',
      custom_qr_url TEXT,
      suggested_amounts TEXT NOT NULL,
      momo_phone VARCHAR(50) DEFAULT '0988668899',
      momo_name VARCHAR(255) DEFAULT 'NGUYEN TRUNG',
      transfer_syntax VARCHAR(50) NOT NULL DEFAULT 'LICHVIET',
      thank_you_message TEXT NOT NULL,
      is_active TINYINT NOT NULL DEFAULT 1,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 9. Transactions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(100) PRIMARY KEY,
      user_id VARCHAR(100) NULL,
      amount INT NOT NULL,
      currency VARCHAR(10) DEFAULT 'VND',
      payment_method VARCHAR(50) NOT NULL DEFAULT 'vietqr',
      transaction_code VARCHAR(100) UNIQUE NOT NULL,
      sender_name VARCHAR(255),
      sender_email VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      is_anonymous TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL,
      INDEX idx_transactions_status (status),
      INDEX idx_transactions_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default donation config if empty
  const [donationRows] = await pool.query('SELECT COUNT(*) as count FROM donation_config') as any;
  if (donationRows[0].count === 0) {
    await pool.query(`
      INSERT INTO donation_config (
        bank_bin, bank_name, account_number, account_holder,
        qr_template, suggested_amounts, momo_phone, momo_name,
        transfer_syntax, thank_you_message, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '970422',
      'MB Bank (Ngân hàng Quân Đội)',
      '0988668899',
      'NGUYEN TRUNG',
      'compact2',
      JSON.stringify([10000, 30000, 50000, 100000, 200000]),
      '0988668899',
      'NGUYEN TRUNG',
      'LICHVIET',
      'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm và sự đồng hành của bạn! Chúc bạn và gia quyến luôn vạn sự cát tường, an khang thịnh vượng!',
      1
    ]);
  }


  // Seed events if empty
  const [eventRows] = await pool.query('SELECT COUNT(*) as count FROM events') as any;
  if (eventRows[0].count === 0) {
    const seedEvents = [
      ['Tết Dương lịch', 'solar', 1, 1, 'Lễ Việt Nam', 'active', 'Ngày đầu tiên của năm mới theo Dương lịch', 'Khởi đầu một năm mới với nhiều hy vọng, may mắn và hạnh phúc.', 'Đón giao thừa, sum họp bạn bè, chúc Tết đầu năm.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
      ['Tết Nguyên Đán', 'solar', 26, 1, 'Lễ Việt Nam', 'active', 'Tết cổ truyền lớn nhất của dân tộc Việt Nam (29 tháng Chạp)', 'Dịp đoàn tụ gia đình thiêng liêng nhất, tạ ơn tổ tiên và đón chào năm mới an khang thịnh vượng.', 'Gói bánh chưng, cúng tất niên, chúc Tết ông bà cha mẹ, mừng tuổi đầu xuân.', 'https://images.unsplash.com/photo-1548625361-16eb1cb19999?w=800'],
      ['Rằm tháng Giêng', 'lunar', 15, 1, 'Âm lịch', 'active', 'Tết Thượng Nguyên - Cúng cả năm không bằng Rằm tháng Giêng', 'Cầu mong sự bình an, giải hạn và phúc lộc cho cả gia đình trong cả năm.', 'Đi chùa cầu an, ăn chay, làm lễ cúng gia tiên thịnh soạn.', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800'],
      ['Giỗ Tổ Hùng Vương', 'lunar', 10, 3, 'Lễ Việt Nam', 'active', 'Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba', 'Tưởng nhớ công ơn dựng nước của các Vua Hùng, phát huy tinh thần yêu nước và uống nước nhớ nguồn.', 'Lễ rước kiệu, dâng hương tại Đền Hùng Phú Thọ, các hoạt động văn hóa dân gian.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'],
      ['Ngày Giải phóng miền Nam', 'solar', 30, 4, 'Lễ Việt Nam', 'active', 'Kỷ niệm ngày Thống nhất non sông đất nước (30/4/1975)', 'Khẳng định độc lập chủ quyền, tri ân các anh hùng liệt sĩ đã hy sinh vì Tổ quốc.', 'Mít tinh, văn nghệ kỷ niệm, thăm viếng nghĩa trang liệt sĩ.', 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800'],
      ['Quốc tế Lao động', 'solar', 1, 5, 'Quốc tế', 'active', 'Ngày kỷ niệm phong trào công nhân và người lao động toàn cầu', 'Tôn vinh giá trị của sức lao động chân chính và đoàn kết của giai cấp công nhân.', 'Nghỉ ngơi, du lịch, họp mặt gia đình.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'],
      ['Ngày Quốc tế Bảo vệ Tầng Ozone', 'solar', 16, 9, 'Quốc tế', 'active', 'Nâng cao ý thức bảo vệ môi trường và bầu khí quyển của Trái Đất', 'Nhắc nhở trách nhiệm bảo vệ hành tinh xanh cho các thế hệ tương lai.', 'Tuyên truyền môi trường, giảm thiểu khí thải nhà kính.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'],
      ['Tết Trung Thu', 'lunar', 15, 8, 'Âm lịch', 'active', 'Rằm tháng 8 - Tết của tình thân, sum vầy và đoàn viên gia đình', 'Tết Trung Thu là dịp để gia đình sum vầy, trẻ em được vui chơi, rước đèn, phá cỗ. Đây cũng là dịp thể hiện tình thân và truyền thống văn hóa tốt đẹp của dân tộc.', '• Rước đèn ông sao, múa lân sư rồng\n• Phá cỗ trông trăng, ăn bánh nướng, bánh dẻo\n• Tặng quà và chúc phúc cho người thân', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'],
      ['Ngày Quốc khánh 2/9', 'solar', 2, 9, 'Lễ Việt Nam', 'active', 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình (1945)', 'Khai sinh ra nước Việt Nam Dân chủ Cộng hòa, ngày hội non sông của toàn thể nhân dân.', 'Treo cờ Tổ quốc, dâng hoa Lăng Bác, bắn pháo hoa.', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800'],
      ['Ngày Nhà giáo VN', 'solar', 20, 11, 'Lễ Việt Nam', 'active', 'Tôn vinh nghề giáo cao quý và truyền thống Tôn sư trọng đạo', 'Tri ân các thầy cô giáo đã tận tụy dạy dỗ, truyền đạt tri thức và đạo làm người.', 'Tặng hoa thầy cô, họp lớp, lễ tri ân tại các trường học.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'],
      ['Giáng Sinh', 'solar', 24, 12, 'Quốc tế', 'active', 'Lễ hội mừng Chúa Giáng sinh và dịp an lành cuối năm', 'Cầu chúc hòa bình, an lành, tình yêu thương và sẻ chia giữa mọi người.', 'Trang trí cây thông noel, tặng quà, đi nhà thờ cầu nguyện.', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800']
    ];

    for (const ev of seedEvents) {
      await pool.query(`
        INSERT INTO events (title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, ev);
    }
  }

  // Seed quotes if empty
  const [quoteRows] = await pool.query('SELECT COUNT(*) as count FROM daily_quotes') as any;
  if (quoteRows[0].count === 0) {
    await pool.query(`
      INSERT INTO daily_quotes (quote, author, applicable_day, applicable_month, theme) VALUES
      ('Trung thu là tết của tình thân, là dịp để gia đình sum vầy.', 'Dân gian', 15, 8, 'mid_autumn'),
      ('An khang thịnh vượng, vạn sự như ý.', 'Lời chúc Tết', 1, 1, 'tet'),
      ('Mỗi ngày mới là một khởi đầu bình an và trọn vẹn.', 'Lịch An Nhiên', null, null, 'daily'),
      ('Gia đình là điểm tựa bình yên nhất của đời người.', 'Danh ngôn', null, null, 'family'),
      ('Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây.', 'Tục ngữ Việt Nam', 10, 3, 'tradition')
    `);
  }

  // Seed app config if empty
  const [configRows] = await pool.query('SELECT COUNT(*) as count FROM app_config') as any;
  if (configRows[0].count === 0) {
    await pool.query(`
      INSERT INTO app_config (\`key\`, \`value\`, description) VALUES
      ('app_name', 'Lịch An Nhiên', 'Tên ứng dụng'),
      ('zodiac_year_2025', 'Ất Tỵ', 'Con giáp năm 2025'),
      ('zodiac_year_2026', 'Bính Ngọ', 'Con giáp năm 2026'),
      ('splash_greeting', 'An khang • Thịnh vượng • Vạn sự như ý', 'Lời chúc khởi đầu'),
      ('slogan', 'Giữ truyền thống, gần gũi mỗi ngày!', 'Khẩu hiệu sản phẩm')
    `);
  }

  // Seed stats if empty
  const [statRows] = await pool.query('SELECT COUNT(*) as count FROM analytics_stats') as any;
  if (statRows[0].count === 0) {
    await pool.query(`
      INSERT INTO analytics_stats (date, active_users, reminders_created, page_views) VALUES
      ('2026-09-16', 1420, 85, 4890),
      ('2026-09-17', 1530, 92, 5120),
      ('2026-09-18', 1680, 104, 5630)
    `);
  }

  console.log(`✅ [MYSQL] Khởi tạo cơ sở dữ liệu MySQL ${dbName} thành công!`);
}
