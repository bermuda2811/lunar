## Nhiệm vụ Hiện tại: Tinh Gọn Module Ủng Hộ (Bỏ Form Bên Phải, Chỉ Để Mã Chuyển Khoản & Thông Tin Ngân Hàng)

- **Mục tiêu**:
  1. **Tinh gọn Giao diện Module Ủng hộ (`activeTab === 'donate'`)**:
     - Loại bỏ toàn bộ form nhập liệu bên phải (chọn mức ủng hộ, họ tên, email, lời nhắn).
     - Chỉ giữ lại khung hiển thị Mã chuyển khoản (QR code - ảnh tải lên hoặc VietQR tự động) và khối Thông tin ngân hàng (Ngân hàng, Chủ tài khoản, Số tài khoản kèm nút sao chép, Ví MoMo).
     - Tối ưu bố cục về dạng thẻ căn giữa (`max-w-xl`), cân đối, thẩm mỹ, chữ to rõ ràng, tương phản cao, phù hợp người cao tuổi.
  2. **Dọn dẹp State & Mã nguồn**:
     - Bỏ các state không còn sử dụng (`donateAmount`, `donorName`, `donorEmail`, `donorMessage`).
     - Tự động sinh VietQR với mức tiền tùy tâm (`amount=0`) khi chưa cấu hình ảnh QR tùy chỉnh.
  3. **Kiểm thử, Build & Triển khai**:
     - Kiểm thử giao diện web responsive trên desktop và mobile.
     - Chạy test suite và build ứng dụng.
     - Rebuild Docker container và cập nhật tài liệu (DECISIONS.md, CHANGELOG.md, UI_UX.md).
     - Push mã nguồn lên Git.

- **Tiến độ triển khai**:
  - [x] Phân tích cấu trúc module ủng hộ trong `CalendarWebApp.tsx`.
  - [x] Cập nhật `CalendarWebApp.tsx`: bỏ form bên phải, căn giữa mã QR và thông tin ngân hàng.
  - [x] Dọn dẹp các state thừa không dùng trong `CalendarWebApp.tsx`.
  - [x] Chạy `npm test` và `npm run build` cho web & backend.
  - [x] Rebuild và restart Docker container `luna_app` trên cổng 8087.
  - [x] Cập nhật tài liệu kỹ thuật (`docs/DECISIONS.md`, `docs/UI_UX.md`, `docs/CHANGELOG.md`).
  - [x] Commit và push lên Git.
