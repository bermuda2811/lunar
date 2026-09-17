# CHANGELOG.md — Lịch sử Thay đổi Dự án

Mọi thay đổi đáng kể của dự án được ghi nhận tại file này theo định dạng Keep a Changelog.

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
