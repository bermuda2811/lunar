## Nhiệm vụ Hiện tại: Tối Ưu Tinh Gọn Giao Diện Web Theo Yêu Cầu Người Dùng
- **Mục tiêu**:
  1. **Bỏ nút "Hôm nay" rời rạc**: Tích hợp nút/chỉ báo "Hôm nay" trực tiếp vào bên trong Widget chuyển ngày (`[ < ] [ dd/mm/yyyy • Hôm nay ] [ > ]`). Chỉ hiển thị nút quay về "Hôm nay" khi đang xem ngày khác.
  2. **Tích hợp tìm kiếm sự kiện vào mục "Lễ Tết"**: Bỏ nút kính lúp tìm kiếm rời rạc trên Header; đặt thanh tìm kiếm sự kiện + bộ lọc danh mục trực quan ngay đầu tab "Lễ Tết & Sự Kiện".
  3. **Đưa chức năng đổi ngày vào Menu Tài Khoản**: Bỏ tab "Đổi Ngày" khỏi thanh Navigation chính và Mobile Bottom Bar (giữ 5 tabs vàng chuẩn mực); tích hợp trọn vẹn công cụ chuyển đổi Âm – Dương chuẩn thiên văn Hồ Ngọc Đức vào trong Modal/Menu Tài khoản người dùng với nút "Xem tờ lịch ngày này".
  4. **Header 1 hàng ngang duy nhất (Single-Line 56px)**: Thanh thoát, chỉ gồm Logo/Năm bên trái, 5 Navigation Tabs ở giữa, Widget chuyển ngày tích hợp & Tài khoản bên phải.

- **Tiến độ triển khai**:
  - [x] Cập nhật `CalendarWebApp.tsx`: kiểu `WebTab` còn 5 tabs (`today`, `month`, `events`, `reminders`, `donate`).
  - [x] Thiết kế widget Date Stepper thống nhất trên Desktop Header & Mobile Stepper với nút "Hôm nay" tích hợp bên trong.
  - [x] Tích hợp thanh tìm kiếm sự kiện và bộ lọc danh mục trực tiếp vào đầu tab "Lễ Tết", hỗ trợ tìm kiếm tức thời và thông báo trạng thái rỗng thân thiện.
  - [x] Đưa công cụ đổi ngày Âm – Dương vào tab phụ trong Modal Tài khoản (`accountModalTab: 'account' | 'converter'`) cùng nút nhảy nhanh đến tờ lịch ngày được đổi.
  - [x] Tinh giản Mobile Bottom Navigation Bar về 5 tabs chuẩn mực với touch target >= 48px.
  - [x] Kiểm thử build Web: `npm run build:web` thành công (0 lỗi, 233ms).
  - [x] Kiểm thử test suite Âm Dương: `npm test` vượt qua 100%.
  - [x] Cập nhật tài liệu kỹ thuật dự án (`docs/UI_UX.md`, `docs/CHANGELOG.md`, `tasks/current.md`).
  - [x] Khắc phục triệt để lỗi ngày cố định 16/09/2026 khi deploy lên VPS: chuyển `currentDate` sang `new Date()`, form nhắc nhở sang ngày thực tế và các màn hình sang tính toán sự kiện tự động.
