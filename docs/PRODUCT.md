# PRODUCT.md — Tài liệu Yêu cầu Sản phẩm: Lịch An Nhiên (Lịch Việt)

## 1. TỔNG QUAN SẢN PHẨM

- **Tên ứng dụng**: Lịch An Nhiên (Lịch Việt)
- **Khẩu hiệu**: "Giữ truyền thống, gần gũi mỗi ngày!"
- **Mục tiêu**: Cung cấp ứng dụng xem Lịch Dương, Lịch Âm, thông tin ngày tốt xấu, giờ hoàng đạo, sự kiện lễ tết truyền thống và quản lý nhắc nhở cá nhân cho người Việt Nam.
- **Đối tượng trọng tâm**: Người dùng phổ thông tại Việt Nam, đặc biệt tối ưu cho **Người cao tuổi**.
- **Triết lý thiết kế**: Đơn giản – Nhẹ nhàng – Rõ ràng – Dễ sử dụng – Ấm cúng truyền thống. Không nhồi nhét thông tin, không bắt người dùng đoán thao tác.

---

## 2. PHÂN TÍCH WIREFRAME (100% Khớp Wireframe chuẩn)

Theo thiết kế chuẩn tại `wireframe.png`, ứng dụng gồm 11 màn hình/khu vực:

### 2.1. Màn hình Loading / Splash (Màn hình 1)
- Hiển thị linh vật/con giáp của năm âm lịch (ví dụ: Ất Tỵ 2025, Bính Ngọ 2026).
- Thông điệp chúc Tết: "An khang • Thịnh vượng", "Vạn sự như ý".
- Thanh tiến trình tải nhẹ nhàng: "Đang tải ứng dụng...".
- Tự động chuyển vào màn hình chính sau khi khởi tạo dữ liệu local.

### 2.2. Màn hình Xem ngày — Tổng quan (Màn hình 2)
- Thanh tiêu đề: Nút lùi/tiến ngày, Thứ và ngày tháng đầy đủ (ví dụ: "Thứ Hai, 16 tháng 9 năm 2026").
- **Hai khối thẻ ngày song song nổi bật**:
  - **Dương lịch** (Khối màu xanh lá trang nhã): Chữ "Dương lịch", số ngày siêu to (ví dụ: **16**), "Tháng 9 2026", "Thứ Hai".
  - **Âm lịch** (Khối màu đỏ gạch truyền thống ấm áp): Chữ "Âm lịch", số ngày siêu to (ví dụ: **6**), "Tháng 8 Năm Bính Ngọ", Can chi ngày/tháng/năm ("Ngày Tân Mùi, Tháng Ất Dậu, Năm Bính Ngọ").
- **Thẻ Đánh giá ngày**: Biểu tượng cỏ 4 lá may mắn, "Tốt / Ngày hoàng đạo", "Thích hợp: Cưới hỏi, xuất hành, khai trương, ký kết, cầu tài", "Kiêng kỵ: Động thổ, sửa nhà (lưu ý tùy việc cụ thể)".
- **Thẻ Sự kiện trong ngày**: Biểu tượng ngôi sao, hiển thị ngày lễ quốc tế và truyền thống (ví dụ: "Ngày Quốc tế Bảo vệ Tầng Ozone", "Rằm tháng 8 (Tết Trung Thu)").
- **Thẻ Danh ngôn / Lời chúc**: Biểu tượng trích dẫn, câu nói ấm áp (ví dụ: "Trung thu là tết của tình thân, là dịp để gia đình sum vầy.").
- **Điều hướng nhanh**: Cụm nút bấm lớn "← Ngày trước", "Hôm nay", "Ngày sau →" thân thiện với người lớn tuổi.
- **Bottom Navigation Bar**: 3 tab [Lịch ngày] (Active), [Lịch tháng], [Nhắc nhở].

