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
- Giao diện web quản trị chuẩn:
  - Sidebar: Logo "Lịch Việt", Tổng quan, Quản lý sự kiện (Active), Quản lý nội dung, Quản lý người dùng, Thống kê, Cài đặt.
  - Bảng danh sách sự kiện:
    - Cột: Ngày, Tên sự kiện, Loại, Trạng thái (Badge "Hiển thị"), Thao tác (Sửa, Xóa).
    - Nút "+ Thêm sự kiện" đỏ nổi bật mở modal thêm/sửa sự kiện.
  - Quản lý câu chúc theo ngày, nội dung ý nghĩa văn hóa.
  - Thống kê lượt truy cập và nhắc nhở.
  - Cung cấp REST API cho mobile app cập nhật nội dung tức thì không cần phát hành lại ứng dụng.
