# CHANGELOG.md — Lịch sử Thay đổi Dự án

Mọi thay đổi đáng kể của dự án được ghi nhận tại file này theo định dạng Keep a Changelog.

## [1.1.1] - 2026-10-03
### Fixed
- **Khắc Phục Lỗi Hiển Thị Ngày Mặc Định**:
  - Sửa lỗi gán cứng `new Date(2026, 8, 16)` trong `web/src/App.tsx` và `mobile/App.tsx`. Ứng dụng hiện tại luôn tự động mở ra đúng ngày thực tế của người dùng (`new Date()`).
- **Khắc Phục Thuật Toán Âm Dương Lịch Thiên Văn Hồ Ngọc Đức (UTC+7)**:
  - **`solarToLunar`**: Sửa logic mốc `a11` và `lunarYear`. Trước đây tính sai năm âm lịch (nhảy sang năm mới sớm trước Tết) cho tất cả các ngày trong tháng 1 và đầu tháng 2 dương lịch trước Tết Nguyên Đán.
  - **`lunarToSolar`**: Sửa lỗi tham chiếu `b11` khi tháng âm >= 11 (trước đây cả `a11` và `b11` đều trỏ vào cùng 1 năm khiến `b11 - a11` luôn bằng 0, không nhận diện được tháng nhuận).
  - **`getDayRating`**: Sửa công thức tính sao Hoàng đạo / Hắc đạo theo Chi tháng bằng cách thêm độ dời `- 2` do tháng Giêng khởi từ Dần (index 2). Khắc phục triệt để hiện tượng đảo ngược Hoàng đạo / Hắc đạo.
- **Tối Ưu Giao Diện & Trải Nghiệm Người Dùng**:
  - Header badge hiển thị động `{dayData.canChi.year} {year}` thay vì gán cứng `Bính Ngọ 2026`.
  - Tự động đồng bộ `viewMonth` và `viewYear` khi `currentDate` thay đổi.
  - Lịch tháng mini (`Mini Calendar`) tự động hiển thị đủ 6 hàng (42 ô) đối với các tháng có ngày 30, 31 rơi vào tuần thứ 6, không còn bị cắt cụt.
  - Bộ chọn ngày nhắc nhở mới mặc định theo ngày thực tế hôm nay thay vì hardcode `2026-09-25`.
  - Loại bỏ các mốc sự kiện demo hardcode trong lịch tháng.

### Added
- **Bộ Kiểm Thử Độ Chính Xác Thiên Văn Tự Động**:
  - `shared/calendar/testCalendar.ts` kiểm thử toàn diện các mốc chuyển giao năm âm lịch trước & sau Tết (2024, 2025, 2026, 2027), kiểm thử roundtrip 2 chiều và kiểm thử ngày Hoàng đạo (đạt tỷ lệ vượt qua 100%).

## [1.1.0] - 2026-10-03
### Added
- **Triển Khai Tên Miền Chính Thức http://lichannhien.com**:
  - Cấu hình VirtualHost Apache2 phục vụ trực tiếp tại domain `http://lichannhien.com` và `http://www.lichannhien.com`.
  - Thiết lập cơ chế Redirect 301 vĩnh viễn từ domain thử nghiệm cũ `luna.1988.vn` và đường dẫn `1988.vn/luna` sang `http://lichannhien.com/`.
  - Cập nhật biến môi trường `APP_URL=http://lichannhien.com`.

### Changed
- **Làm Sạch Dữ Liệu Giao Dịch & Khóa Cơ Chế Tự Động Re-seed**:
  - Xóa bỏ dữ liệu giao dịch thử nghiệm (`txn_seed_1`, `txn_seed_2`, `txn_seed_3`) khỏi bảng `transactions`.
  - Loại bỏ khối khởi tạo mẫu trong `backend/src/database.ts`, đảm bảo hệ thống production chỉ ghi nhận các giao dịch ủng hộ thực tế.
  - Bảo toàn 100% dữ liệu sự kiện văn hóa (`events`), câu chúc (`daily_quotes`), cấu hình nhận tiền MB Bank (`donation_config`), cấu hình app (`app_config`), thống kê (`analytics_stats`).

### Deployment
- Đóng gói Docker image `luna_app` mới (Version 1.1.0) và khởi chạy an toàn trong cụm mạng `shared_net` kết nối MySQL `luna`.

