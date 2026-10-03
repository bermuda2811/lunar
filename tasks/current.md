## Nhiệm vụ Hiện tại: Bổ sung Upload Ảnh QR Code Ủng Hộ Trong Admin CMS & Đồng Bộ Thông Tin Hiển Thị Ra Web/App

- **Mục tiêu**:
  1. **Upload Ảnh QR Code trong Admin CMS**:
     - Cho phép quản trị viên tải lên file ảnh QR code thực tế (PNG, JPG, WEBP) trực tiếp trong mục "Ủng hộ & VietQR" của Admin CMS.
     - Thêm nút xóa ảnh tùy chỉnh để quay về mã VietQR tự động khi cần.
     - Hiển thị khung xem trước (Live Preview) ảnh QR trong Admin CMS.
     - Endpoint API `POST /api/v1/donation/upload-qr` (xác thực `adminAuthMiddleware`, lưu trữ file vào thư mục `/uploads` và cập nhật `custom_qr_url` trong database).
  2. **Đồng bộ Thông tin Hiển thị Ra Web / App**:
     - Trong `CalendarWebApp.tsx` (ứng dụng web chính) và `DonateScreen.tsx`: Bỏ hardcode, tự động nạp cấu hình từ `/api/v1/donation/config`.
     - Hiển thị chính xác thông tin: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản, Ví MoMo và Ảnh QR code (ưu tiên ảnh tùy chỉnh do Admin tải lên, nếu không có mới dùng VietQR tự động).
     - Nút sao chép số tài khoản sao chép đúng số tài khoản đã cài đặt.
  3. **Kiểm thử & Đóng gói**:
     - Kiểm thử tải ảnh QR, lưu cấu hình, nạp lại trang Web App và xác nhận thông tin khớp 100%.
     - Build lại Frontend & Backend, cập nhật Docker container `luna_app` trên cổng 8087.
     - Push mã nguồn lên Git.

- **Tiến độ triển khai**:
  - [x] Thêm endpoint `POST /api/v1/donation/upload-qr` và cấu hình phục vụ `/uploads` tĩnh trong `backend/src/server.ts`.
  - [x] Nâng cấp giao diện Admin CMS `adminHtml.ts` với khối Upload ảnh QR, xem trước real-time và nút gỡ ảnh.
  - [x] Cập nhật `web/src/views/CalendarWebApp.tsx` nạp động cấu hình ngân hàng & QR code từ backend.
  - [x] Cập nhật `web/src/screens/DonateScreen.tsx` và `mobile/src/screens/DonateScreen.tsx` ưu tiên `customQrUrl`.
  - [x] Chạy kiểm thử build và test tự động (100% pass).
  - [x] Rebuild Docker container `luna_app` và kiểm tra thực tế trên cổng 8087.
  - [x] Commit và push tất cả thay đổi lên Git.