### 2.3. Màn hình Xem ngày — Chi tiết (Màn hình 3)
- Thanh tiêu đề: Nút quay lại, ngày tóm tắt, icon tìm kiếm tra cứu.
- Bộ chuyển đổi chế độ xem: `[Tổng quan] [Chi tiết]` (Active tab: Chi tiết).
- Danh sách chi tiết chuyên sâu:
  1. Dương lịch: 16/9/2026 (Thứ Hai)
  2. Âm lịch: 6/8/Bính Ngọ
  3. Can Chi: Ngày Tân Mùi - Tháng Ất Dậu - Năm Bính Ngọ
  4. Tiết khí: Tên tiết khí hiện tại & đếm ngược tới tiết khí kế tiếp (ví dụ: "Thu phân (còn 6 ngày)")
  5. Ngày tốt/xấu: Tốt - Ngày hoàng đạo
  6. Giờ hoàng đạo: Liệt kê chi tiết các khung giờ hoàng đạo trong ngày (Tý, Sửu, Thìn, Tỵ, Mùi, Tuất) kèm giờ Dương lịch tương ứng (23-1h, 1-3h, 7-9h, 9-11h, 13-15h, 19-21h).
  7. Việc nên làm (Icon tích xanh): Cưới hỏi, xuất hành, khai trương, cầu tài, ký kết.
  8. Việc kiêng kỵ (Icon cấm đỏ): Động thổ, sửa nhà, tranh chấp.
  9. Sự kiện / Ngày lễ: Chi tiết các ngày kỷ niệm và lễ hội.

### 2.4. Màn hình Xem tháng (Màn hình 4)
- Header: Điều hướng tháng trước/tháng sau `< Tháng 9 năm 2026 >`, nút về "Hôm nay".
- Hàng thứ trong tuần: T2, T3, T4, T5, T6, T7, CN (Chủ nhật màu đỏ).
- Lưới ngày 7x6 chuẩn:
  - Hiển thị ngày Dương (số lớn ở trên) và ngày Âm (số nhỏ ở dưới, hiển thị ngày/tháng âm nếu là mùng 1 hoặc rằm e.g. 1/8, 15/8).
  - Điểm màu nhận diện ngày (Legend dots):
    - Chấm xanh lá: Ngày tốt / hoàng đạo.
    - Chấm đỏ sẫm/nâu: Ngày xấu / hắc đạo.
    - Chấm đỏ tươi: Sự kiện đặc biệt.
    - Chấm cam: Ngày lễ truyền thống / quốc gia.
  - Ngày đang chọn được đóng khung bo tròn đỏ nổi bật.
  - Ngày hôm nay có viền nhận diện riêng.
- Khối thông tin tóm tắt ngày đang chọn ở chân lịch:
  - "16 tháng 9 năm 2026" - Nút "Xem chi tiết >" dẫn thẳng tới Màn hình Chi tiết.
  - "6/8 năm Bính Ngọ".
  - Tóm tắt đánh giá: "Ngày tốt: Thích hợp: Cưới hỏi, xuất hành...".
- Chú thích điểm màu (Legend) rõ ràng ở đáy lịch.

### 2.5. Màn hình Danh sách Nhắc nhở (Màn hình 5)
- Header: "Nhắc nhở", nút "+" màu đỏ ở góc trên bên phải để tạo nhắc nhở mới.
- Thanh lọc trạng thái: `[Tất cả] [Sắp tới] [Đã hoàn thành]`.
- Phân nhóm rõ ràng theo thời gian:
  - Nhóm **Sắp tới**:
    - Sinh nhật Bà: Icon bánh sinh nhật, 17/9/2026 (7/8 âm lịch), Cả ngày, Checkbox đánh dấu.
    - Ngày giỗ Ông: Icon bát hương / đỉnh đồng, 25/9/2026 (15/8 âm lịch), Cả ngày, Checkbox.
    - Rằm tháng 8 (Tết Trung Thu): Icon đèn lồng / hoa sen, 25/9/2026 (15/8 âm lịch), Cả ngày.
    - Chuyến đi Đà Nẵng: Icon máy bay, 10/10/2026 (30/8 âm lịch), Cả ngày.
  - Nhóm **Sau này**:
    - Họp mặt gia đình: Icon gia đình, 2/10/2026 (22/8 âm lịch), 18:00.
- Cho phép toggle hoàn thành ngay bằng checkbox hoặc bấm vào để xem/sửa/xóa.

### 2.6. Màn hình Tạo / Sửa Nhắc nhở (Màn hình 6)
- Header: Nút back `<`, tiêu đề "Thêm nhắc nhở", nút "Lưu" đỏ nổi bật.
- Các trường nhập liệu:
  1. Tên nhắc nhở: Placeholder "Ví dụ: Ngày giỗ Ông".
  2. Ngày nhắc: 3 lựa chọn trực quan `[Ngày dương] [Ngày âm] [Cả hai]`.
  3. Chọn ngày: Bộ chọn ngày có hiển thị song song cả ngày Dương và quy đổi ngày Âm tương ứng.
  4. Lặp lại: Dropdown lựa chọn [Không lặp lại, Hàng ngày, Hàng tuần, Hàng tháng, Hàng năm].
  5. Thời gian: Lựa chọn [Cả ngày] hoặc chỉ định giờ phút cụ thể.
  6. Thời gian báo trước (Offset): [Đúng ngày, Trước 1 ngày, Trước 3 ngày, Trước 7 ngày].
  7. Biểu tượng (Icon selector): Bánh kem, Gia đình, Trái tim, Máy bay, Ngôi sao, Bát hương/Tâm linh, Chuông, Khác.
  8. Ghi chú (Tùy chọn): Ô nhập text nhiều dòng.

