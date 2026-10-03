# Lịch An Nhiên (Lịch Việt) — Giữ truyền thống, gần gũi mỗi ngày!

Ứng dụng xem Lịch Dương, Lịch Âm, Giờ Hoàng Đạo, Sự Kiện Văn Hóa và Nhắc Nhở cá nhân tối ưu đặc biệt cho **Người cao tuổi** Việt Nam.

Giao diện và tính năng được xây dựng **100% khớp tuyệt đối với wireframe thiết kế chuẩn** (`wireframe.png`).

---

## 🌟 CÁC TÍNH NĂNG NỔI BẬT

1. **Màn hình 1 — Loading / Splash**: Con giáp năm âm lịch (Ất Tỵ 2025, Bính Ngọ 2026), lời chúc Tết an khang thịnh vượng, thanh tiến trình mượt mà.
2. **Màn hình 2 — Xem ngày (Tổng quan)**: 2 khối thẻ số siêu to (Dương lịch xanh lá, Âm lịch đỏ ấm), đánh giá ngày tốt/xấu, việc nên làm & kiêng kỵ, sự kiện trong ngày, câu danh ngôn, cụm nút bấm to rõ cho người cao tuổi.
3. **Màn hình 3 — Xem ngày (Chi tiết)**: Bộ chuyển đổi Tổng quan / Chi tiết, Can Chi ngày/tháng/năm, 24 Tiết khí, 6 khung Giờ hoàng đạo trong ngày, việc nên làm, việc kiêng kỵ.
4. **Màn hình 4 — Xem tháng**: Lưới lịch 7 cột, số ngày Dương to ở trên, số ngày Âm nhỏ ở dưới, 4 chấm màu nhận diện ngày (Ngày tốt, Ngày xấu, Sự kiện, Ngày lễ), thẻ tóm tắt ngày đang chọn ở chân lịch.
5. **Màn hình 5 — Nhắc nhở**: Phân nhóm Sắp tới & Sau này, hỗ trợ ngày Dương & ngày Âm (Sinh nhật Bà, Ngày giỗ Ông, Rằm tháng 8, Đi du lịch, Họp mặt gia đình), checkbox đánh dấu hoàn thành.
6. **Màn hình 6 — Tạo nhắc nhở**: Form thêm nhắc nhở, chọn ngày Dương/Âm/Cả hai, quy đổi âm lịch tức thì, chu kỳ lặp (Hàng ngày, Hàng tuần, Hàng tháng, Hàng năm), biểu tượng trực quan.
7. **Màn hình 7 — Cài đặt**: Bật/tắt thông báo, hiển thị lịch âm, chế độ giao diện, tùy chỉnh phóng to cỡ chữ cho người cao tuổi (Lớn / Rất lớn).
8. **Màn hình 8 — Tìm kiếm**: Tìm kiếm tra cứu ngày, sự kiện, lễ tết, danh sách gợi ý gần đây.
9. **Màn hình 9 — Danh sách sự kiện & ngày lễ**: Phân loại Lễ Việt Nam, Quốc tế, Âm lịch.
10. **Màn hình 10 — Chi tiết sự kiện**: Banner tranh minh họa Đêm hội Trăng Rằm sống động, ý nghĩa văn hóa và phong tục truyền thống.
11. **Màn hình 11 — Backend Admin CMS Web Dashboard**: Giao diện quản trị CMS tại `http://localhost:4000/admin` quản lý sự kiện, câu chúc, cấu hình và cung cấp REST API.

---

## 🚀 HƯỚNG DẪN KIỂM THỬ NHANH

### 1. Kiểm thử Giao diện Web (10 Màn hình Ứng Dụng)
Khởi chạy ứng dụng Web (đã tích hợp thanh chuyển đổi 10 màn hình và chế độ Khung Di Động):
```bash
npm run dev:web
```
👉 Mở trình duyệt truy cập: **`http://localhost:3000`**

- **Khung Di Động**: Trải nghiệm ứng dụng chuẩn như trên màn hình điện thoại iPhone/Android.
- **Thanh Chuyển Màn Hình**: Bấm vào các nút `1. Loading`, `2. Xem ngày`, `3. Chi tiết`, `4. Xem tháng`, `5. Nhắc nhở`, `6. Tạo nhắc nhở`, `7. Cài đặt`, `8. Tìm kiếm`, `9. Sự kiện`, `10. Chi tiết sự kiện` để kiểm tra tức thì từng màn hình.
- **Thao tác trực tiếp trên app**: Bấm nút chuyển ngày `‹ Ngày trước`, `Ngày sau ›`, bấm chọn ngày trên lưới tháng, bấm checkbox hoàn thành nhắc nhở, v.v.

