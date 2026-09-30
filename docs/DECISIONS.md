# DECISIONS.md — Nhật ký Quyết định Kỹ thuật & Sản phẩm

Tài liệu này lưu trữ toàn bộ các Quyết định Kiến trúc (Architectural Decision Records - ADR) quan trọng của dự án theo chuẩn D-xxx.

---

## D-001: Lựa chọn Thuật toán Tính Âm Dương Lịch Việt Nam
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Ứng dụng xem lịch cho người Việt cần độ chính xác thiên văn tuyệt đối về múi giờ UTC+7 (Hà Nội/Hồ Chí Minh), bao gồm tháng nhuận, can chi ngày/tháng/năm, tiết khí và giờ hoàng đạo. Nếu dùng thuật toán lịch Trung Quốc (UTC+8) sẽ bị lệch ngày trong các năm nhuận hoặc thời điểm giao thời.
- **Decision**: Sử dụng thuật toán chuyển đổi Âm Dương lịch thiên văn chuẩn của nhà nghiên cứu Hồ Ngọc Đức, triển khai thuần TypeScript trong module `src/domain/calendar/` độc lập, hỗ trợ cả 2 chiều: Dương → Âm và Âm → Dương.
- **Reason**: Đã được kiểm chứng độ chính xác thực tế qua nhiều thập kỷ tại Việt Nam; không phụ thuộc thư viện bên ngoài; chạy hoàn toàn offline với hiệu năng cao (< 1ms/lần tính).
- **Consequences**: Cần duy trì bộ automated test với các mốc ngày đại diện (Representative test cases) để ngăn ngừa regression.

---

## D-002: Kiến trúc Ứng dụng Client Đa nền tảng (Mobile & Web)
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Khách hàng yêu cầu cả ứng dụng mobile (Android & iOS) và Web lịch khớp 100% wireframe, đồng thời cần có thể dễ dàng kiểm thử trực tiếp trên Web trình duyệt và kiểm thử ứng dụng Android.
- **Decision**: Chọn **React Native với Expo** kết hợp **React Native Web**. 
- **Reason**: 
  - Một codebase duy nhất phục vụ cả Mobile (Android/iOS qua Expo/EAS) và Web (React Native Web).
  - Giao diện, component, state, domain logic đồng nhất 100%.
  - Người dùng có thể khởi chạy và trải nghiệm ngay trên trình duyệt máy tính mà không cần cài máy ảo Android nặng nề, đồng thời quét mã QR chạy ngay trên điện thoại thật bằng Expo Go hoặc xuất file APK.
- **Consequences**: Cần kiểm tra kỹ các thành phần UI để hiển thị hoàn hảo cả trên màn hình di động lẫn khung xem trước web.

---

## D-003: Kiến trúc Backend và Admin CMS Dashboard
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Yêu cầu Màn hình 11 trong Wireframe là giao diện Backend/Admin CMS quản lý sự kiện, ngày lễ, câu chúc, cấu hình và cung cấp REST API cho Mobile/Web App.
- **Decision**: Xây dựng Backend bằng Node.js + Express + TypeScript + SQLite, tích hợp sẵn trang Admin CMS Web tương ứng chuẩn 100% với giao diện ở Màn hình 11 wireframe.
- **Reason**: Đơn giản, tự chứa (self-contained), không đòi hỏi cài đặt MySQL/Postgres nặng nề, khởi động tức thì, phục vụ cả REST API và giao diện quản trị CMS chuyên nghiệp.
- **Consequences**: Dễ dàng chạy và kiểm thử độc lập hoặc song song chỉ bằng một lệnh npm.

---

## D-004: Chiến lược Xử lý Nhắc nhở Âm Lịch (Lunar Reminders)
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Người Việt Nam thường xuyên có nhu cầu nhắc ngày giỗ chạp, ngày rằm, mùng một theo Âm lịch lặp lại hàng năm, nhưng hệ điều hành (Android/iOS/Web) chỉ hỗ trợ đặt lịch theo ngày Dương lịch.
- **Decision**: Thiết kế tầng Reminder Domain tự động quy đổi ngày Âm sang ngày Dương tương ứng của năm hiện tại và năm tiếp theo bằng thuật toán `lunarToSolar`, sau đó lập lịch nhắc trước theo số ngày người dùng chọn (0 ngày, 1 ngày, 3 ngày, 7 ngày).
- **Reason**: Mang lại trải nghiệm bản địa hóa hoàn hảo, người dùng không phải tự tính nhẩm ngày giỗ dương lịch mỗi năm.