### 2.7. Màn hình Cài đặt (Màn hình 7)
- Thông báo: Bật/Tắt nhắc nhở hệ thống.
- Lịch âm: Tùy chọn cách hiển thị Âm lịch (Đầy đủ, Cơ bản, Chỉ ngày).
- Giao diện: Chế độ Sáng / Tối (Mặc định sáng ấm truyền thống).
- Cỡ chữ: Tiêu chuẩn / Lớn (phù hợp người cao tuổi) / Siêu lớn.
- Ngôn ngữ: Tiếng Việt (mặc định), Tiếng Anh.
- Giới thiệu ứng dụng & Phiên bản.

### 2.8. Màn hình Tìm kiếm Tra cứu (Màn hình 8)
- Ô tìm kiếm với icon kính lúp: "Tìm ngày, sự kiện, lễ tết...".
- Bộ lọc nhanh: `[Ngày] [Sự kiện] [Lễ tết]`.
- Danh sách gợi ý và tìm kiếm gần đây: Tết Nguyên Đán, Rằm tháng Giêng, Giỗ Tổ Hùng Vương, Ngày Thương binh Liệt sĩ, Quốc khánh 2/9.
- Kết quả tìm kiếm hiển thị dạng card trực quan, bấm vào mở ngay ngày tương ứng.

### 2.9. Màn hình Danh sách Sự kiện & Ngày lễ (Màn hình 9)
- Thanh lọc: `[Tất cả] [Lễ Việt Nam] [Quốc tế] [Âm lịch]`.
- Danh sách ngày lễ tiêu biểu trong năm kèm ngày tháng Dương/Âm.
- Bấm vào mở màn hình chi tiết sự kiện.

### 2.10. Màn hình Chi tiết Sự kiện (Màn hình 10)
- Header: Nút back `<`, Tên sự kiện (ví dụ: "Tết Trung Thu"), nút chia sẻ/lưu.
- Ảnh minh họa sống động, đậm chất văn hóa Việt Nam (Mặt trăng rằm, đèn ông sao, trẻ em vui hội).
- Hiển thị ngày diễn ra: "15 tháng 8 âm lịch (năm 2026: 25/9)".
- Mục Ý nghĩa: Giải thích nguồn gốc, ý nghĩa văn hóa truyền thống của ngày lễ.
- Mục Hoạt động truyền thống: Các phong tục tập quán gắn liền với ngày lễ.

### 2.11. Backend & Admin Web CMS (Màn hình 11)
- **Bảo mật truy cập**: Bắt buộc đăng nhập tài khoản quản trị viên (`admin` / `admin123`) mới có thể truy cập hệ thống. Hỗ trợ xác thực phiên qua Bearer token và nút đăng xuất an toàn.
- **Giao diện quản trị tinh gọn 100% có gắn link**:
  - Sidebar: Logo thương hiệu gắn link về trang chủ, Tab "Quản lý sự kiện", Tab "Ủng hộ & VietQR", Link mở ứng dụng Web Lịch (`localhost:3000`), Link kiểm tra sức khỏe REST API (`/health`), và Link xem dữ liệu JSON sự kiện.
  - Loại bỏ hoàn toàn các khối ghi chú tĩnh không có link từ wireframe và các menu không có chức năng thực tế.
  - Bảng danh sách sự kiện:
    - Cột: Ngày, Tên sự kiện, Loại, Trạng thái (Badge "Hiển thị"), Thao tác (Sửa, Xóa).
    - Bộ lọc danh mục & ô tìm kiếm sự kiện tức thì.
    - Nút "+ Thêm sự kiện" đỏ nổi bật mở modal thêm/sửa sự kiện.
  - Quản trị cấu hình nhận tiền VietQR động & duyệt danh sách ủng hộ.
  - Thẻ thống kê tương tác: Bấm vào thẻ để chuyển nhanh đến phần quản lý hoặc lọc dữ liệu tương ứng.
  - Cung cấp REST API bảo mật cho client app cập nhật nội dung tức thì không cần phát hành lại ứng dụng.

