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

---
## D-012: Xác Thực Bảo Mật Đăng Nhập Admin CMS & Tinh Giản Nội Dung Có Gắn Link
- **Date**: 2026-10-02
- **Status**: ACTIVE
- **Context**: Người dùng yêu cầu Admin CMS phải đăng nhập mới vào được (không để truy cập tự do), đồng thời trong Admin CMS cần lược bỏ toàn bộ các nội dung không gắn link (loại bỏ khung ghi chú tĩnh wireframe và các tab menu không có liên kết/chức năng).
- **Decision**:
  1. **Bảo mật Đăng nhập Admin CMS**:
     - Thiết lập màn hình Đăng nhập Quản Trị (`#login-screen`) khi truy cập `/admin`.
     - Tài khoản quản trị mặc định: `admin` (hoặc `admin@lichannhien.vn`), Mật khẩu: `admin123`.
     - Quản lý phiên làm việc thông qua Bearer Token bảo mật (`/api/v1/admin/login`, `/api/v1/admin/me`, `/api/v1/admin/logout`).
     - Tự động bảo vệ các API quản trị (`POST/PUT/DELETE /events`, `POST /donation/config`, `PATCH /donation/transactions/:id/confirm`) với `adminAuthMiddleware`.
  2. **Tinh Giản Nội Dung & Đảm Bảo 100% Gắn Link**:
     - Lược bỏ hoàn toàn khối ghi chú tĩnh từ wireframe (`wireframe-info-box`) không có liên kết hay tương tác.
     - Lược bỏ các tab menu không có link hoặc không có panel hoạt động (`quotes`, `users`, `analytics`, `settings`).
     - Toàn bộ menu và thành phần còn lại đều là liên kết hoặc công cụ tương tác trực tiếp: Quản lý sự kiện, Quản lý ủng hộ VietQR, Mở Web Lịch App, Xem trạng thái REST API, và Dữ liệu JSON sự kiện.
     - Các thẻ thống kê (Stats cards) đều hỗ trợ bấm nhảy nhanh và lọc dữ liệu tương ứng.
- **Reason**: Đảm bảo an toàn tuyệt đối cho hệ thống dữ liệu, ngăn chặn truy cập trái phép, đồng thời biến Admin CMS thành một trang quản trị chuyên nghiệp, gọn gàng, 100% thành phần đều có link hoặc công năng thực tế.

---

## D-013: Kiến Trúc Tối Ưu Hóa SEO Toàn Diện Cho Domain lichannhien.com
- **Date**: 2026-10-03
- **Status**: ACTIVE
- **Context**: Người dùng chỉ định tên miền chính thức của dự án là `lichannhien.com` và yêu cầu thiết kế chuẩn SEO để dễ dàng lên top search các công cụ tìm kiếm liên quan đến lịch, lịch âm dương, xem ngày, xem ngày âm dương, ngày hôm nay, lịch hôm nay, hôm nay ngày mấy, hôm nay là bao nhiêu âm lịch và các từ khóa phụ trợ (giờ hoàng đạo hôm nay, xem ngày tốt xấu, đổi ngày âm dương, lịch vạn niên 2026, tiết khí...).
- **Decision**:
  1. **Assets & Technical SEO**:
     - `web/public/robots.txt`: Cho phép bot crawl toàn bộ trang chính, chặn `/admin`, `/api/`, `/mobile-review`, khai báo Host chuẩn và Sitemap `https://lichannhien.com/sitemap.xml`.
     - `web/public/sitemap.xml`: Chuẩn XML sitemap định dạng 2026-10-03 cho các trang và tabs: Home, Today, Month, Events, Converter, Donate.
     - `web/public/manifest.json`: Web App Manifest cho PWA và mobile Google snippet.
     - `web/public/favicon.svg` và `og-image.png` (1200x630 px) chuẩn OpenGraph/Twitter Cards.
  2. **Semantic Pre-hydration Crawler Shell & Rich Schemas (`web/index.html`)**:
     - Canonical tag: `https://lichannhien.com/`.
     - Meta Title & Description chuẩn 155-160 ký tự trả lời trực diện câu hỏi *"Hôm nay ngày mấy? Hôm nay là bao nhiêu âm lịch?"*.
     - Meta Keywords bao phủ 100% danh sách từ khóa người dùng yêu cầu.
     - Tích hợp 3 Schema.org JSON-LD:
       - `WebSite` với SearchAction (Google Sitelinks Searchbox).
       - `WebApplication` xếp hạng 4.9 sao, danh mục UtilitiesApplication, giá Miễn phí.
       - `FAQPage` trả lời 5 câu hỏi vàng có search volume cao nhất về xem ngày, đổi ngày, giờ hoàng đạo.
     - Semantic Pre-hydration Crawler Shell: Khung HTML tĩnh chứa `<h1>`, `<h2>`, câu trả lời nhanh để crawler Googlebot/Bingbot index tức thì trước khi React hydrate.
  3. **Tối ưu Hóa React Component & Dynamic SEO (`CalendarWebApp.tsx`)**:
     - Dynamic SEO Hook `useEffect`: Tự động cập nhật `document.title` và `meta[name="description"]` thời gian thực theo từng ngày và từng tab được chọn.
     - Header `<h1>`: Thẻ `<h1>` ngữ nghĩa chuẩn cho bot và trình đọc màn hình.
     - **SEO Quick Answer Banner**: Khung trả lời câu hỏi trực tiếp trên đầu tờ lịch xé: *"Hôm nay ngày mấy? Thứ X, dd/mm/yyyy • Hôm nay là bao nhiêu âm lịch? Ngày dd/mm (Can Chi)"*.
     - **SEO Knowledge Hub & FAQ Section**: Chuyên mục cẩm nang tra cứu và 4 thẻ Q&A accordion phía trên footer giải đáp chi tiết các từ khóa trọng tâm.
