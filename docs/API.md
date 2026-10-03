# API.md — Đặc tả Giao diện Lập trình REST API

## 1. TỔNG QUAN

- **Base URL**: `http://localhost:4000/api/v1`
- **Định dạng dữ liệu**: `application/json`
- **Mã phản hồi chuẩn**:
  - `200 OK`: Thành công
  - `201 Created`: Tạo mới thành công
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `404 Not Found`: Không tìm thấy tài nguyên
  - `500 Internal Server Error`: Lỗi hệ thống

---

## 2. CÁC ENDPOINT CHO CLIENT APP

### 2.1. Lấy thông tin ngày tổng hợp
- **Endpoint**: `GET /calendar/day`
- **Query Parameters**:
  - `date`: Định dạng `YYYY-MM-DD` (Mặc định: ngày hiện tại)
- **Response**:
```json
{
  "success": true,
  "data": {
    "solar": {
      "day": 16,
      "month": 9,
      "year": 2026,
      "dayOfWeek": "Thứ Hai",
      "formatted": "16/9/2026"
    },
    "lunar": {
      "day": 6,
      "month": 8,
      "year": 2026,
      "yearName": "Bính Ngọ",
      "isLeap": false,
      "formatted": "06/08/Bính Ngọ"
    },
    "canChi": {
      "day": "Tân Mùi",
      "month": "Ất Dậu",
      "year": "Bính Ngọ"
    },
    "tietKhi": {
      "name": "Thu phân",
      "daysRemaining": 6
    },
    "rating": {
      "isGoodDay": true,
      "label": "Tốt - Ngày hoàng đạo",
      "suitableFor": ["Cưới hỏi", "xuất hành", "khai trương", "ký kết", "cầu tài"],
      "avoid": ["Động thổ", "sửa nhà (lưu ý tùy việc cụ thể)"]
    },
    "auspiciousHours": [
      { "canChi": "Tý", "time": "23h-1h" },
      { "canChi": "Sửu", "time": "1h-3h" },
      { "canChi": "Thìn", "time": "7h-9h" },
      { "canChi": "Tỵ", "time": "9h-11h" },
      { "canChi": "Mùi", "time": "13h-15h" },
      { "canChi": "Tuất", "time": "19h-21h" }
    ],
    "events": [
      { "id": 1, "title": "Ngày Quốc tế Bảo vệ Tầng Ozone", "category": "intl_holiday" },
      { "id": 2, "title": "Rằm tháng 8 (Tết Trung Thu)", "category": "lunar_tradition" }
    ],
    "quote": {
      "text": "Trung thu là tết của tình thân, là dịp để gia đình sum vầy."
    }
  }
}
```

### 2.2. Lấy danh sách sự kiện & ngày lễ
- **Endpoint**: `GET /events`
- **Query Parameters**:
  - `category`: `all` | `vn_holiday` | `intl_holiday` | `lunar_tradition`
  - `search`: Từ khóa tìm kiếm
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tết Dương lịch",
      "calendarType": "solar",
      "day": 1,
      "month": 1,
      "displayDate": "1/1",
      "category": "vn_holiday",
      "status": "active"
    },
    {
      "id": 3,
      "title": "Tết Trung Thu",
      "calendarType": "lunar",
      "day": 15,
      "month": 8,
      "displayDate": "15/8",
      "category": "lunar_tradition",
      "status": "active"
    }
  ]
}
```

### 2.3. Lấy chi tiết sự kiện
- **Endpoint**: `GET /events/:id`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Tết Trung Thu",
    "calendarType": "lunar",
    "day": 15,
    "month": 8,
    "lunarDateFormatted": "15 tháng 8 âm lịch",
    "meaning": "Tết Trung Thu là dịp để gia đình sum vầy, trẻ em được vui chơi, rước đèn, phá cỗ. Đây cũng là dịp thể hiện tình thân và truyền thống văn hóa tốt đẹp của dân tộc.",
    "traditions": "• Rước đèn ông sao, múa lân sư rồng\n• Phá cỗ trông trăng, ăn bánh nướng, bánh dẻo\n• Tặng quà và chúc phúc cho người thân",
    "imageUrl": "/assets/events/trung-thu.png"
  }
}
```

### 2.4. Xác thực & Tài khoản người dùng
- `POST /auth/guest`: Tạo tài khoản khách ẩn danh tự động khi mở app
- `POST /auth/google`: Đăng nhập & đồng bộ tài khoản Google (OAuth 2.0)
  - Body: `{ "token": "...", "credential": "...", "email": "user@gmail.com", "name": "Nguyen Van A", "guestId": "guest_123", "mergeGuestData": true }`
  - Response: `{ "success": true, "data": { "id": "user_g_xxx", "email": "user@gmail.com", "name": "...", "isGuest": false } }`