### 2.12. Quản lý Tài khoản, Đăng nhập Google & Resend Email OTP (Màn hình 12)
- **Tài khoản khách tự động (Seamless Guest Account)**: Khi cài đặt/mở ứng dụng lần đầu, tự động tạo tài khoản ngầm, người dùng sử dụng ngay lập tức mà không gặp bất kỳ popup bắt buộc đăng nhập nào.
- **Lưu trữ dữ liệu độc lập**: Các sự kiện, ngày giỗ, nhắc nhở cá nhân được lưu trữ riêng biệt theo từng tài khoản (`currentUser.id`).
- **Đăng nhập Google 1 chạm (Google Sign-In OAuth 2.0)**: Nút bấm to nổi bật ở vị trí ưu tiên số 1, cho phép người dùng đăng nhập tức thì chỉ với một chạm, tự động liên kết tên và email Google mà không cần gõ bàn phím (tối ưu tuyệt đối cho người cao tuổi).
- **Gửi mã OTP thật về Gmail qua Resend API**: Hỗ trợ gửi mã OTP 6 số xác thực thực tế vào hòm thư người dùng qua dịch vụ Resend chất lượng cao, kèm mẫu email thiệp đỏ phong cách truyền thống Lịch Việt.
- **Tự động đồng bộ & gộp dữ liệu**: Cho phép người dùng lựa chọn tự động gộp (merge) toàn bộ nhắc nhở từ tài khoản khách vào tài khoản email/Google mới đăng nhập, bảo toàn dữ liệu.
- **Icon Profile trên Header**: Thay đổi icon Cài đặt (bánh răng) trên thanh điều hướng chính thành icon Profile người dùng (`User`), dẫn vào màn hình Tài khoản & Cài đặt.

### 2.13. Màn hình Ủng hộ nhà phát triển (Màn hình 13)
- Thông điệp tri ân ấm áp: Giải thích lý do duy trì ứng dụng hoàn toàn miễn phí, không quảng cáo quấy rầy người cao tuổi.
- 4 hạng mức ủng hộ thân mật: Tách trà ấm (10.000đ), Ly cà phê (30.000đ), Món quà nhỏ (50.000đ), Tấm lòng vàng (100.000đ).
- Mã VietQR động (`img.vietqr.io`): Tự động điền số tiền và cú pháp chuyển khoản tương ứng khi quét qua các ứng dụng ngân hàng hoặc ví MoMo.
- Thao tác sao chép 1 chạm: Sao chép nhanh số tài khoản và cú pháp chuyển khoản có phản hồi thị giác trực quan.

### 2.14. Phiên bản Web Desktop Đa Cột & Tuyến Đường Mô Phỏng Mobile (/mobile-review)
- **Web Desktop Toàn Diện (`localhost:3000/`)**:
  - Giao diện thiết kế mở rộng dành cho máy tính cá nhân (PC/Laptop), vừa tối ưu cho màn hình lớn vừa co giãn mượt mà (responsive) trên trình duyệt điện thoại.
  - Bố cục 3 cột phong phú:
    1. *Tờ Lịch Xé Block Bàn*: Giữ nguyên vẻ đẹp tờ lịch treo tường truyền thống Việt Nam, số ngày to rõ (96px+), Âm lịch Bính Ngọ, Can Chi 4 trụ, Tiết khí, Đánh giá ngày và câu chúc an nhiên.
    2. *Chi tiết Phong thủy & 12 Giờ Hoàng Đạo*: Đánh dấu giờ hoàng đạo/hắc đạo thời gian thực theo đồng hồ máy tính, hướng xuất hành cát lành (Hỷ Thần, Tài Thần), việc nên làm và việc kiêng cữ.
    3. *Tiện ích đồng hành*: Lịch tháng mini bấm chọn ngày tức thì, danh sách ngày giỗ nhắc nhở cá nhân có checkbox hoàn thành, thẻ sự kiện lễ hội sắp tới.
  - Các Tab chức năng tiện ích: Tờ Lịch Hôm Nay, Lịch Tháng Toàn Cảnh, Bách Khoa Lễ Tết, Quản Lý Nhắc Nhở Cá Nhân, và Trang Ủng Hộ VietQR.
