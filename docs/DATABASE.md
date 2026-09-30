# DATABASE.md — Thiết kế Dữ liệu & Lưu trữ (Data Model & Storage)

## 1. CHIẾN LƯỢC LƯU TRỮ

Hệ thống sử dụng hai lớp dữ liệu:
1. **Local Storage (Client-side)**: Lưu trữ nhắc nhở của người dùng, cài đặt ứng dụng, và cache dữ liệu sự kiện để chạy hoàn toàn Offline.
2. **Backend Database (Server-side)**: MySQL 8.0 (Database: `lich_an_nhien`) kết nối qua Connection Pool `mysql2`, lưu trữ danh mục ngày lễ, sự kiện, câu chúc, người dùng, nhắc nhở đồng bộ, cấu hình VietQR và lịch sử giao dịch ủng hộ.

---

## 2. CLIENT LOCAL MODELS


### 2.1. Reminder Model (Nhắc nhở)
```typescript
export interface Reminder {
  id: string;                      // UUID duy nhất
  title: string;                   // Tên nhắc nhở (ví dụ: "Ngày giỗ Ông")
  calendarType: 'solar' | 'lunar' | 'both'; // Loại lịch nhắc
  
  // Thời gian chỉ định
  solarDate: string;               // Định dạng YYYY-MM-DD
  lunarDay: number;                // 1..30
  lunarMonth: number;              // 1..12
  lunarYear?: number;              // Năm âm lịch (nếu có)
  isLunarLeapMonth?: boolean;      // Tháng nhuận hay không
  
  time: string;                    // "all_day" hoặc "HH:mm" (ví dụ "18:00")
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  remindBeforeDays: number;        // 0 (đúng ngày), 1, 3, 7
  
  icon: string;                    // 'cake' | 'family' | 'heart' | 'plane' | 'star' | 'incense' | 'bell' | 'other'
  notes?: string;                  // Ghi chú tùy chọn
  
  isCompleted: boolean;            // Trạng thái hoàn thành
  createdAt: string;
  updatedAt: string;
}
```

### 2.2. AppSettings Model (Cài đặt ứng dụng)
```typescript
export interface AppSettings {
  notificationsEnabled: boolean;
  lunarDisplayMode: 'full' | 'basic' | 'date_only';
  theme: 'warm' | 'white' | 'dark' | 'light';
  fontSize: 'standard' | 'large' | 'extra_large'; // Mặc định 'large' cho người cao tuổi
  language: 'vi' | 'en';
}
```

### 2.3. UserAccount Model (Tài khoản người dùng)
```typescript
export interface UserAccount {
  id: string;                      // "guest_xxxx" hoặc "user_xxxx"
  email?: string;                  // Địa chỉ email (khi đã đăng nhập)
  isGuest: boolean;                // true nếu là tài khoản khách ngầm
  name?: string;
  avatar?: string;
  createdAt: string;
}
```

### 2.4. DonationInfo Model (Ủng hộ nhà phát triển)
```typescript
export interface DonationInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  momoPhone?: string;
  note: string;
}
```

---

## 3. SERVER DATABASE (MySQL 8.0 Schema)

Hệ thống sử dụng cơ sở dữ liệu MySQL 8.0 (Database: `lich_an_nhien`, charset `utf8mb4_unicode_ci`), kết nối qua Connection Pool `mysql2/promise`. Cấu hình linh hoạt tương thích cả mạng Docker (`DB_HOST=mysql`) lẫn máy trạm host (`127.0.0.1:3306`).

### 3.1. Bảng `events` (Sự kiện & Ngày lễ)
Khớp 100% với bảng quản lý sự kiện trên Admin CMS (Màn hình 11):
```sql
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,            -- Tên sự kiện (ví dụ: "Tết Trung Thu")
  calendar_type VARCHAR(20) NOT NULL,     -- 'solar' | 'lunar'
  day INT NOT NULL,                       -- Ngày (Dương hoặc Âm)
  month INT NOT NULL,                     -- Tháng (Dương hoặc Âm)
  category VARCHAR(50) NOT NULL,          -- 'vn_holiday' | 'intl_holiday' | 'lunar_tradition' | 'history'
  status VARCHAR(20) DEFAULT 'active',    -- 'active' (Hiển thị) | 'hidden'
  summary TEXT,                           -- Tóm tắt ngắn
  meaning TEXT,                           -- Ý nghĩa văn hóa (hiển thị ở Màn hình 10)
  traditions TEXT,                        -- Hoạt động truyền thống
  image_url TEXT,                         -- Đường dẫn ảnh minh họa banner
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3.2. Bảng `daily_quotes` (Câu chúc / Danh ngôn theo ngày)
```sql
CREATE TABLE IF NOT EXISTS daily_quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote TEXT NOT NULL,                   -- Câu chúc / danh ngôn
  author TEXT,
  applicable_day INTEGER,                -- Nếu gắn với ngày cụ thể
  applicable_month INTEGER,
  theme TEXT                             -- 'family', 'tet', 'peace', 'general'
);
```

### 3.3. Bảng `app_config` (Cấu hình linh vật & banner theo năm)
```sql
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT
);
```

### 3.4. Bảng `users` (Tài khoản người dùng & Khách)
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                   -- "guest_xxxx" hoặc "user_xxxx"
  email TEXT UNIQUE,
  is_guest INTEGER DEFAULT 1,            -- 1: Tài khoản khách, 0: Đã đăng nhập
  name TEXT,                             -- Tên người dùng hiển thị
  avatar TEXT,                           -- Ảnh đại diện Google / Tự chọn
  auth_provider TEXT DEFAULT 'guest',    -- 'guest' | 'google' | 'email_otp'
  role TEXT DEFAULT 'user',              -- 'user' | 'admin'
  status TEXT DEFAULT 'active',          -- 'active' | 'blocked'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);
```

