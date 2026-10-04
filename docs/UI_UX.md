# UI_UX.md — Hướng dẫn Thiết kế UI/UX Lịch An Nhiên (Lịch Việt)

## 1. TRIẾT LÝ VÀ PHONG CÁCH CHỦ ĐẠO

- **Cảm hứng**: Tết truyền thống, tranh Đông Hồ, màu đỏ may mắn, màu xanh ngọc thanh bình, giấy dó, phong vị Việt Nam nhẹ nhàng ấm cúng.
- **Tôn chỉ**: "Đơn giản – Nhẹ nhàng – Rõ ràng – Dễ sử dụng – Phù hợp cho người cao tuổi".
- **Không gây quá tải thị giác**: Không dùng màu neon, không gradient chói, không hoạt họa (animation) rườm rà gây chóng mặt.

---

## 2. BẢNG MÀU THIẾT KẾ (Color Palette)

| Mã màu | Tên | Công dụng |
|---|---|---|
| `#8B1D1D` / `#B3261E` | Đỏ truyền thống (Heritage Red) | Màu chủ đạo (Primary Accent), Lịch Âm, Tab active, Nút chính |
| `#0F5132` / `#198754` | Xanh ngọc (Heritage Green) | Màu Dương lịch, Ngày tốt, Huy hiệu thành công |
| `#FFFBF5` / `#FDF8F0` | Giấy ấm (Warm Cream) | Nền chính toàn ứng dụng, dịu mắt hơn màu trắng tinh |
| `#FFFFFF` | Trắng tinh | Nền các thẻ Card nổi |
| `#1C1C1E` / `#212529` | Đen than (Charcoal) | Chữ chính, tương phản cao (High Contrast) đạt chuẩn WCAG AAA |
| `#6C757D` / `#495057` | Xám đậm (Slate Gray) | Chữ phụ, ghi chú (vẫn đảm bảo độ tương phản > 4.5:1) |
| `#F8D7DA` / `#DC3545` | Đỏ cảnh báo | Việc kiêng kỵ, ngày xấu, nút xóa |
| `#FFF3CD` / `#D39E00` | Vàng đồng / Cam | Ngày lễ, sự kiện văn hóa, ngôi sao |

---

## 3. TYPOGRAPHY & KHẢ NĂNG TIẾP CẬN (Accessibility)

### 3.1. Phù hợp cho Người cao tuổi
- Kích thước số ngày Dương/Âm trên màn hình xem ngày: **54px – 64px, Extra Bold**.
- Tiêu đề màn hình & Tên thứ: **22px – 26px, Bold**.
- Nội dung đọc chính (Body Text): **>= 18px**, line-height: **1.5 – 1.6** thoáng đãng.
- Hỗ trợ chế độ phóng to chữ trong cài đặt (Tiêu chuẩn / Lớn / Rất lớn).

### 3.2. Vùng bấm cảm ứng (Touch Target)
- Tất cả các nút bấm, icon bấm được, hàng danh sách đều có kích thước tối thiểu **48x48 dp**.
- Khoảng cách giữa các nút bấm tối thiểu **12px – 16px**, chống bấm nhầm.
- Không dùng icon đơn độc mà luôn có nhãn chữ (Text Label) đi kèm rõ ràng.

### 3.3. Tương tác rõ ràng
- Người cao tuổi quen với nút bấm vật lý: Cung cấp nút `[← Ngày trước]`, `[Hôm nay]`, `[Ngày sau →]` to rõ, không bắt buộc vuốt vuốt màn hình.
- Phản hồi rung nhẹ (Haptic Feedback) hoặc chuyển trạng thái hiển thị rõ rệt khi bấm.
- Tránh modal ẩn, gesture phức tạp, hoặc menu ba chấm khó tìm.

---

## 4. QUY CHUẨN THÀNH PHẦN (Design Components)

