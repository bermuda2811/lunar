# DATABASE.md — Thiết kế Dữ liệu & Lưu trữ (Data Model & Storage)

## 1. CHIẾN LƯỢC LƯU TRỮ

Hệ thống sử dụng hai lớp dữ liệu:
1. **Local Storage (Client-side)**: Lưu trữ nhắc nhở của người dùng, cài đặt ứng dụng, và cache dữ liệu sự kiện để chạy hoàn toàn Offline.
2. **Backend Database (Server-side)**: SQLite lưu trữ danh mục ngày lễ, sự kiện, câu chúc, nội dung ý nghĩa và thông tin quản trị CMS.

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
  theme: 'light' | 'dark';
  fontSize: 'standard' | 'large' | 'extra_large'; // Mặc định 'large' cho người cao tuổi
  language: 'vi' | 'en';
}
```

---

## 3. SERVER DATABASE (SQLite Schema)

### 3.1. Bảng `events` (Sự kiện & Ngày lễ)
Khớp 100% với bảng quản lý sự kiện trên Admin CMS (Màn hình 11):
```sql
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                   -- Tên sự kiện (ví dụ: "Tết Trung Thu")
  calendar_type TEXT NOT NULL,           -- 'solar' | 'lunar'
  day INTEGER NOT NULL,                  -- Ngày (Dương hoặc Âm)
  month INTEGER NOT NULL,                -- Tháng (Dương hoặc Âm)
  category TEXT NOT NULL,                -- 'vn_holiday' | 'intl_holiday' | 'lunar_tradition' | 'history'
  status TEXT DEFAULT 'active',          -- 'active' (Hiển thị) | 'hidden'
  summary TEXT,                          -- Tóm tắt ngắn
  meaning TEXT,                          -- Ý nghĩa văn hóa (hiển thị ở Màn hình 10)
  traditions TEXT,                       -- Hoạt động truyền thống
  image_url TEXT,                        -- Đường dẫn ảnh minh họa banner
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
