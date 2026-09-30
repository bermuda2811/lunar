# BACKLOG.md — Kế hoạch Triển khai Chi tiết

Toàn bộ các Phase đã hoàn thành 100%:

---

### Phase 0: Project Bootstrap (Khởi tạo bộ nhớ & cấu trúc dự án)
- [x] Phân tích yêu cầu & wireframe (`wireframe.png`).
- [x] Tạo cấu trúc thư mục chuẩn: `AGENTS.md`, `docs/*`, `tasks/*`.
- [x] Soạn thảo tài liệu chuẩn `PRODUCT.md`, `ARCHITECTURE.md`, `UI_UX.md`, `DATABASE.md`, `API.md`, `DECISIONS.md`.
- [x] Thiết lập Git repository.

---

### Phase 1: Client & Backend Environment Setup
- [x] Khởi tạo ứng dụng React Native / Expo đa nền tảng (Web + Android + iOS).
- [x] Cấu hình TypeScript, linting, scripts khởi chạy đồng thời.
- [x] Khởi tạo dịch vụ Backend Node.js + Express + TypeScript + SQLite.

---

### Phase 2: Design System & Reusable Components
- [x] Xây dựng theme chuẩn: bảng màu (Heritage Red, Heritage Green, Warm Cream, Charcoal), typography, spacing, radius.
- [x] Tạo các component nền tảng: `Button`, `Card`, `Header`, `Tag`, `Modal`, `BottomTabBar`.
- [x] Hỗ trợ cỡ chữ mở rộng cho người cao tuổi.

---

### Phase 3: Vietnamese Lunar Calendar Domain (Thuật toán Âm Dương Lịch)
- [x] Cài đặt thuật toán chuyển đổi Dương → Âm và Âm → Dương múi giờ UTC+7.
- [x] Cài đặt tính toán Can Chi (Ngày, Tháng, Năm).
- [x] Cài đặt tính toán 24 Tiết khí và khoảng cách ngày.
- [x] Cài đặt tính Ngày Hoàng đạo / Hắc đạo, Việc nên làm, Việc kiêng kỵ.
- [x] Cài đặt tính toán Giờ hoàng đạo.
- [x] Viết Automated Tests bao phủ các mốc lịch kiểm chứng.

---

### Phase 4: Màn hình Loading / Splash (Màn hình 1 Wireframe)
- [x] Hiển thị linh vật/con giáp năm âm lịch (Ất Tỵ, Bính Ngọ...).
- [x] Hiển thị câu chúc Tết ấm áp: "An khang • Thịnh vượng", "Vạn sự như ý".
- [x] Thanh tiến trình mượt mà "Đang tải ứng dụng...".

---

### Phase 5: Màn hình Xem ngày Tổng quan & Chi tiết (Màn hình 2 & 3 Wireframe)
- [x] Header hiển thị thứ ngày tháng và nút chuyển ngày lớn.
- [x] 2 Thẻ song song Dương lịch (Xanh) & Âm lịch (Đỏ) số to rõ ràng.
- [x] Thẻ đánh giá ngày tốt/xấu kèm việc nên làm & kiêng kỵ.
- [x] Thẻ sự kiện trong ngày và câu danh ngôn/lời chúc.
- [x] Bộ chuyển đổi chế độ xem `[Tổng quan] [Chi tiết]`.
- [x] Màn hình chi tiết: Can Chi, Tiết khí, danh sách Giờ hoàng đạo chi tiết.

---

### Phase 6: Màn hình Xem tháng (Màn hình 4 Wireframe)
- [x] Lưới lịch tháng 7x6 hiển thị số ngày Dương to và số ngày Âm nhỏ.
- [x] Chấm màu nhận diện ngày tốt (xanh), ngày xấu (nâu đỏ), sự kiện (đỏ), ngày lễ (cam).
- [x] Highlight ngày đang chọn viền đỏ bo tròn và viền ngày hôm nay.
- [x] Thẻ tóm tắt thông tin ngày đang chọn ở chân lịch với nút "Xem chi tiết >".
- [x] Chuyển đổi tháng trước/sau và nút về "Hôm nay".

