## Nhiệm vụ Hiện tại: Triển khai Phiên Bản Mới Nhất (Admin CMS Login, Tinh Giản Menu, Chuẩn SEO & Âm Dương Lịch) và Push Lên Git

- **Mục tiêu**:
  1. Hợp nhất toàn diện các thay đổi từ origin/main và HEAD:
     - Admin CMS có bảo mật đăng nhập (`/api/v1/admin/login`, `/me`, `/logout`, token session).
     - Admin CMS tinh giản, hợp nhất các menu không cần thiết (loại bỏ panel tĩnh, chỉ giữ các mục có link/chức năng thực tế).
     - Chuẩn SEO toàn diện cho tên miền `lichannhien.com` (Sitemap, Robots.txt, Meta Schemas, FAQ).
     - Thuật toán Âm Dương Lịch Hồ Ngọc Đức chuẩn thiên văn & đồng bộ thời gian thực tế.
     - Docker deployment phục vụ frontend và backend API / Admin CMS trên cổng 4000 (ánh xạ 8087 trên host).
  2. Kiểm thử tự động (tests, builds, API health).
  3. Triển khai Docker container `luna_app` mới nhất hoạt động mượt mà.
  4. Push toàn bộ thay đổi lên Git remote (`origin/main`).

- **Tiến độ triển khai**:
  - [x] Merge và giải quyết toàn bộ xung đột mã nguồn giữa local và remote.
  - [x] Đồng bộ hệ thống Admin CMS Authentication và giao diện login quản trị viên.
  - [x] Tinh giản menu Admin CMS (loại bỏ các tab không có liên kết/chức năng).
  - [ ] Chạy kiểm thử tự động `npm test` và TypeScript build `npm run build`.
  - [ ] Rebuild và restart container Docker `luna_app` trên cổng 8087.
  - [ ] Kiểm thử thực tế các endpoint `/admin`, `/api/v1/admin/login`, `/api/v1/health` và Web App `/`.
  - [ ] Commit và push tất cả thay đổi lên Git repository.
