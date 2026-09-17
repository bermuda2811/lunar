# CHANGELOG.md — Lịch sử Thay đổi Dự án

Mọi thay đổi đáng kể của dự án được ghi nhận tại file này theo định dạng Keep a Changelog.

## [0.1.6] - 2026-09-18
### Fixed
- Khắc phục triệt để lỗi tràn viền (Edge-to-Edge) trên thiết bị Android: bọc ứng dụng bằng `SafeAreaProvider` kèm `initialWindowMetrics`, tự động tính toán và áp dụng `topInset` (Status Bar insets) và `bottomInset` (System Navigation Bar 3 nút ảo), giúp thanh tiêu đề "LỊCH AN NHIÊN" và thanh Bottom Navigation Bar hiển thị hoàn toàn bên trong vùng an toàn (Safe Area), không bị che lấp.

## [0.1.5] - 2026-09-18
### Fixed
- Chuyển đổi thành công component `SafeAreaView` sang `react-native-safe-area-context` chuẩn React Native mới nhất, bọc `SafeAreaProvider` loại bỏ triệt để cảnh báo deprecation.

## [0.1.4] - 2026-09-18
### Fixed
- Tắt tự động tải Electron React Native DevTools standalone trên Linux để loại bỏ hoàn toàn lỗi cấp quyền `chrome-sandbox` (SUID 4755). Quá trình khởi động Metro Bundler và hiển thị mã QR trên terminal diễn ra sạch sẽ, không có thông báo lỗi.

## [0.1.3] - 2026-09-18
### Changed
- Nâng cấp dự án `mobile/` lên **Expo SDK 57** (`expo@~57.0.23`, `react-native@0.86.3`, `react@19.2.3`), tương thích tuyệt đối với phiên bản ứng dụng Expo Go mới nhất trên CH Play / Android.

## [0.1.2] - 2026-09-18
### Fixed
- Bổ sung `expo-asset`, `expo-status-bar` chuẩn tương thích Expo SDK 52 cho thư mục `mobile/`.
- Cài đặt `typescript@~5.3.3` tương thích với Expo Metro Config thay vì phiên bản thử nghiệm.
- Tạo file `mobile/index.js` làm entry point chính thức cho Expo bundler.

## [0.1.1] - 2026-09-18
### Fixed
- Khắc phục lỗi nạp module thuật toán âm lịch trên Web client (loại bỏ tệp CommonJS sinh thừa, đồng bộ module TypeScript nội bộ).
- Khởi tạo đầy đủ assets biểu tượng và cấu hình `moduleResolution` cho ứng dụng mobile Expo SDK 52.

## [0.1.0] - 2026-09-18
### Added
- Khởi tạo cấu trúc bộ nhớ dự án (Project Memory): `AGENTS.md`, thư mục `docs/` (`PRODUCT.md`, `ARCHITECTURE.md`, `UI_UX.md`, `DATABASE.md`, `API.md`, `DECISIONS.md`, `CHANGELOG.md`), thư mục `tasks/` (`BACKLOG.md`, `current.md`).
- Phân tích chi tiết 11 màn hình từ file thiết kế chuẩn `wireframe.png`.
- Quyết định kiến trúc ADR D-001 tới D-004.