### 4.1. Thẻ ngày Dương & Âm (Màn hình 2 Wireframe)
- Đặt cạnh nhau theo tỷ lệ 1:1, góc bo `border-radius: 16px`.
- Thẻ Dương lịch có nền xanh nhạt `#E8F5E9`, viền `#C8E6C9`, chữ số màu `#0F5132`.
- Thẻ Âm lịch có nền hồng đỏ nhạt `#FFEBEE`, viền `#FFCDD2`, chữ số màu `#B3261E`.

### 4.2. Ô lịch tháng (Màn hình 4 Wireframe)
- Chiều cao ô thoải mái, số ngày Dương to nằm trên, số ngày Âm nhỏ nằm dưới.
- Ngày được chọn: Nền đỏ bo tròn `#B3261E`, chữ trắng nổi bật.
- Chấm tròn chỉ thị (Dots): Xanh (Ngày tốt), Nâu đỏ (Ngày xấu), Đỏ (Sự kiện), Cam (Ngày lễ).

### 4.3. Thẻ Nhắc nhở (Màn hình 5 Wireframe)
- Nền trắng, đổ bóng nhẹ mềm mại `rgba(0,0,0,0.05)`.
- Icon minh họa trong vòng tròn màu pastel tương ứng (Bánh sinh nhật màu đỏ, Bát hương màu nâu đỏ, v.v.).
- Checkbox kích thước lớn 24x24px, dễ dàng bấm chọn.

### 4.4. Nút Profile trên Header & Thẻ Tài khoản (Màn hình 2 & 7)
- Biểu tượng Header: Sử dụng icon Người dùng (`User`) thân thiện thay thế cho icon bánh răng cơ khí để biểu thị tính chất tài khoản cá nhân.
- Thẻ Tài khoản: Hiển thị avatar tròn (ký tự chữ cái đầu của email màu đỏ hoặc icon khách màu xám), email/trạng thái lưu trữ, và nút chuyển sang đăng nhập email hoặc đăng xuất rõ ràng.

### 4.5. Thẻ & Màn hình Ủng hộ nhà phát triển (Màn hình 7 & 13)
- Bố cục thẻ đơn căn giữa thanh lịch (`max-w-xl`), viền bo tròn mềm mại, nền thẻ sáng sạch sẽ, màu nhấn đỏ thương hiệu `#B3261E`.
- Loại bỏ hoàn toàn các trường form nhập liệu phức tạp (chọn mức tiền, họ tên, email, lời nhắn) để tối giản hóa trải nghiệm người dùng.
- Khung mã QR chuyển khoản nổi bật ở trung tâm (kích thước chuẩn 260px - 280px, viền bo tròn góc), ưu tiên hiển thị ảnh chụp QR từ Admin CMS hoặc VietQR tự động (cho phép chuyển khoản tùy tâm).
- Cụm thông tin chuyển khoản ngân hàng rõ ràng: Tên ngân hàng, Chủ tài khoản (in hoa), Số tài khoản (font mono to rõ), nút "Sao chép" kèm phản hồi trực quan (chuyển sang icon tích xanh và chữ "Đã chép"), cùng thông tin ví điện tử MoMo nếu có.

### 4.6. Đồng nhất 100% trải nghiệm Webview & Mobile
- Toàn bộ bố cục, hệ màu, kích thước font chữ, khoảng cách padding/margin và các tương tác chạm được thiết kế đồng nhất 1:1 giữa bản Native (React Native Expo) và bản Web (React Web).

