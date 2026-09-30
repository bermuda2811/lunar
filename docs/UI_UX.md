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