## [0.2.7] - 2026-09-19
### Changed
- **Tối Ưu Phân Bố Tính Năng & Tinh Gọn Giao Diện Web Theo Yêu Cầu**:
  - **Tích Hợp Nút "Hôm Nay" Vào Widget Chuyển Ngày**: Loại bỏ nút "Hôm nay" riêng lẻ trên Header; gom thành cụm Date Stepper thống nhất `[ < ] [ dd/mm/yyyy • Hôm nay ] [ > ]`. Chỉ kích hoạt nút quay về "Hôm nay" dạng chip khi đang xem ngày khác.
  - **Đưa Chức Năng Tìm Sự Kiện Vào Mục "Lễ Tết"**: Loại bỏ nút kính lúp tìm kiếm rời rạc trên Header. Bổ sung ô tìm kiếm trực quan kèm bộ lọc 5 danh mục văn hóa (Tất cả, Truyền thống, Quốc lễ, Quốc tế, Tri ân) ngay đầu tab "Lễ Tết & Sự Kiện".
  - **Đưa Công Cụ Đổi Ngày Vào Menu Tài Khoản**: Rút gọn thanh Navigation chính và Mobile Bottom Bar xuống đúng 5 tabs chuẩn (`Hôm Nay`, `Lịch Tháng`, `Lễ Tết`, `Nhắc Nhở`, `Ủng Hộ`). Tích hợp trọn vẹn công cụ chuyển đổi Âm – Dương chuẩn thiên văn (Hồ Ngọc Đức) vào trong Modal/Menu Tài khoản người dùng (`accountModalTab: 'account' | 'converter'`).

## [0.2.6] - 2026-09-19
### Changed
- **Tối Ưu Header Tinh Gọn 1 Dòng (Single-Line 56px Header)**:
  - Tinh giảm chiều cao Header xuống chuẩn `h-14` (56px) mỏng nhẹ, thanh thoát, mở rộng tối đa tầm nhìn cho nội dung tờ lịch bên dưới.
  - Đưa toàn bộ Logo con dấu đỏ `[L]`, Tên `LỊCH AN NHIÊN` và Huy hiệu `Bính Ngọ 2026` lên đúng 1 hàng ngang duy nhất (loại bỏ dòng slogan phụ gây 2 dòng).
  - Tinh gọn cụm điều hướng ngày bên phải thành dạng viên thuốc mượt mà `[ < | Hôm nay | Ngày tháng | > ]`, loại bỏ ô input ngày thô cứng.
  - Cân đối thanh Navigation Tabs ở giữa và các nút Tìm kiếm, Tài khoản, đảm bảo tất cả các thành phần nằm trên một đường thẳng chuẩn mực.

## [0.2.5] - 2026-09-19
### Added
- **Phiên bản Web Desktop Đa Cột & Tách Biệt Tuyến Đường Mobile Review**:
  - Xây dựng giao diện Web Desktop toàn diện (`DesktopWebView`) tại `localhost:3000/`, tối ưu trải nghiệm cho máy tính để bàn, laptop và co giãn mượt mà trên trình duyệt di động.
  - Bố cục đa cột: Tờ lịch xé block bàn truyền thống cỡ lớn, Chi tiết Phong thủy & Giờ hoàng đạo thời gian thực, Lịch tháng mini tương tác, Lịch nhắc nhở cá nhân, Bách khoa lễ tết, Đổi ngày Âm Dương chuẩn thiên văn và Trang ủng hộ VietQR.
  - Chuyển giao diện mô phỏng điện thoại di động (Phone Frame) sang tuyến đường riêng biệt `localhost:3000/mobile-review` với đầy đủ 13 màn hình theo wireframe.
  - Hệ thống điều hướng Client-side thông minh hai chiều giữa Web Desktop và Mobile Review, hỗ trợ lịch sử trình duyệt (`popstate`).

