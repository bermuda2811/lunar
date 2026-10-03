## Nhiệm vụ Hiện tại: Khắc Phục Toàn Diện Độ Lệch Lịch So Với Thực Tế & Triển Khai Phiên Bản 1.1.1 Lên Production http://lichannhien.com

- **Mục tiêu**:
  1. **Khắc phục lỗi hiển thị ngày mặc định**: Sửa lỗi hardcode `new Date(2026, 8, 16)` trong `web/src/App.tsx` và `mobile/App.tsx`. Ứng dụng luôn tự động mở ra đúng ngày thực tế hôm nay (`new Date()`).
  2. **Khắc phục thuật toán Âm Dương Lịch Hồ Ngọc Đức**:
     - Sửa lỗi xác định mốc `a11` và `lunarYear` trong `solarToLunar` (trước đây tính sai năm âm lịch cho các ngày đầu năm dương lịch trước Tết).
     - Sửa lỗi xác định `b11` và điều kiện tháng nhuận trong `lunarToSolar` khi tháng âm >= 11.
     - Sửa công thức tính sao Hoàng đạo / Hắc đạo trong `getDayRating` (bổ sung offset trừ 2 vì tháng Giêng khởi từ Dần, giúp xác định ngày Hoàng đạo chính xác 100%).
  3. **Khắc phục giao diện Web & Mobile**:
     - Làm động huy hiệu con giáp và năm trên Header `{dayData.canChi.year} {year}` thay vì gán cứng "Bính Ngọ 2026".
     - Đồng bộ `viewMonth` và `viewYear` tự động khi `currentDate` thay đổi.
     - Sửa lỗi cắt mất hàng thứ 6 (ngày 30, 31) trong lịch tháng thu nhỏ (Mini Calendar) với các tháng cần 42 ô.
     - Cập nhật ngày tạo nhắc nhở mặc định sang ngày thực tế thay vì '2026-09-25'.
     - Loại bỏ việc gán cứng sự kiện demo 16/9 trong lịch tháng.
  4. **Kiểm thử tự động & Đóng gói Triển khai**:
     - Bổ sung bộ test thiên văn toàn diện `shared/calendar/testCalendar.ts` (100% test cases vượt qua).
     - Bump version lên `1.1.1`.
     - Build và deploy container Docker `luna_app` lên production `http://lichannhien.com`.

- **Tiến độ triển khai**:
  - [x] Phân tích nguyên nhân gốc rễ: Hardcode 16/9/2026 và sai lệch trong thuật toán Âm lịch.
  - [x] Sửa thuật toán `solarToLunar`, `lunarToSolar`, `getDayRating` trong `shared/calendar/lunarCalendar.ts`.
  - [x] Đồng bộ mã nguồn thuật toán sang `web/src/domain/lunarCalendar.ts` và `mobile/src/domain/lunarCalendar.ts`.
  - [x] Sửa khởi tạo `currentDate` sang `new Date()` trong `web/src/App.tsx` và `mobile/App.tsx`.
  - [x] Tinh chỉnh UI Header badge, Mini calendar grid và AddReminderScreen.
  - [x] Chạy bộ kiểm thử tự động thiên văn `testCalendar.ts` (100% test pass).
  - [x] Bump version lên `1.1.1` trong `package.json`, `backend/package.json`, `web/package.json`.
  - [x] Rebuild Web Frontend và Backend TypeScript.
  - [x] Build Docker image mới và deploy container `luna_app` thành công.
  - [x] Kiểm thử kiểm tra trực tiếp qua curl/web trên `http://lichannhien.com`.
  - [x] Cập nhật `docs/CHANGELOG.md` và `docs/DECISIONS.md`.