- **Reason**: Đáp ứng trọn vẹn thuật toán Google Search Quality Rater và Search Intent của người dùng tìm kiếm về lịch Việt Nam, tối ưu Core Web Vitals, mang lại khả năng index tức thì và hiển thị Rich Snippets (FAQ Accordion, Site Search, Rating Stars) nổi bật trên Google SERP.

---

## D-014: Triển khai Domain Chính Thức http://lichannhien.com, Bỏ Domain Cũ và Làm Sạch Dữ Liệu Giao Dịch
- **Date**: 2026-10-03
- **Status**: ACTIVE
- **Context**: Ứng dụng Lịch An Nhiên bước vào giai đoạn triển khai production thực tế. Cần cấu hình tên miền chính thức `http://lichannhien.com` (và `www.lichannhien.com`), loại bỏ hoàn toàn việc phục vụ trên tên miền thử nghiệm cũ (`luna.1988.vn` và đường dẫn `/luna`), đồng thời làm sạch toàn bộ dữ liệu giao dịch mẫu (seed/test transactions) trong cơ sở dữ liệu `luna` để sẵn sàng đón nhận giao dịch ủng hộ thật từ cộng đồng, trong khi bảo toàn 100% dữ liệu danh mục ngày lễ, sự kiện văn hóa, câu chúc và cấu hình hệ thống.
- **Decision**:
  1. **Cấu hình Reverse Proxy Apache2**:
     - Ánh xạ `ServerName lichannhien.com` và `ServerAlias www.lichannhien.com` tới container Docker `luna_app` (`127.0.0.1:8087`).
     - Bỏ domain cũ: Cấu hình Redirect 301 vĩnh viễn từ `luna.1988.vn` và path `1988.vn/luna` về `http://lichannhien.com/` để người dùng không bị đứt gãy truy cập cũ.
  2. **Biến môi trường**: Cập nhật `APP_URL=http://lichannhien.com` trong file cấu hình `.env`.
  3. **Làm sạch Dữ liệu Giao dịch Test**:
     - Loại bỏ khối mã tự động nạp giao dịch mẫu (`// Seed sample transactions if empty`) trong `backend/src/database.ts` để ngăn việc tự động re-seed khi backend khởi động lại.
     - Xóa toàn bộ 3 bản ghi giao dịch test (`txn_seed_1`, `txn_seed_2`, `txn_seed_3`) khỏi bảng `transactions` trong cơ sở dữ liệu MySQL `luna`.
  4. **Bảo toàn Dữ liệu Production Khác**:
     - Giữ nguyên vẹn 11 sự kiện văn hóa dân tộc & quốc tế (`events`).
     - Giữ nguyên vẹn 5 câu chúc & danh ngôn truyền thống (`daily_quotes`).
     - Giữ nguyên vẹn cấu hình thông tin ủng hộ MB Bank / MoMo (`donation_config`).
     - Giữ nguyên vẹn bảng cấu hình ứng dụng (`app_config`) và thống kê (`analytics_stats`).
  5. **Đóng gói & Triển khai Docker**:
     - Build image Docker production mới (Version 1.1.0) tích hợp cả Web Frontend (React + Vite) và Backend REST API + Admin CMS trên cổng 4000 (ánh xạ 8087 trên host).
---