## [0.2.4] - 2026-09-19
### Added
- **Chuẩn hóa Cấu hình Docker MySQL & Cơ chế Tự Phân giải Host Thông minh**:
  - Tương thích 100% với cấu hình MySQL trên container Docker của người dùng (`DB_CONNECTION=mysql`, `DB_HOST=mysql`, `DB_PORT=3306`, `DB_DATABASE=lich_an_nhien`, `DB_USERNAME=root`, `DB_PASSWORD="thanhtrung@#@1"`).
  - Phân tách cơ sở dữ liệu độc lập `lich_an_nhien` trên cùng cụm MySQL của hệ thống (không trùng lấn dữ liệu với các database khác).
  - Tự động bọc mật khẩu trong ngoặc kép để bảo toàn ký tự đặc biệt `#`, tránh việc `dotenv` cắt bỏ thành comment.
  - Tích hợp bộ phân giải DNS thông minh trong `backend/src/database.ts`: tự động kết nối qua `127.0.0.1:3306` khi chạy trên máy host và qua mạng container `mysql:3306` khi chạy trong Docker network.

## [0.2.3] - 2026-09-19
### Changed
- **Chuyển đổi Toàn bộ Cơ sở Dữ liệu Backend sang MySQL 8.0**:
  - Cài đặt driver `mysql2` và triển khai cơ chế kết nối Connection Pool bất đồng bộ (`mysql2/promise`).
  - Khởi tạo đầy đủ 9 bảng dữ liệu chuẩn hóa trong MySQL `lich_an_nhien` (charset `utf8mb4_unicode_ci`): `events`, `daily_quotes`, `app_config`, `analytics_stats`, `users`, `user_reminders`, `email_otps`, `donation_config`, `transactions`.
  - Di chuyển và đồng bộ hóa thành công toàn bộ dữ liệu lịch sử từ SQLite sang MySQL mà không thất thoát dữ liệu.
  - Cập nhật toàn bộ các API endpoints trong `backend/src/server.ts` sang truy vấn bất đồng bộ MySQL.
  - Cấu hình kết nối tập trung trong file `backend/.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

## [0.2.2] - 2026-09-19
### Added
- **Hệ thống Database Đầy Đủ & Bảng Giao Dịch Ủng Hộ (SQLite 3)**:
  - Bảng `users`: Bổ sung `auth_provider`, `role`, `status`, `last_login_at` và cơ chế migration an toàn.
  - Bảng `user_reminders`: Bổ sung `is_leap_month` (hỗ trợ tháng nhuận Âm lịch) và `sync_status`.
  - Bảng `donation_config`: Quản lý tập trung thông tin ngân hàng (`bank_bin`, `bank_name`, `account_number`, `account_holder`), template QR, gợi ý mệnh giá (`suggested_amounts`), ví MoMo, cú pháp mẫu và lời tri ân.
  - Bảng `transactions`: Lưu vết toàn bộ lịch sử giao dịch ủng hộ (`id`, `user_id`, `amount`, `payment_method`, `transaction_code`, `sender_name`, `sender_email`, `message`, `status`, `is_anonymous`).
  - Nạp dữ liệu mẫu giao dịch tri ân từ cộng đồng.
- **RESTful Endpoints Quản lý Donate & VietQR Động**:
  - `GET /api/v1/donation/config`: Trả về cấu hình nhận ủng hộ kèm URL VietQR chuẩn NAPAS 247.
  - `POST /api/v1/donation/config`: Cập nhật cấu hình nhận tiền trên Admin CMS.
  - `POST /api/v1/donation/transactions`: Tạo giao dịch ủng hộ với mã thanh toán riêng (`ANNHIEN_xxxxx`) và sinh mã VietQR động theo đúng số tiền và cú pháp.
  - `GET /api/v1/donation/transactions`: Lấy danh sách giao dịch (hỗ trợ `?publicOnly=true` cho Bảng vàng tri ân).
  - `PATCH /api/v1/donation/transactions/:id/confirm`: Xác nhận giao dịch thành công và gửi email tri ân tự động qua Resend API.
- **Nâng cấp Màn hình Donate trên Web & Mobile**:
  - Tích hợp VietQR động tự động đổi mã QR và số tiền theo lựa chọn (10k, 30k, 50k, 100k, 200k hoặc nhập số tiền tùy tâm).
  - Form gửi lời nhắn tri ân, email nhận thư cảm ơn và tùy chọn ủng hộ ẩn danh.
  - Tích hợp "Bảng vàng tri ân cộng đồng" hiển thị các lời chúc ấm áp gần nhất.
- **Bổ sung Quản trị Ủng hộ trên Admin CMS**:
  - Thêm tab "Ủng hộ & VietQR" trên giao diện Admin CMS (`/admin`) cho phép chỉnh sửa tài khoản ngân hàng và duyệt giao dịch trực tiếp.

## [0.2.1] - 2026-09-19
### Added
- **Đăng nhập Google 1 chạm (Google OAuth 2.0)**:
  - Tích hợp nút Đăng nhập Google nổi bật với logo chuẩn trên cả Web (`AuthScreen.tsx`) và Mobile (`AuthScreen.tsx`).
  - Endpoint Backend `POST /api/v1/auth/google`: Tự động xác thực tài khoản Google, trích xuất email, họ tên, avatar và lưu vào bảng `users`.
  - Tự động hợp nhất (merge) ngày giỗ, lịch cúng từ tài khoản khách vào tài khoản Google.
- **Gửi Email OTP thực tế qua dịch vụ Resend API**:
  - Tích hợp SDK `resend` và `dotenv` vào Backend (`server.ts`).
  - Thiết kế mẫu email HTML đậm phong vị Tết cổ truyền Lịch An Nhiên (màu đỏ truyền thống, khung OTP nổi bật, bảo mật cao).
  - Cấu hình file `backend/.env` và `backend/.env.example` với các biến môi trường `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `GOOGLE_CLIENT_ID`.
  - Tự động kích hoạt gửi email thực khi có API key, duy trì mã thử nghiệm phát triển `123456` khi chưa cấu hình.