### 4.7. Giao diện Web Desktop Đa Cột & Chế Độ Xem Trước Mobile (Mobile Review)
- **Giao diện Web Desktop (`/`)**:
  - Bố cục lưới đa cột tối ưu cho màn hình máy tính (PC, Laptop, Màn hình rộng) nhưng co giãn mượt mà (responsive) khi truy cập bằng trình duyệt di động.
  - Cột 1 (Tờ lịch xé block bàn): Giữ nguyên phong vị tờ lịch treo tường truyền thống Việt Nam, số ngày Dương to rõ (96px+), khối Âm lịch Bính Ngọ nổi bật, Can Chi 4 trụ, Tiết khí và lời chúc an nhiên.
  - Cột 2 (Chi tiết Phong thủy & Giờ Hoàng Đạo): Lưới 12 giờ Can Chi thời gian thực (đánh dấu giờ hiện tại), hướng xuất hành cát lành (Hỷ Thần, Tài Thần), danh sách việc nên làm và kiêng cữ.
  - Cột 3 (Tiện ích đồng hành): Lịch tháng mini bấm chọn ngày tức thì, danh sách ngày giỗ nhắc nhở cá nhân, banner sự kiện lễ hội sắp tới.
  - Hệ thống Tab tiện ích toàn diện: Tờ Lịch Hôm Nay, Lịch Tháng Toàn Cảnh, Bách Khoa Lễ Tết, Đổi Ngày Âm Dương Chuẩn Thiên Văn, Quản Lý Nhắc Nhở, và Trang Ủng Hộ VietQR.
### 4.8. Quy Chuẩn Header Tinh Gọn 1 Dòng (Single-Line 56px Header)
- **Chiều cao chuẩn mực**: Cố định `56px` (`h-14`), mỏng nhẹ, thanh thoát, không chiếm dụng diện tích dọc của trang.
- **Thương hiệu 1 hàng ngang**: Khối logo đỏ `[L]` + Tên thương hiệu `LỊCH AN NHIÊN` + Huy hiệu `Bính Ngọ 2026` trên cùng 1 hàng, loại bỏ slogan phụ gây 2 dòng.
- **Thanh Navigation 5 Tab Vàng**: Bố trí chính giữa trang, container dạng viên thuốc `bg-slate-100/90`, chỉ gồm 5 tab cốt lõi: `[Hôm Nay] [Lịch Tháng] [Lễ Tết] [Nhắc Nhở] [Ủng Hộ]`.
- **Cụm ngày chuyển đổi tích hợp**: Tích hợp nút nhảy về "Hôm nay" trực tiếp vào trong Widget chuyển ngày `[ < ] [ dd/mm/yyyy • Hôm nay ] [ > ]`, không để nút "Hôm nay" rời rạc bên ngoài.
- **Loại bỏ nút tìm kiếm rời rạc trên Header**: Chức năng tìm kiếm và tra cứu được đưa trực tiếp vào đầu tab "Lễ Tết & Sự Kiện".

### 4.9. Tối Ưu Phân Khối Tính Năng Theo Ngữ Cảnh Sử Dụng (Contextual Feature Placement)
1. **Widget Chuyển Ngày Thống Nhất (Unified Date Stepper)**:
   - Áp dụng trên cả Desktop Header, Mobile Quick Stepper và chân thẻ lịch xé.
   - Khi đang ở ngày hôm nay: Hiển thị badge xanh `Hôm nay`.
   - Khi đang xem ngày khác: Hiển thị nút bấm `Hôm nay` dạng chip nổi bật, bấm 1 chạm quay về ngày hiện tại.
2. **Tìm Kiếm & Bộ Lọc Sự Kiện Trong Tab Lễ Tết**:
   - Ô tìm kiếm nổi bật với icon kính lúp và nút xóa nhanh (Clear input).
   - Bộ lọc danh mục trực quan: Tất Cả, Lễ Hội Truyền Thống, Quốc Lễ Việt Nam, Lễ Quốc Tế, Tri Ân & Văn Hóa.
   - Hiển thị số lượng kết quả tức thời và trạng thái rỗng thân thiện (Empty state).
3. **Công Cụ Đổi Ngày Âm – Dương Trong Menu Tài Khoản**:
   - Tách biệt thanh điều hướng chính (giữ 5 tabs sạch sẽ) khỏi công cụ tiện ích.
   - Modal Tài khoản tích hợp 2 sub-tabs: `[ 👤 Tài Khoản ]` và `[ 🔄 Đổi Ngày Âm – Dương ]`.
   - Cung cấp nút chuyển đổi 2 chiều chuẩn thiên văn (Hồ Ngọc Đức) và nút "Xem tờ lịch ngày này" để đóng modal và nhảy ngay đến ngày đã tra cứu.



