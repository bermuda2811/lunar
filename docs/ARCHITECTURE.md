# ARCHITECTURE.md — Kiến trúc Kỹ thuật Hệ thống Lịch An Nhiên

## 1. TỔNG QUAN KIẾN TRÚC

Hệ thống được thiết kế theo nguyên lý **Clean Architecture** kết hợp mô hình **Offline-First**. 

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ỨNG DỤNG LỊCH AN NHIÊN                          │
├───────────────────────────────────┬────────────────────────────────────┤
│         MOBILE CLIENT             │             WEB CLIENT             │
│   (Android & iOS via Expo)        │    (React Native Web / Browser)    │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SHARED CORE CALENDAR & STORAGE DOMAIN                 │
│  - Thuật toán Âm Dương Lịch Hồ Ngọc Đức (UTC+7) (Thuần TypeScript)     │
│  - Can Chi, Tiết khí, Hoàng đạo, Giờ hoàng đạo                         │
│  - Local Cache & Local Storage (AsyncStorage)                          │
│  - Local Notification Engine                                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ REST API (Sync / Content Updates)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVICE & ADMIN CMS                        │
│  - Node.js + Express + TypeScript                                      │
│  - SQLite Database (Dữ liệu sự kiện, ngày lễ, câu chúc, cấu hình)     │
│  - RESTful API (/api/v1/...)                                           │
│  - Admin Web CMS Dashboard (Phục vụ Màn hình 11 Wireframe)             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. NGUYÊN TẮC THIẾT KẾ CỐT LÕI

1. **Offline-First & Zero Dependency on Server for Core Functions**:
   - Toàn bộ thuật toán chuyển đổi Dương lịch ↔ Âm lịch, Can Chi, Tiết khí, Hoàng đạo/Hắc đạo và quản lý nhắc nhở cá nhân hoạt động **100% độc lập không cần internet**.
   - Người dùng ở nông thôn, vùng sâu vùng xa, hay mất mạng vẫn mở lịch xem ngày và nhận nhắc nhở đúng giờ.
2. **Backend chỉ đóng vai trò phân phối nội dung động**:
   - Dữ liệu ngày lễ, sự kiện lịch sử, lời chúc/danh ngôn hàng ngày, cấu hình banner và linh vật theo năm.
   - Ứng dụng tự động lưu vào local cache, cập nhật ngầm khi có mạng.
3. **Phù hợp người cao tuổi (Elderly-First Accessibility)**:
   - Font chữ lớn (tối thiểu >= 18px cho nội dung chính, số ngày >= 56px).
   - Touch target tối thiểu 48x48 dp.
   - Thao tác tường minh qua nút bấm, không ép buộc cử chỉ vuốt (gesture).
   - Màu sắc ấm áp, độ tương phản cao, không gây chói mắt.
4. **Clean Domain Separation**:
   - Thuật toán lịch nằm trọn trong `domain/calendar/`, không phụ thuộc vào UI component hay framework.
   - Dễ dàng test tự động (automated tests) với các mốc kiểm chứng (ground truth).

---

## 3. CÁC MODULE CHÍNH

### 3.1. Client (Mobile & Web App)
- **Framework**: React Native with Expo SDK (hỗ trợ Android, iOS và Web thông qua `react-native-web`).
- **Ngôn ngữ**: TypeScript strict mode.
- **Cấu trúc thư mục**:
  ```text
  src/
  ├── components/          # UI Components dùng chung (Header, Card, Button, Modal)
  ├── domain/              # Business Logic & Thuật toán
  │   ├── calendar/        # Thuật toán Âm dương lịch, Can Chi, Hoàng đạo, Tiết khí
  │   └── reminder/        # Logic tính ngày nhắc, chu kỳ lặp lại (Solar/Lunar)
  ├── screens/             # 10 màn hình tương ứng với wireframe
  │   ├── SplashScreen.tsx
  │   ├── DailyOverviewScreen.tsx
  │   ├── DailyDetailScreen.tsx
  │   ├── MonthlyCalendarScreen.tsx
  │   ├── RemindersScreen.tsx
  │   ├── AddReminderScreen.tsx
  │   ├── SettingsScreen.tsx
  │   ├── SearchScreen.tsx
  │   ├── EventsListScreen.tsx
  │   └── EventDetailScreen.tsx
  ├── services/            # API client, Storage, Notifications
  ├── theme/               # Colors, Typography, Spacing
  └── types/               # Type definitions
  ```

### 3.2. Calendar Domain (Thuật toán Âm lịch Việt Nam)
- Dựa trên thuật toán thiên văn chuẩn của nhà nghiên cứu Hồ Ngọc Đức, áp dụng múi giờ Việt Nam (UTC+7, Kinh độ 105° Đông).
- Cung cấp 2 hàm chuyển đổi cốt lõi:
  - `solarToLunar(day, month, year) => { lunarDay, lunarMonth, lunarYear, isLeap, ... }`
  - `lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap) => { day, month, year }`
- Cung cấp hàm tính:
  - Can Chi cho Ngày, Tháng, Năm (Giáp, Ất, Bính... Tý, Sửu, Dần...).
  - 24 Tiết khí trong năm và khoảng cách tới tiết khí tiếp theo.
  - Ngày Hoàng đạo / Hắc đạo theo thập nhị kiến trừ và thập nhị tinh.
  - 6 khung Giờ hoàng đạo trong mỗi ngày.
  - Việc nên làm / Việc kiêng kỵ dân gian.

### 3.3. Reminder Domain (Xử lý nhắc nhở Âm / Dương)
- Đặc thù văn hóa Việt Nam: Rất nhiều ngày lễ và giỗ chạp tính theo **Âm lịch** (ví dụ: Giỗ Ông ngày 15/8 Âm lịch, Rằm tháng Giêng, Tết Đoan Ngọ).
- Khi người dùng đặt lịch nhắc Âm lặp lại hàng năm:
  - Hệ thống tính toán trước ngày Dương lịch tương ứng cho năm hiện tại và năm tiếp theo bằng `lunarToSolar`.
  - Hỗ trợ báo trước (offset): Đúng ngày, trước 1 ngày, trước 3 ngày, trước 7 ngày.
  - Lưu trữ bền vững (Persistent Storage).

### 3.4. Backend & Admin CMS
- **Runtime**: Node.js v20+ / Express / TypeScript.
- **Database**: SQLite (nhẹ, không cần cài đặt server phức tạp, hoàn hảo cho ứng dụng nội dung).
- **Admin CMS UI**: Single Page Web Dashboard tương ứng 100% với màn hình 11 trong `wireframe.png`.
- **API Endpoints**: REST API chuẩn JSON.
