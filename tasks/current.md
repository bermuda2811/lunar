## Nhiệm vụ Hiện tại: Triển Khai Truy Cập SSL (HTTPS) Cho Tên Miền lichannhien.com

- **Mục tiêu**:
  1. **Cấp phát Chứng chỉ SSL (Let's Encrypt) & Cấu hình Apache2 HTTPS (`*:443`)**:
     - Cấp chứng chỉ SSL hợp lệ cho `lichannhien.com` và `www.lichannhien.com` qua Let's Encrypt (`certbot`).
     - Cấu hình `<VirtualHost *:443>` trong `/etc/apache2/sites-available/projects.conf` với `SSLEngine on`, ánh xạ Reverse Proxy vào `http://127.0.0.1:8087/` (`luna_app`), truyền header `X-Forwarded-Proto "https"`.
     - Cấu hình `<VirtualHost *:80>` hỗ trợ ACME challenge (`/.well-known/acme-challenge/`) và tự động chuyển hướng `HTTP -> HTTPS` an toàn, tương thích hoàn toàn với Cloudflare Proxy (tránh lỗi 525 SSL Handshake Failed và tránh vòng lặp redirect).
  2. **Cập nhật Cấu hình Môi trường & Triển khai**:
     - Cập nhật `APP_URL=https://lichannhien.com` trong `.env`.
     - Khởi động lại container `luna_app` và kiểm tra kết nối HTTPS trực tiếp lẫn qua Cloudflare CDN.
  3. **Cập nhật Tài liệu**:
     - Ghi nhận quyết định kiến trúc mới `D-018` trong `docs/DECISIONS.md` và cập nhật `docs/CHANGELOG.md` (`v1.1.4`).

- **Tiến độ triển khai**:
  - [x] Kiểm tra DNS Cloudflare, trạng thái cổng 80/443 và nguyên nhân lỗi 525 trên Cloudflare.
  - [x] Cấp phát chứng chỉ SSL Let's Encrypt và cấu hình Apache2 VirtualHost `*:443` & `*:80`.
  - [x] Cập nhật `.env` (`APP_URL=https://lichannhien.com`) và khởi động lại `luna_app`.
  - [x] Kiểm thử truy cập `https://lichannhien.com` và `https://www.lichannhien.com` (HTTP/2 200 OK).
  - [x] Cập nhật tài liệu (`docs/DECISIONS.md`, `docs/CHANGELOG.md`, `tasks/current.md`) & push Git.