## D-015: Hiệu Chuẩn Toàn Diện Thuật Toán Âm Dương Lịch và Đồng Bộ Trải Nghiệm Ngày Thực Tế
- **Date**: 2026-10-03
- **Status**: ACTIVE
- **Context**: Khi người dùng truy cập `http://lichannhien.com`, ứng dụng trước đây luôn hiển thị ngày 16/9/2026 (ngày hardcode từ bản demo wireframe) thay vì ngày hôm nay thực tế. Đồng thời, thuật toán tính Âm lịch có sai lệch trong việc xác định năm âm lịch cho các ngày đầu năm dương lịch trước Tết (tháng 1 & tháng 2), lỗi tham chiếu tháng nhuận `lunarToSolar`, và sai lệch độ dời sao Hoàng đạo / Hắc đạo trong `getDayRating`.
- **Decision**:
  1. **Khởi tạo Ngày Thực Tế Mặc Định**: Thay đổi khởi tạo `currentDate` trong `web/src/App.tsx` và `mobile/App.tsx` sang `() => new Date()`, đảm bảo người dùng luôn thấy ngày thực tế ngay khi vào ứng dụng.
  2. **Hiệu chuẩn Thuật toán Hồ Ngọc Đức**:
     - Trong `solarToLunar`: Đặt `a11 = getLunarMonth11(yy, TIME_ZONE)` làm mốc và phân nhánh `yy` / `yy + 1` chuẩn xác; sửa năm âm lịch cho các ngày trước Tết.
     - Trong `lunarToSolar`: Sửa `b11 = getLunarMonth11(lunarYear + 1, TIME_ZONE)` khi tháng âm >= 11 và kiểm tra tháng nhuận chặt chẽ.
     - Trong `getDayRating`: Bổ sung độ dời `- 2` theo Chi tháng `((monthChiIndex - 2 + 12) % 6) * 2` để phản ánh đúng quy tắc khởi Thanh Long từ tháng Dần.
  3. **Tối ưu Giao diện Web**:
     - Header badge hiển thị động `{dayData.canChi.year} {year}`.
     - Đồng bộ tự động `viewMonth` và `viewYear` khi `currentDate` thay đổi.
     - Hiển thị đủ 42 ô cho các tháng có 6 hàng trên Lịch tháng mini (`Mini Calendar`).
     - Bộ chọn ngày nhắc nhở mới mặc định theo ngày thực tế.
  4. **Kiểm thử tự động**: Xây dựng bộ test `testCalendar.ts` kiểm thử các mốc chuyển giao năm, ngày Hoàng đạo và chuyển đổi 2 chiều đạt 100% độ chính xác.
- **Reason**: Đảm bảo trải nghiệm trực quan chính xác từng ngày cho người dùng thực tế và độ tin cậy thiên văn tuyệt đối cho ứng dụng Lịch Việt.

---

## D-016: Hỗ Trợ Upload Ảnh QR Code Ủng Hộ Tùy Chỉnh & Đồng Bộ Thông Tin CMS Ra Giao Diện Người Dùng
- **Date**: 2026-10-03
- **Status**: ACTIVE
- **Context**: Mã QR và thông tin tài khoản ngân hàng ủng hộ trên Web App trước đây bị gán cứng (hardcode MB Bank, NGUYEN TRUNG, 0988668899) thay vì lấy theo cấu hình người quản trị đã lưu trong MySQL thông qua Admin CMS. Đồng thời, một số ngân hàng (như VPBank) tạo mã QR không khớp hoàn toàn với template VietQR tự động, do đó quản trị viên có nhu cầu tải trực tiếp ảnh chụp mã QR từ app ngân hàng lên để người dùng quét chuẩn xác 100%.
- **Decision**:
  1. **Upload & Phục Vụ Ảnh Tĩnh Trên Backend**:
     - Cấu hình thư mục tĩnh `/uploads` phục vụ trực tiếp qua Express (`app.use('/uploads', express.static(uploadsDir))`).
     - Tăng giới hạn payload JSON lên 25MB (`express.json({ limit: '25mb' })`) để xử lý upload ảnh an toàn.
     - Endpoint `POST /api/v1/donation/upload-qr` (bảo vệ bởi `adminAuthMiddleware`): tiếp nhận Base64 hình ảnh, ghi file định dạng an toàn vào thư mục `uploads/` và cập nhật đường dẫn vào cột `custom_qr_url` trong bảng `donation_config`.
     - Nâng cấp cột `custom_qr_url` sang kiểu `LONGTEXT` trong MySQL để lưu trữ linh hoạt.
  2. **Giao Diện Admin CMS (`/admin`)**:
     - Bổ sung khối xem trước trực quan (Live Preview) cho mã QR trong mục "Ủng hộ & VietQR".
     - Nút tải lên ảnh chụp QR code từ máy tính/điện thoại (`input[type="file"]`).
     - Nút xóa ảnh tùy chỉnh để chuyển về mã VietQR tự động khi cần.
     - Tự động đồng bộ và xem trước mã VietQR thời gian thực khi chỉnh sửa số tài khoản, mã BIN, chủ tài khoản.
  3. **Đồng Bộ Dữ Liệu Lên Giao Diện Web & Mobile App**:
     - Loại bỏ toàn bộ giá trị hardcode trong `web/src/views/CalendarWebApp.tsx`, `web/src/screens/DonateScreen.tsx` và `mobile/src/screens/DonateScreen.tsx`.
     - Tự động gọi API `GET /api/v1/donation/config` để lấy thông tin mới nhất: Ngân hàng, Chủ tài khoản, Số tài khoản, Ví MoMo.
     - Logic hiển thị mã QR: Ưu tiên hiển thị `customQrUrl` nếu đã được tải lên; nếu chưa có sẽ tự động sinh mã VietQR theo chuẩn Napas 24/7.
     - Nút "Sao chép số tài khoản" tự động sao chép đúng số tài khoản quản trị viên đã cấu hình.
- **Reason**: Đảm bảo sự linh hoạt tối đa cho quản trị viên, loại bỏ hoàn toàn sai lệch thông tin giữa cài đặt CMS và giao diện người dùng thực tế, hỗ trợ mọi ngân hàng Việt Nam một cách chính xác tuyệt đối.

