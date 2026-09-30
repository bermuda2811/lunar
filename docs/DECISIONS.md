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

---

## D-005: Đồng nhất Thiết kế và Kiến trúc Màn hình Mobile theo Chuẩn Webview
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Giao diện Mobile trước đây được viết dồn trong một file `App.tsx` lớn, sử dụng icon emoji thô sơ, thanh tiêu đề đơn điệu và thiếu các màn hình tra cứu, sự kiện, splash. Trong khi đó bản Webview (React Web) có giao diện thanh thoát, mạch lạc, thẩm mỹ cao và được người dùng đánh giá dễ nhìn hơn.
- **Decision**: Tái cấu trúc toàn bộ ứng dụng Mobile thành kiến trúc module màn hình độc lập (`src/screens/*`, `src/components/*`), đồng nhất 100% về bảng màu (Warm Cream, Heritage Red, Green), typography, layout thẻ ngày, và thay thế toàn bộ emoji bằng icon vector `lucide-react-native` chuyên nghiệp.
- **Reason**: Tạo trải nghiệm thị giác và thao tác đồng nhất, sắc nét, trang nhã, dễ nhìn và dễ sử dụng nhất cho người dùng và người cao tuổi trên cả Mobile và Web.
- **Consequences**: Cần duy trì sự đồng bộ song song giữa `mobile/src/screens/` và `web/src/screens/`.

---

## D-006: Quản lý Tài khoản Khách Tự động, Đăng nhập Email OTP & Ủng hộ Nhà phát triển
- **Date**: 2026-09-18
- **Status**: ACTIVE
- **Context**: Cần bổ sung quản lý tài khoản để lưu trữ sự kiện/nhắc nhở riêng biệt theo từng tài khoản mà không làm gián đoạn trải nghiệm người dùng mới; hỗ trợ đăng nhập Email OTP không mật khẩu; bổ sung tính năng ủng hộ nhà phát triển (VietQR); và đổi icon Cài đặt trên Header thành icon Profile/Tài khoản.
- **Decision**:
  1. **Seamless Guest Account**: Tự động tạo tài khoản khách ngầm (`guest_xxx`) khi vừa vào app, lưu dữ liệu nhắc nhở theo từng tài khoản (`@reminders_${userId}`). Không hiển thị modal ép đăng nhập.
  2. **Passwordless Email OTP**: Đăng nhập nhanh qua mã OTP 6 số gửi về email, hỗ trợ tự động gộp (merge) sự kiện từ tài khoản khách vào tài khoản email đã xác thực.
  3. **Tích hợp Ủng hộ VietQR**: Tạo mã VietQR động chuẩn ngân hàng qua URL `img.vietqr.io` với 4 mức ủng hộ thân thiện (10k, 30k, 50k, 100k), sao chép thông tin chuyển khoản 1 chạm.
  4. **Icon Profile trên Header**: Thay icon bánh răng trên Header màn hình chính bằng icon `User`, liên kết trực tiếp tới màn hình Tài khoản & Cài đặt.
- **Reason**: Tối ưu tuyệt đối cho người lớn tuổi (không cần nhớ mật khẩu), bảo toàn dữ liệu cá nhân, đảm bảo ứng dụng luôn miễn phí và không có quảng cáo.

---

## D-007: Kiến trúc Đăng nhập Song hành (Google OAuth 2.0 & Resend Email OTP) & Duy trì Monorepo
- **Date**: 2026-09-19
- **Status**: ACTIVE
- **Context**: Người dùng muốn triển khai thật tính năng đăng nhập Gmail và đặt câu hỏi về việc có nên tách riêng Git của Web, Backend và App Mobile ra 3 repositories độc lập hay không.
- **Decision**:
  1. **Duy trì Monorepo**: Giữ nguyên 1 Git repository chung cho toàn bộ dự án (`backend/`, `web/`, `mobile/`, `shared/`, `docs/`).
     - *Lý do*: Tái sử dụng trọn vẹn tầng nghiệp vụ Âm Lịch Hồ Ngọc Đức tại `shared/calendar`, đảm bảo tính toàn vẹn API và Feature Parity 100%, bảo toàn nguồn thông tin chuẩn (Single Source of Truth) cho AI Agent và chỉ cần 1 lệnh để chạy toàn bộ hệ thống.
  2. **Đăng nhập Google 1 chạm (Google OAuth 2.0)**:
     - Nút to đặt ở vị trí ưu tiên hàng đầu, 1 chạm tự động lấy Email, Họ tên, Avatar, không cần gõ bàn phím (tối ưu nhất cho người cao tuổi).
     - Backend xác thực token và lưu trữ thông tin trong bảng `users`.
  3. **Gửi mã OTP thật về Gmail qua Resend API**:
     - Tích hợp dịch vụ Resend chất lượng cao, gửi email HTML phong cách thiệp Tết cổ truyền Lịch An Nhiên kèm mã OTP 6 số (thời hạn 10 phút).
  4. **Bảo toàn dữ liệu (Merge Guest Data)**: Toàn bộ ngày giỗ, lịch cúng của tài khoản khách trên máy được tự động chuyển giao vào tài khoản Google/Email đã xác thực.