## [0.2.0] - 2026-09-18
### Added
- **Quản lý Tài khoản Khách & Đăng nhập Email OTP**:
  - Tự động tạo tài khoản khách ngầm (`guest_xxx`) khi người dùng mở ứng dụng lần đầu, không hiển thị modal chặn màn hình.
  - Lưu trữ và phân tách các sự kiện, ngày giỗ, nhắc nhở theo từng tài khoản riêng biệt (`@reminders_${userId}`).
  - Hỗ trợ đăng nhập Email không mật khẩu qua mã xác thực 6 số OTP (tối ưu, hạn chế quên mật khẩu ở người cao tuổi).
  - Tùy chọn tự động gộp (merge) toàn bộ nhắc nhở từ tài khoản khách vào tài khoản email đã xác thực.
- **Màn hình Ủng hộ nhà phát triển (Donate Screen)**:
  - Thông điệp tri ân ấm áp nhằm duy trì ứng dụng miễn phí và không có quảng cáo.
  - 4 mức ủng hộ: Tách trà ấm (10.000đ), Ly cà phê (30.000đ), Món quà nhỏ (50.000đ), Tấm lòng vàng (100.000đ).
  - Tích hợp VietQR động tự động điền số tiền và nội dung chuyển khoản, kèm hỗ trợ ví MoMo và nút sao chép thông tin nhanh.
- **Chuyển đổi Icon Cài đặt thành Icon Profile trên Header**:
  - Thay icon bánh răng trên Header (`DailyOverviewScreen`) thành icon Người dùng (`User`) biểu thị tính chất tài khoản cá nhân.
- **Đồng nhất 100% giữa Webview & Mobile**:
  - Triển khai đồng thời cả trên `mobile/` (React Native Expo) và `web/` (React Web) với 12-13 màn hình hoàn chỉnh.

## [0.1.9] - 2026-09-18
### Fixed
- **Khắc phục lỗi "java.io.IOException: Failed to download remote update" trên Android/Expo Go**:
  - Tích hợp `@expo/ngrok` hỗ trợ chế độ Tunnel (`npm run dev:mobile:tunnel`), cho phép điện thoại tải bundle qua mạng Internet độc lập mà không bị chặn bởi AP/Client Isolation trên Wi-Fi nội bộ.
  - Cập nhật lệnh khởi động tự động dọn sạch cache Metro (`expo start -c`) ngăn chặn lỗi lệch hash delta cache.
  - Hướng dẫn chi tiết cách xóa cache lịch sử dự án trên Expo Go để nạp bundle mới nhất.