---

### 2. Kiểm thử Backend & Admin Web CMS (Màn hình 11)
Khởi chạy máy chủ Backend và trang CMS:
```bash
npm run dev:backend
```
👉 Mở trình duyệt truy cập: **`http://localhost:4000/admin`** (hoặc `http://localhost:4000`)

- **Bảng danh sách sự kiện**: Khớp 100% với wireframe màn hình 11 (Tết Dương lịch, Tết Nguyên Đán, Tết Trung Thu, Ngày Nhà giáo VN, Giáng Sinh...).
- **Thêm sự kiện mới**: Bấm nút `+ Thêm sự kiện`, nhập thông tin và bấm Lưu. Dữ liệu sẽ lưu trực tiếp vào SQLite database.
- **Chỉnh sửa / Xóa**: Bấm icon bút chì hoặc thùng rác trên từng hàng.
- **REST API Live**:
  - `GET http://localhost:4000/api/v1/health`
  - `GET http://localhost:4000/api/v1/calendar/day?date=2026-09-16`
  - `GET http://localhost:4000/api/v1/events`
  - `GET http://localhost:4000/api/v1/stats`

---

### 3. Khởi chạy Cả Web và Backend Đồng Thời
```bash
npm run dev
```
Lệnh này sẽ tự động khởi động song song cả Backend (Port 4000) và Web App (Port 3000).

---

### 4. Kiểm thử Ứng dụng Android (React Native / Expo)
Dự án di động nằm trong thư mục `mobile/` được thiết lập chuẩn Expo SDK 52:
```bash
# Cách 1: Khởi động Expo Dev Server
npm run dev:mobile

# Cách 2: Khởi động trực tiếp cho Android
npm run dev:android
```
- **Kiểm thử trên điện thoại thật (Rất nhanh & tiện lợi)**:
  1. Cài ứng dụng **Expo Go** từ Google Play Store trên điện thoại Android của bạn.
  2. Dùng camera điện thoại hoặc ứng dụng Expo Go quét mã QR hiển thị trên màn hình terminal.
  3. Ứng dụng sẽ tự động tải và chạy trực tiếp trên điện thoại của bạn.
- **Build file APK Android độc lập**:
  ```bash
  cd mobile
  npx eas-cli build -p android --profile preview
  ```

---

### 5. Chạy Kiểm Thử Tự Động (Automated Tests)
Kiểm tra độ chính xác thiên văn của thuật toán Âm Dương Lịch Hồ Ngọc Đức UTC+7:
```bash
npm test
```

---

## 📁 CẤU TRÚC THƯ MỤC

```text
/
├── AGENTS.md                 # Quy tắc cốt lõi AI Agent
├── docs/                     # Bộ nhớ dự án (Single Source of Truth)
│   ├── PRODUCT.md            # Đặc tả sản phẩm & 11 màn hình wireframe
│   ├── ARCHITECTURE.md       # Kiến trúc kỹ thuật Offline-First
│   ├── UI_UX.md              # Bảng màu di sản & chuẩn người cao tuổi
│   ├── DATABASE.md           # Schema SQLite & Local Storage models
│   ├── API.md                # Đặc tả REST API
│   ├── DECISIONS.md          # Nhật ký quyết định kiến trúc ADR
│   └── CHANGELOG.md          # Lịch sử phiên bản
├── tasks/
│   ├── BACKLOG.md            # Tiến độ chi tiết các phase
│   ├── current.md            # Trạng thái hiện tại
│   └── completed/            # Báo cáo các phase đã hoàn thành
├── shared/
│   └── calendar/             # Thuật toán Âm Dương Lịch Hồ Ngọc Đức UTC+7
├── backend/                  # Node.js + Express + SQLite + Admin CMS (Màn hình 11)
├── web/                      # Ứng dụng Web React TypeScript (10 Màn hình Wireframe)
├── mobile/                   # Ứng dụng Di động React Native Expo (Android & iOS)
└── package.json              # Scripts điều phối toàn bộ dự án
```
>>>>>>> ab4fe4e (feat: complete initial implementation of Lich An Nhien calendar app (100% wireframe matching))