- **Tuyến Đường Mô Phỏng Mobile (`localhost:3000/mobile-review`)**:
  - Giữ nguyên khung mô phỏng điện thoại di động (Phone Frame) cùng bộ chọn 13 màn hình chuẩn Wireframe để người dùng kiểm thử và theo dõi trải nghiệm di động.
  - Nút chuyển đổi nhanh hai chiều giữa Web Desktop và Mobile Review không cần tải lại trang.

### 2.15. Tinh Gọn Header & Phân Bố Tính Năng Theo Ngữ Cảnh Tự Nhiên
- **Header 1 Hàng Ngang Duy Nhất (Single-Line 56px)**: Thanh thoát, tối ưu không gian hiển thị, không bị tràn dòng trên mọi độ phân giải.
- **Widget Chuyển Ngày Tích Hợp (Unified Date Stepper)**: Bỏ nút "Hôm nay" riêng lẻ; nút nhảy về hôm nay được đưa trực tiếp vào trong widget chuyển ngày, tự động ẩn/hiện thông minh khi người dùng xem ngày khác.
- **Tìm Kiếm Sự Kiện Tích Hợp Vào Tab Lễ Tết**: Chuyển ô tìm kiếm và bộ lọc danh mục trực tiếp vào đầu tab "Lễ Tết & Sự Kiện", xóa bỏ nút tìm kiếm rời rạc trên Header.
- **Công Cụ Đổi Ngày Âm – Dương Trong Menu Tài Khoản**: Chuyển bộ chuyển đổi thiên văn Hồ Ngọc Đức vào modal/menu Tài khoản (`accountModalTab`), giữ thanh Navigation chính và Bottom Bar tinh gọn chuẩn 5 tabs.

### 2.16. Tối Ưu Hóa SEO Toàn Diện Cho Domain Chính Thức (lichannhien.com)
- **Tên miền chính thức**: `https://lichannhien.com/`.
- **Mục tiêu xếp hạng Top Search**:
  - Tối ưu hóa toàn diện cho các từ khóa tìm kiếm cốt lõi của người dùng: *"lịch", "lịch âm dương", "xem ngày", "xem ngày âm dương", "ngày hôm nay", "lịch hôm nay", "hôm nay ngày mấy", "hôm nay là bao nhiêu âm lịch"*.
  - Các cụm từ tìm kiếm phụ trợ: *"giờ hoàng đạo hôm nay", "xem ngày tốt xấu", "đổi ngày âm dương", "lịch việt nam", "lịch vạn niên 2026", "tiết khí", "bính ngọ 2026"*.
- **Cấu trúc On-page & Semantic SEO**:
  - Thẻ `<h1>` duy nhất ngữ nghĩa: "Lịch An Nhiên — Lịch Âm Dương, Lịch Vạn Niên & Xem Ngày Tốt Xấu".
  - **SEO Quick Answer Banner**: Trực diện trả lời câu hỏi tìm kiếm số 1 ngay đầu trang: *"Hôm nay ngày mấy? Thứ X, dd/mm/yyyy • Hôm nay là bao nhiêu âm lịch? Ngày dd/mm (Can Chi)"*.
  - **SEO Knowledge Hub & FAQ Accordion**: 4 khối hỏi đáp chuẩn ngữ nghĩa giải quyết toàn bộ thắc mắc phổ biến về lịch âm dương, giờ hoàng đạo, đổi ngày và ngày tốt xấu.
  - **Dynamic SEO Headings & Title**: React hook cập nhật `document.title` và `meta description` theo thời gian thực tương ứng với từng ngày và tab người dùng đang xem.
- **Technical SEO & Rich Snippets**:
  - `robots.txt`: Cho phép bot crawl toàn bộ trang chính, chặn `/admin`, `/api/`, `/mobile-review`, trỏ sitemap chuẩn `https://lichannhien.com/sitemap.xml`.
  - `sitemap.xml`: XML sitemap chuẩn chỉ mục hóa toàn bộ các trang và chức năng chính.
  - `manifest.json`: Web App Manifest phục vụ Google PWA indexing và cài đặt màn hình chính.
  - Ảnh OpenGraph & Twitter Card chuẩn 1200x630 px (`og-image.png`).
  - **3 Schema.org JSON-LD**: `WebSite` (Sitelinks Searchbox), `WebApplication` (Rating 4.9⭐, Free), `FAQPage` (5 câu hỏi đáp phổ biến đạt Rich Snippets mở rộng trên kết quả tìm kiếm Google).