## [0.1.8] - 2026-09-18
### Changed & Enhanced
- **Đồng nhất 100% Giao diện Mobile theo chuẩn Webview**:
  - Tái cấu trúc ứng dụng Mobile thành kiến trúc module màn hình tách biệt hoàn chỉnh (`mobile/src/screens/*`, `mobile/src/components/*`).
  - Thay thế toàn bộ icon emoji thô sơ bằng icon vector chuẩn `lucide-react-native` tinh tế, sắc nét, đồng nhất với bản Web.
  - Triển khai đầy đủ 10 màn hình chuẩn bám sát `wireframe.png`:
    1. `SplashScreen.tsx`: Tranh con giáp Ất Tỵ 2025, câu chúc Tết truyền thống, thanh tiến trình tải.
    2. `DailyOverviewScreen.tsx`: Hai thẻ ngày to Dương (xanh ngọc) / Âm (đỏ), thẻ Đánh giá ngày hoàng đạo, Sự kiện trong ngày, Danh ngôn ấm áp và cụm 3 nút bấm lớn cho người cao tuổi.
    3. `DailyDetailScreen.tsx`: Thanh chuyển đổi Tổng quan / Chi tiết, 9 khối thông tin chuyên sâu (Dương, Âm, Can Chi, Tiết khí, Ngày tốt/xấu, Giờ hoàng đạo, Việc nên làm, Việc kiêng kỵ, Sự kiện).
    4. `MonthlyCalendarScreen.tsx`: Lưới lịch 7 cột chuẩn T2 -> CN, chấm màu chỉ thị (tốt/xấu/lễ/sự kiện), thẻ xem nhanh ngày chọn và nút Xem chi tiết.
    5. `RemindersScreen.tsx`: Bộ lọc Tất cả / Sắp tới / Đã hoàn thành, phân nhóm Sắp tới / Sau này, icon dạng khối màu pastel và checkbox lớn.
    6. `AddReminderScreen.tsx`: Bộ chọn ngày Dương/Âm/Cả hai, quy đổi âm lịch tức thì, lặp lại, offset báo trước, biểu tượng, ghi chú.
    7. `SettingsScreen.tsx`: Bộ cài đặt thông báo, chế độ lịch âm, giao diện, cỡ chữ người cao tuổi, ngôn ngữ và modal tương tác.
    8. `SearchScreen.tsx`: Tra cứu ngày, sự kiện, lễ tết với gợi ý tìm kiếm gần đây.
    9. `EventsListScreen.tsx`: Danh sách ngày lễ truyền thống & quốc tế với huy hiệu ngày đỏ rực rỡ.
    10. `EventDetailScreen.tsx`: Banner Đêm Hội Trăng Rằm minh họa mặt trăng và đèn lồng Phúc Lộc Thọ, ý nghĩa và hoạt động văn hóa.
  - Thanh điều hướng chân trang `BottomTabBar` với 3 tab chuẩn: Lịch ngày (`Calendar`), Lịch tháng (`CalendarDays`), Nhắc nhở (`Bell`).

## [0.1.7] - 2026-09-18

### Fixed
- **Lịch tháng (Monthly Calendar)**: Triển khai hoàn thiện lưới lịch 7 cột (T2 -> CN) chuẩn 100% Wireframe Màn hình 4, hiển thị đầy đủ số ngày Dương (to), ngày Âm (nhỏ, mùng 1/hôm rằm đỏ đậm), dấu chấm chỉ thị ngày Hoàng đạo/Hắc đạo/Sự kiện, chuyển tháng linh hoạt `<` `>` và thẻ tóm tắt chi tiết ngày được chọn kèm nút xem chi tiết.
- **Cài đặt (Settings Actions)**: Kích hoạt 100% tất cả các hành động trong cài đặt:
  - Thông báo: Bật/Tắt tức thì với Switch component và thông báo trạng thái.
  - Lịch âm: Modal tùy chọn hiển thị Đầy đủ / Cơ bản / Chỉ ngày âm kèm dấu tích chọn.
  - Giao diện: Modal chọn Sáng ấm / Sáng tiêu chuẩn / Tối dịu (thay đổi theme trực tiếp).
  - Cỡ chữ: Modal chọn Tiêu chuẩn / Lớn (Người cao tuổi) / Rất lớn (co giãn font toàn app).
  - Ngôn ngữ: Modal chọn Tiếng Việt / English.
  - Giới thiệu ứng dụng: Modal hiển thị thông tin phiên bản, bản quyền, thuật toán Hồ Ngọc Đức.
  - Nút khôi phục cài đặt mặc định: Đặt lại mọi cấu hình chuẩn ban đầu.

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
