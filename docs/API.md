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

---

## 3. CÁC ENDPOINT QUẢN TRỊ ADMIN CMS (CRUD)

- `POST /events`: Tạo sự kiện mới
- `PUT /events/:id`: Cập nhật sự kiện (Tên, ngày, loại, trạng thái Hiển thị/Ẩn, ý nghĩa)
- `DELETE /events/:id`: Xóa sự kiện
- `GET /stats`: Thống kê tổng số sự kiện, sự kiện đang kích hoạt, thống kê theo danh mục
- `GET /quotes`: Danh sách câu chúc / danh ngôn
- `POST /quotes`: Thêm câu chúc mới
- `GET /config`: Lấy cấu hình hệ thống
- `PUT /config`: Cập nhật cấu hình