---

## D-008: Chuyển đổi Cơ sở dữ liệu Backend từ SQLite sang MySQL 8.0
- **Date**: 2026-09-19
- **Status**: ACTIVE
- **Context**: Người dùng yêu cầu đồng bộ toàn bộ cơ sở dữ liệu của dự án sang MySQL local để quản trị tập trung và phù hợp với hạ tầng hiện tại của hệ thống.
- **Decision**:
  1. Chuyển đổi toàn bộ cơ chế lưu trữ của Backend sang **MySQL 8.0** (sử dụng thư viện `mysql2/promise` kết nối qua Connection Pool).
  2. Tự động khởi tạo đầy đủ 9 bảng dữ liệu trong cơ sở dữ liệu `lich_an_nhien`: `events`, `daily_quotes`, `app_config`, `analytics_stats`, `users`, `user_reminders`, `email_otps`, `donation_config`, và `transactions`.
  3. Di chuyển và đồng bộ toàn bộ dữ liệu lịch sử, sự kiện văn hóa từ SQLite `calendar.db` sang MySQL `lich_an_nhien` một cách trọn vẹn, không thất thoát dữ liệu.
  4. Cấu hình thông tin kết nối qua file `backend/.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- **Reason**: Đáp ứng yêu cầu chuẩn hóa hạ tầng của người dùng, nâng cao khả năng chịu tải đồng thời (concurrent connections) và dễ dàng quản lý qua các công cụ GUI như DBeaver, TablePlus, hoặc phpMyAdmin.

---

## D-009: Cấu hình Môi trường Docker MySQL và Cơ chế Tự động Phân giải Host Thông minh
- **Date**: 2026-09-19
- **Status**: ACTIVE
- **Context**: MySQL local của người dùng chạy trên Docker container với cấu hình container network tiêu chuẩn (`DB_CONNECTION=mysql`, `DB_HOST=mysql`, `DB_PORT=3306`, `DB_DATABASE=finance`, `DB_USERNAME=root`, `DB_PASSWORD=thanhtrung@#@1`). Cần đồng bộ cấu hình này cho Lịch An Nhiên mà không làm xung đột cơ sở dữ liệu với các dự án khác, đồng thời xử lý được ký tự đặc biệt `#` trong password và giải quyết hostname `mysql` khi chạy cả trong lẫn ngoài container.
- **Decision**:
  1. **Phân tách Database riêng**: Sử dụng database riêng `lich_an_nhien` trên cùng cụm Docker MySQL để cách ly an toàn dữ liệu với database `finance` của dự án khác.
  2. **Chuẩn hóa biến môi trường**: Hỗ trợ đầy đủ bộ biến theo chuẩn Docker: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE` (hoặc `DB_NAME`), `DB_USERNAME` (hoặc `DB_USER`), `DB_PASSWORD`.
  3. **Bọc mật khẩu trong dấu ngoặc kép**: `DB_PASSWORD="thanhtrung@#@1"` để ngăn thư viện `dotenv` hiểu nhầm ký tự `#` là bắt đầu chú thích (comment delimiter).
  4. **Bộ phân giải Host thông minh (Auto DNS Fallback)**:
     - Khi chạy trong Docker container network, `mysql` được phân giải nội bộ qua Docker DNS engine.
     - Khi chạy trực tiếp trên máy host (`npm run dev:backend`), nếu DNS không tìm thấy host `mysql`, Connection Pool tự động fallback về `127.0.0.1:3306` (cổng ánh xạ của container).
- **Reason**: Cho phép cùng một file cấu hình `.env` hoạt động liền mạch cả khi dev cục bộ trên host lẫn khi đóng gói ứng dụng vào Docker container mà không cần chỉnh sửa thủ công.

---