- `POST /auth/send-otp`: Gửi mã OTP 6 chữ số tới Email thật qua dịch vụ Resend API
  - Body: `{ "email": "user@example.com" }`
  - Response: `{ "success": true, "message": "...", "sentViaResend": true, "testOtpHint": "123456" }`
- `POST /auth/verify-otp`: Xác thực mã OTP và hợp nhất dữ liệu từ tài khoản khách
  - Body: `{ "email": "user@example.com", "otp": "123456", "guestId": "guest_123", "mergeGuestData": true }`
  - Response: `{ "success": true, "data": { "id": "user_xxx", "email": "user@example.com", "isGuest": false } }`

### 2.5. Đồng bộ Nhắc nhở theo Tài khoản
- `GET /user/reminders?userId=xxx`: Lấy danh sách nhắc nhở của tài khoản tương ứng
- `POST /user/reminders/sync`: Đồng bộ danh sách nhắc nhở từ thiết bị lên server
  - Body: `{ "userId": "user_xxx", "reminders": [...] }`

### 2.6. Thông tin Ủng hộ nhà phát triển & VietQR
- `GET /donation` hoặc `GET /donation/config`: Lấy cấu hình tài khoản ngân hàng, mã BIN, số tài khoản, MoMo, cú pháp mẫu, link VietQR động mặc định và `customQrUrl` (nếu có ảnh tải lên).
- `POST /donation/config`: (Admin) Cập nhật thông tin ngân hàng nhận tiền và mã QR.
- `POST /donation/upload-qr`: (Admin) Tải lên ảnh QR Code ủng hộ tùy chỉnh (hỗ trợ Base64 file ảnh PNG, JPG, WEBP tối đa 15MB, lưu trữ tại `/uploads/` và cập nhật `custom_qr_url`).
- `POST /donation/transactions`: Tạo giao dịch ủng hộ với mã thanh toán riêng biệt (`ANNHIEN_xxxxx`), tạo ảnh mã VietQR động NAPAS 247 đúng số tiền và cú pháp.
  - Body: `{ "amount": 50000, "senderName": "Cô Lan", "senderEmail": "lan@gmail.com", "message": "Chúc ứng dụng phát triển", "isAnonymous": false }`
  - Response: Trả về object transaction đầy đủ kèm `vietQrUrl` động.
- `GET /donation/transactions`: Lấy danh sách các lượt ủng hộ.
  - Query: `?publicOnly=true` (dành cho Bảng vàng tri ân người dùng), hoặc `?status=all` (dành cho quản trị Admin CMS).
- `PATCH /donation/transactions/:id/confirm`: Xác nhận giao dịch thành công (chuyển `status = 'completed'`) và tự động gửi thư tri ân cảm ơn qua Resend Email (nếu người dùng có để lại email).

---

## 3. CÁC ENDPOINT QUẢN TRỊ ADMIN CMS (AUTH & CRUD)

### 3.1. Xác thực Quản trị viên
- `POST /admin/login`: Đăng nhập quản trị viên CMS
  - Body: `{ "username": "admin", "password": "..." }`
  - Response: `{ "success": true, "data": { "token": "adm_...", "username": "admin", "role": "admin" } }`
- `GET /admin/me`: Xác thực phiên làm việc hiện tại của quản trị viên (yêu cầu header `Authorization: Bearer <token>`)
- `POST /admin/logout`: Hủy bỏ phiên làm việc và xóa token

### 3.2. Quản lý Dữ liệu Hệ thống (Yêu cầu Header Authorization Bearer)
- `POST /events`: Tạo sự kiện mới
- `PUT /events/:id`: Cập nhật sự kiện (Tên, ngày, loại, trạng thái Hiển thị/Ẩn, ý nghĩa)
- `DELETE /events/:id`: Xóa sự kiện
- `POST /donation/config`: Cập nhật cấu hình nhận tiền & mã VietQR
- `PATCH /donation/transactions/:id/confirm`: Duyệt giao dịch ủng hộ
- `GET /stats`: Thống kê tổng số sự kiện, sự kiện đang kích hoạt, thống kê theo danh mục
- `GET /quotes`: Danh sách câu chúc / danh ngôn
- `GET /config`: Lấy cấu hình hệ thống