---

### Phase 7: Reminder Domain & Local Storage
- [x] Thiết kế cơ chế lưu trữ bền vững (Local Persistent Storage).
- [x] Logic chuyển đổi lịch nhắc Âm lặp lại hàng năm sang ngày Dương.
- [x] Hỗ trợ các chu kỳ lặp: Không lặp, Hàng ngày, Hàng tuần, Hàng tháng, Hàng năm.
- [x] Hỗ trợ báo trước: Đúng ngày, Trước 1 ngày, Trước 3 ngày, Trước 7 ngày.

---

### Phase 8: Màn hình Nhắc nhở & Tạo Nhắc nhở (Màn hình 5 & 6 Wireframe)
- [x] Màn hình danh sách nhắc nhở: lọc `[Tất cả] [Sắp tới] [Đã hoàn thành]`.
- [x] Nhóm nhắc nhở `Sắp tới` và `Sau này` với icon trực quan (bánh sinh nhật, bát hương, đèn lồng, máy bay, gia đình).
- [x] Checkbox đánh dấu hoàn thành trực tiếp.
- [x] Màn hình Tạo/Sửa nhắc nhở: Tên, chọn Ngày dương/Ngày âm/Cả hai, lặp lại, thời gian, biểu tượng, ghi chú.

---

### Phase 9: Các Màn hình Phụ (Màn hình 7, 8, 9, 10 Wireframe)
- [x] Màn hình Cài đặt (Màn hình 7): Bật tắt thông báo, tùy chọn lịch âm, cỡ chữ người cao tuổi, giao diện, giới thiệu.
- [x] Màn hình Tìm kiếm (Màn hình 8): Ô tìm kiếm, bộ lọc `[Ngày] [Sự kiện] [Lễ tết]`, danh sách gợi ý gần đây.
- [x] Màn hình Danh sách Sự kiện (Màn hình 9): Bộ lọc `[Tất cả] [Lễ VN] [Quốc tế] [Âm lịch]`.
- [x] Màn hình Chi tiết Sự kiện (Màn hình 10): Banner minh họa văn hóa, ngày dương/âm, mục Ý nghĩa và Phong tục tập quán.

---

### Phase 10: Backend REST API & Database
- [x] Cấu hình SQLite và bảng `events`, `daily_quotes`, `app_config`.
- [x] Nạp sẵn dữ liệu văn hóa (Seed Data) chuẩn Việt Nam.
- [x] Xây dựng các REST API endpoints: `/calendar/day`, `/events`, `/quotes`, `/config`, `/stats`.

---

### Phase 11: Backend Admin Web CMS Dashboard (Màn hình 11 Wireframe)
- [x] Xây dựng giao diện web quản trị CMS khớp 100% wireframe màn hình 11.
- [x] Sidebar điều hướng: Tổng quan, Quản lý sự kiện, Quản lý nội dung, Quản lý người dùng, Thống kê, Cài đặt.
- [x] Bảng danh sách sự kiện đầy đủ: Ngày, Tên sự kiện, Loại, Trạng thái (Badge Hiển thị), Thao tác (Sửa, Xóa).
- [x] Nút "+ Thêm sự kiện" mở Modal thêm/sửa sự kiện lưu trực tiếp vào database.
- [x] Quản lý câu chúc theo ngày và thống kê trực quan.

---

### Phase 12: Kiểm thử, Tối ưu & Hướng dẫn sử dụng
- [x] Kiểm thử tự động calendar domain và API.
- [x] Kiểm tra hiển thị 100% khớp wireframe.
- [x] Hướng dẫn chi tiết cách kiểm thử trên Web, Backend CMS và Android.