## D-010: Tách Biệt Giao Diện Web Người Dùng Thực Tế (Web PC + Web Mobile) và Tuyến Đường Review Mô Phỏng
- **Date**: 2026-09-19
- **Status**: ACTIVE
- **Context**: Người dùng yêu cầu phân định rạch ròi: Trang web chính thức phải là ứng dụng thực tế dành cho người dùng cuối (hoạt động hoàn hảo trên cả máy tính Web PC lẫn điện thoại Web Mobile, sạch sẽ, không có thanh công cụ review hay nút demo), còn giao diện review mô phỏng Wireframe khung điện thoại được chuyển sang một đường dẫn riêng biệt để theo dõi độc lập.
- **Decision**:
  1. **Giao diện Web Người Dùng Thực Tế (`http://localhost:3000/`)**:
     - **Web PC (màn hình lớn)**: Bố cục đa cột sang trọng, thẩm mỹ truyền thống An Nhiên, gồm Tờ lịch xé bàn cỡ lớn, 12 Giờ hoàng đạo thời gian thực, Hướng xuất hành, Lịch tháng mini tương tác, Nhắc nhở cá nhân, Bách khoa lễ tết, Đổi ngày Âm Dương và Trang ủng hộ VietQR.
     - **Web Mobile (trình duyệt điện thoại)**: Tự động thích ứng toàn màn hình (Responsive Native-like Web), thanh điều hướng đáy cố định (Fixed Bottom Navigation Bar: [Hôm nay], [Lịch tháng], [Lễ tết], [Đổi ngày], [Nhắc nhở], [Ủng hộ]), touch target >= 48px, không chứa khung điện thoại giả hay thanh công cụ lập trình.
  2. **Giao diện Review Mô Phỏng Wireframe (`http://localhost:3000/mobile-review` hoặc `http://localhost:3000/review`)**:
     - Cung cấp khung mô phỏng Smartphone thực tế (Phone Frame với Dynamic Island / Notch) kèm bộ chọn 13 màn hình theo đúng Wireframe để quản trị viên / lập trình viên kiểm thử và demo.
- **Reason**: Đảm bảo người dùng thực tế có trải nghiệm trực quan, tự nhiên nhất trên mọi thiết bị, đồng thời bảo toàn công cụ kiểm thử Wireframe ở đường dẫn riêng biệt.

---

## D-011: Tối Ưu Bố Cục Header 1 Hàng Ngang & Phân Bổ Tính Năng Theo Ngữ Cảnh Tự Nhiên
- **Date**: 2026-09-19
- **Status**: ACTIVE
- **Context**: Header trước đây còn chứa nhiều nút điều khiển rời rạc (nút Hôm nay riêng, ô chọn ngày riêng, nút kính lúp tìm kiếm riêng, tab Đổi ngày làm thanh menu chính quá dài tới 6 tabs). Người dùng yêu cầu tối ưu Header thành 1 hàng ngang duy nhất, bỏ nút Hôm nay rời rạc gom chung với widget chuyển ngày, chuyển chức năng tìm kiếm sự kiện vào mục Lễ Tết, và đưa chức năng đổi ngày vào menu tài khoản.
- **Decision**:
  1. **Widget Chuyển Ngày Thống Nhất (Unified Date Stepper)**: Thay vì nút "Hôm nay" rời rạc, tích hợp thẳng nút/chỉ báo "Hôm nay" vào bên trong widget `[ < ] [ dd/mm/yyyy • Hôm nay ] [ > ]`. Khi đang ở ngày khác, nút nhảy về "Hôm nay" xuất hiện tinh gọn dạng chip bấm 1 chạm.
  2. **Tìm Kiếm Sự Kiện Tích Hợp Tab Lễ Tết**: Xóa bỏ nút kính lúp tìm kiếm trên Header; đặt thanh tìm kiếm sự kiện kèm bộ lọc 5 danh mục trực quan ngay đầu tab "Lễ Tết & Sự Kiện".
  3. **Đưa Chức Năng Đổi Ngày Vào Menu Tài Khoản**: Rút gọn thanh Navigation chính và Mobile Bottom Bar xuống đúng 5 tabs vàng (`Hôm Nay`, `Lịch Tháng`, `Lễ Tết`, `Nhắc Nhở`, `Ủng Hộ`). Tích hợp trọn vẹn công cụ chuyển đổi Âm – Dương chuẩn thiên văn (Hồ Ngọc Đức) vào Modal/Menu Tài khoản (`accountModalTab: 'account' | 'converter'`).
- **Reason**: Tạo nên Header 56px (`h-14`) cực kỳ tinh gọn, thẩm mỹ cao, không bị tràn dòng, đồng thời sắp xếp các tính năng chuyên biệt (tra cứu lễ hội, đổi ngày) vào đúng ngữ cảnh tự nhiên nhất cho người dùng.