### 3.5. Bảng `user_reminders` (Nhắc nhở phân tách theo tài khoản)
```sql
CREATE TABLE IF NOT EXISTS user_reminders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  calendar_type TEXT NOT NULL DEFAULT 'both', -- 'solar' | 'lunar' | 'both'
  solar_date TEXT NOT NULL,              -- YYYY-MM-DD
  lunar_day INTEGER NOT NULL,            -- 1..30
  lunar_month INTEGER NOT NULL,          -- 1..12
  lunar_year INTEGER,
  lunar_formatted TEXT,
  is_leap_month INTEGER DEFAULT 0,       -- 1: Tháng nhuận Âm lịch, 0: Bình thường
  time TEXT DEFAULT 'all_day',           -- 'all_day' hoặc 'HH:mm'
  repeat_type TEXT DEFAULT 'yearly',     -- 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  remind_before_days INTEGER DEFAULT 1,  -- 0, 1, 3, 7
  icon TEXT DEFAULT 'cake',
  notes TEXT,
  is_completed INTEGER DEFAULT 0,
  sync_status INTEGER DEFAULT 1,         -- 1: Synced, 0: Pending
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_reminders_user ON user_reminders(user_id);
```

### 3.6. Bảng `email_otps` (Mã xác thực OTP đăng nhập)
```sql
CREATE TABLE IF NOT EXISTS email_otps (
  email TEXT PRIMARY KEY,
  otp_code TEXT NOT NULL,
  expires_at DATETIME NOT NULL
);
```

### 3.7. Bảng `donation_config` (Cấu hình VietQR & Tài khoản nhận ủng hộ)
```sql
CREATE TABLE IF NOT EXISTS donation_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bank_bin TEXT NOT NULL DEFAULT '970422',        -- Mã BIN ngân hàng (VD: MB Bank: 970422)
  bank_name TEXT NOT NULL DEFAULT 'MB Bank (Ngân hàng Quân Đội)',
  account_number TEXT NOT NULL DEFAULT '0988668899',
  account_holder TEXT NOT NULL DEFAULT 'NGUYEN TRUNG',
  qr_template TEXT NOT NULL DEFAULT 'compact2',   -- 'compact' | 'compact2' | 'qr_only'
  custom_qr_url TEXT,
  suggested_amounts TEXT NOT NULL DEFAULT '[10000, 30000, 50000, 100000, 200000]',
  momo_phone TEXT DEFAULT '0988668899',
  momo_name TEXT DEFAULT 'NGUYEN TRUNG',
  transfer_syntax TEXT NOT NULL DEFAULT 'LICHVIET',
  thank_you_message TEXT NOT NULL DEFAULT 'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm và sự đồng hành của bạn!',
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.8. Bảng `transactions` (Lưu dữ liệu giao dịch ủng hộ / donate)
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,                           -- 'txn_timestamp_random'
  user_id TEXT,                                  -- FK users(id) hoặc null nếu ẩn danh
  amount INTEGER NOT NULL,                       -- Số tiền (VNĐ)
  currency TEXT DEFAULT 'VND',
  payment_method TEXT NOT NULL DEFAULT 'vietqr', -- 'vietqr' | 'momo' | 'bank_transfer'
  transaction_code TEXT UNIQUE NOT NULL,         -- Cú pháp chuyển khoản riêng (VD: LICHVIET_83912)
  sender_name TEXT,                              -- Tên người gửi hoặc 'Nhà hảo tâm ẩn danh'
  sender_email TEXT,                             -- Email nhận thư tri ân
  message TEXT,                                  -- Lời chúc / lời nhắn gửi nhà phát triển
  status TEXT DEFAULT 'pending',                 -- 'pending' | 'completed' | 'failed'
  is_anonymous INTEGER DEFAULT 0,                -- 1: Ẩn danh trên bảng vàng tri ân
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,                         -- Thời điểm xác nhận nhận tiền
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
```

---

## 4. DỮ LIỆU BAN ĐẦU (Seed Data)

Hệ thống được nạp sẵn dữ liệu văn hóa chuẩn của Việt Nam:
- 1/1 Dương lịch: Tết Dương lịch
- 26/1 - 29/1 Dương lịch (29, 30 Tết đến Mùng 3 Tết): Tết Nguyên Đán
- 15/1 Âm lịch: Rằm tháng Giêng (Tết Thượng Nguyên)
- 10/3 Âm lịch: Giỗ Tổ Hùng Vương
- 30/4 Dương lịch: Ngày Giải phóng miền Nam
- 1/5 Dương lịch: Ngày Quốc tế Lao động
- 2/9 Dương lịch: Ngày Quốc khánh Việt Nam
- 15/8 Âm lịch: Rằm tháng 8 (Tết Trung Thu)
- 20/11 Dương lịch: Ngày Nhà giáo Việt Nam
- 24/12 Dương lịch: Lễ Giáng Sinh
