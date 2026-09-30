# AGENTS.md — Quy tắc hoạt động của AI Agent cho dự án Lịch An Nhiên (Lịch Việt)

Tài liệu này là bộ quy tắc vận hành bắt buộc cho mọi AI Agent làm việc trên repository này.

---

## 1. NGUYÊN TẮC CỐT LÕI

> **Repository là nguồn thông tin chuẩn (Single Source of Truth) của project, không phải lịch sử hội thoại.**

- Người dùng không cần nhắc lại toàn bộ context hay master prompt trong mỗi phiên làm việc.
- Prompt của người dùng là **DELTA** (thay đổi, yêu cầu mới, bugfix).
- AI Agent có trách nhiệm tự đọc hiểu, duy trì và cập nhật kiến thức dự án trong repository.

---

## 2. NGUỒN THÔNG TIN CHUẨN (Thứ tự đọc trước khi code)

Trước khi thực hiện bất kỳ task đáng kể nào, Agent PHẢI đọc:
1. `AGENTS.md` (file này)
2. `tasks/current.md`
3. `docs/PRODUCT.md`
4. `docs/ARCHITECTURE.md`
5. `docs/UI_UX.md`
6. `docs/DECISIONS.md`
7. Source code liên quan

Tuyệt đối không chỉ phỏng đoán dựa trên bộ nhớ hội thoại tạm thời.

---

## 3. THỨ TỰ ƯU TIÊN REQUIREMENT KHI CÓ XUNG ĐỘT

1. Yêu cầu mới nhất của người dùng trong phiên hiện tại
2. `tasks/current.md`
3. Decision đang `ACTIVE` trong `docs/DECISIONS.md`
4. `docs/PRODUCT.md`
5. `docs/UI_UX.md`
6. `docs/ARCHITECTURE.md`
7. Implementation hiện tại trong source code
8. Requirement lịch sử trong `tasks/completed/` hoặc `docs/CHANGELOG.md`

Nếu phát hiện xung đột quan trọng, Agent không được âm thầm lựa chọn mà phải ghi nhận decision mới trong `docs/DECISIONS.md`.

---

## 4. TỰ ĐỘNG CẬP NHẬT TÀI LIỆU

Khi có thay đổi, Agent tự phân loại và cập nhật tài liệu tương ứng mà **không cần người dùng nhắc**:
- Yêu cầu sản phẩm/tính năng mới: cập nhật `docs/PRODUCT.md`
- Thay đổi kiến trúc kỹ thuật: cập nhật `docs/ARCHITECTURE.md`
- Thay đổi giao diện / trải nghiệm: cập nhật `docs/UI_UX.md`
- Thay đổi database / local storage: cập nhật `docs/DATABASE.md`
- Thay đổi endpoint / schema API: cập nhật `docs/API.md`
- Quyết định kỹ thuật / sản phẩm quan trọng: ghi decision mới vào `docs/DECISIONS.md`
- Tiến độ công việc: cập nhật `tasks/current.md`, `tasks/BACKLOG.md`, `tasks/completed/`
- Lịch sử phiên bản: cập nhật `docs/CHANGELOG.md`

Các file `docs/PRODUCT.md`, `ARCHITECTURE.md`, `UI_UX.md`, `DATABASE.md`, `API.md` chỉ chứa **CURRENT TRUTH** (trạng thái hiện tại). Trạng thái cũ được lưu trong `DECISIONS.md` và `CHANGELOG.md`.

---

## 5. QUY TRÌNH LÀM VIỆC (Workflow)

### Trước khi code:
1. Đọc tài liệu liên quan và kiểm tra wireframe (`wireframe.png`).
2. Kiểm tra Git status (không overwrite thay đổi chưa commit của user).
3. Đọc implementation hiện tại, hiểu pattern.
4. Cập nhật `tasks/current.md`.

### Khi code:
1. Dùng TypeScript, hạn chế `any`.
2. Tách biệt rõ ràng Business Logic (Domain) khỏi UI.
3. Không duplicate logic, tái sử dụng component.
4. UI phải 100% bám sát wireframe (`wireframe.png`), tối ưu đặc biệt cho **người cao tuổi** (chữ to, touch target >= 48px, tương phản cao, thao tác rõ ràng bằng button).
5. Tính toán Âm lịch và Can Chi phải nằm trong Calendar Domain riêng, không tính trực tiếp trong UI, có automated tests.

### Sau khi code:
1. Chạy format, lint và TypeScript check.
2. Chạy test suite (đặc biệt là test chuyển đổi Dương - Âm, Tiết khí, Hoàng đạo).
3. Kiểm tra build ứng dụng.
4. Cập nhật documentation & `tasks/current.md` / `tasks/completed/`.

---

## 6. QUY TẮC PHÁT TRIỂN & CÔNG NGHỆ

- **Triết lý**: Đơn giản – Nhẹ nhàng – Rõ ràng – Dễ sử dụng – Không over-engineer.
- **Mobile/Web**: React Native (Expo) + TypeScript + React Native Web.
- **Backend & CMS**: Node.js + Express + TypeScript + SQLite, kèm Admin CMS Web UI.
- **Offline First**: Lịch Dương, Lịch Âm, Can Chi, Giờ hoàng đạo và Nhắc nhở hoạt động hoàn toàn offline không phụ thuộc internet. Backend phục vụ dữ liệu sự kiện, câu chúc, cấu hình cập nhật từ xa.
