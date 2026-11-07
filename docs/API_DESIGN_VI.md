# StayManager API Design

## 1. Tổng quan

- Base URL local: `http://localhost:5500`
- API prefix: `/api`
- Định dạng body: JSON (`Content-Type: application/json`)
- Xác thực quản trị/nhân viên: `Authorization: Bearer <token>`
- SePay webhook: `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`
- Múi giờ: gửi ngày theo `YYYY-MM-DD`; backend kiểm tra ngày lưu trú.
- API trả lỗi dạng JSON. Mỗi response có header `X-Request-Id` để tra log.

Tài liệu OpenAPI 3.1 đầy đủ ở `docs/openapi.json`. Có thể import file này vào Swagger Editor, Postman hoặc Insomnia.

## 2. Xác thực và phân quyền

1. Gọi `POST /api/auth/login` với `username`, `password`.
2. Lưu `token` trả về ở nơi an toàn.
3. Gửi token ở các API cần đăng nhập:
   `Authorization: Bearer <token>`.
4. Gọi `POST /api/logout` khi đăng xuất.
5. `GET /api/me` trả thông tin tài khoản hiện tại.

Các vai trò đang được dự án sử dụng: `admin`, `manager`, `receptionist`, `housekeeping`. Quyền chi tiết còn được áp dụng trong `roleGuard` và kiểm tra từng route. Tài liệu đánh dấu quyền ở mức định hướng; khi thay đổi phân quyền phải cập nhật đồng thời code và OpenAPI.

## 3. Danh mục endpoint hiện có

### Hệ thống và đăng nhập

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| GET | `/health` | Health check | Công khai |
| POST | `/api/auth/login` | Đăng nhập | Công khai |
| GET | `/api/me` | Tài khoản hiện tại | Bearer |
| POST | `/api/logout` | Đăng xuất | Bearer |

### Khách hàng và đặt phòng

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/public/rooms` | Phòng đang hiển thị | Công khai |
| GET | `/api/public/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD` | Tìm phòng trống | Công khai |
| POST | `/api/public/bookings` | Khách đặt phòng online | Công khai, rate limit |
| POST | `/api/public/bookings/lookup` | Tra cứu mã + điện thoại | Công khai, rate limit |
| POST | `/api/public/bookings/cancel` | Khách yêu cầu hủy | Công khai, rate limit |
| GET | `/api/bookings` | Danh sách booking | Bearer |
| POST | `/api/bookings` | Nhân viên tạo booking tại quầy | Bearer |
| POST | `/api/bookings/{id}/checkin` | Check-in | Bearer |
| POST | `/api/bookings/{id}/services` | Thêm dịch vụ | Bearer |
| POST | `/api/bookings/{id}/payment` | Ghi nhận thanh toán | Bearer |
| POST | `/api/bookings/{id}/checkout` | Check-out | Bearer |
| POST | `/api/bookings/{id}/cancel` | Nhân viên hủy booking | Bearer |
| POST | `/api/bookings/{id}/refund-status` | Cập nhật tiến trình hoàn tiền | Bearer, quản lý/admin |

### Phòng

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/rooms` | Danh sách phòng quản trị |
| POST | `/api/rooms` | Tạo phòng |
| PUT | `/api/rooms/{id}` | Cập nhật phòng |
| DELETE | `/api/rooms/{id}` | Xóa phòng; bị từ chối nếu có booking hoạt động |
| GET | `/api/rooms/available?checkIn=...&checkOut=...` | Phòng trống theo ngày |
| POST | `/api/rooms/{id}/housekeeping` | Cập nhật trạng thái vệ sinh |

### Khách hàng, dịch vụ và khuyến mãi

| Method | Endpoint | Mô tả |
|---|---|---|
| GET/POST/PUT | `/api/customers`, `/api/customers/{id}` | Quản lý khách hàng |
| GET/POST/PUT/DELETE | `/api/services`, `/api/services/{id}` | Quản lý dịch vụ |
| GET/POST/PUT/DELETE | `/api/promotions`, `/api/promotions/{id}` | Quản lý khuyến mãi |
| GET | `/api/public/promotions` | Khuyến mãi công khai |
| POST | `/api/public/promotions/validate` | Kiểm tra mã giảm giá |

### Thanh toán, đánh giá và báo cáo

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/payments/sepay-webhook` | Nhận giao dịch vào từ SePay |
| GET | `/api/public/reviews` | Đánh giá đã duyệt |
| POST | `/api/public/reviews` | Gửi đánh giá của khách đã checkout |
| GET | `/api/reviews` | Quản trị đánh giá |
| PATCH | `/api/reviews/{id}` | Duyệt/từ chối đánh giá |
| GET | `/api/stats` | Dashboard |
| GET | `/api/reports/bookings.csv?from=YYYY-MM-DD&to=YYYY-MM-DD` | Xuất báo cáo |
| GET | `/api/audit-logs` | Nhật ký thao tác |
| GET/PUT | `/api/settings` | Cấu hình khách sạn |
| GET/POST/PUT | `/api/users`, `/api/users/{id}` | Quản lý nhân viên |

## 4. Ví dụ request

### Đăng nhập

`POST /api/auth/login`

```json
{
  "username": "admin",
  "password": "YOUR_PASSWORD"
}
```

Response thành công:

```json
{
  "token": "OPAQUE_TOKEN",
  "user": {
    "id": "MONGODB_OBJECT_ID",
    "name": "Quản trị viên",
    "username": "admin",
    "role": "admin"
  }
}
```

### Tìm phòng trống

`GET /api/public/available?checkIn=2026-12-20&checkOut=2026-12-22`

### Khách đặt phòng

`POST /api/public/bookings`

```json
{
  "customerName": "Nguyễn Văn An",
  "customerPhone": "0901234567",
  "customerEmail": "an@example.com",
  "roomId": "MONGODB_ROOM_ID",
  "checkInDate": "2026-12-20",
  "checkOutDate": "2026-12-22",
  "guests": 2,
  "promoCode": "STAY10",
  "paymentMethod": "transfer"
}
```

Giá tiền phải được backend tính lại. Frontend không được gửi tổng tiền để backend tin theo.

### Gửi đánh giá

`POST /api/public/reviews`

```json
{
  "bookingCode": "BKAB4AC3",
  "customerPhone": "0901234567",
  "rating": 5,
  "title": "Kỳ nghỉ tuyệt vời",
  "comment": "Phòng sạch, nhân viên thân thiện và vị trí thuận tiện."
}
```

Tên khách đánh giá phải lấy từ booking đã xác minh ở backend, không nhận tên do trình duyệt tự gửi. Booking phải ở trạng thái `checked_out`; mỗi booking chỉ được đánh giá một lần; review mới ở trạng thái `pending`.

### SePay webhook

- URL: `POST /api/payments/sepay-webhook`
- Header: `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`
- Body tuân theo payload webhook SePay đã cấu hình.
- Chỉ giao dịch tiền vào (`transferType: in`), đúng tài khoản nhận và có mã booking hợp lệ mới được đối chiếu.
- Không dùng API key mẫu trong môi trường thật. Không ghi API key vào log hoặc đưa vào Git.

## 5. Quy ước lỗi và HTTP status

| Status | Ý nghĩa |
|---|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Dữ liệu sai hoặc không hợp lệ theo nghiệp vụ |
| 401 | Thiếu/sai token hoặc API key |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy tài nguyên/endpoint |
| 409 | Xung đột trạng thái, ví dụ đặt trùng phòng hoặc đánh giá trùng |
| 413 | Request body quá lớn |
| 429 | Gửi quá nhiều yêu cầu |
| 500 | Lỗi máy chủ |

Mẫu lỗi của middleware chung:

```json
{
  "error": "Đã xảy ra lỗi máy chủ.",
  "requestId": "UUID"
}
```

Một số route hiện hữu vẫn trả `{ "error": "..." }` theo cách cũ; `X-Request-Id` được thêm vào mọi response để hỗ trợ truy vết.

## 6. Quy tắc nghiệp vụ cần giữ

- `checkOutDate` phải sau `checkInDate`.
- Backend luôn kiểm tra phòng còn trống ngay trước khi tạo booking và dùng khóa phòng trong MongoDB.
- Không tin giá/tổng tiền gửi từ client; tính giá tại server.
- Thanh toán chỉ được ghi nhận theo giao dịch xác thực; webhook phải chống xử lý trùng bằng mã giao dịch.
- Hủy booking không đồng nghĩa đã hoàn tiền. Chỉ chuyển trạng thái `completed` sau khi tiền thực sự được hoàn.
- Đánh giá chỉ được tạo với booking đã checkout; tên lấy từ `Booking.customerName`.
- Các API quản trị phải có Bearer token và kiểm tra role ở server.

## 7. Các hạng mục nên nâng cấp tiếp trước production

Đây là các đề xuất thiết kế, không phải endpoint đã được triển khai trong bản này:

1. Idempotency-Key cho tạo booking và ghi nhận thanh toán.
2. Phân trang chuẩn (`page`, `limit`) cho booking, khách hàng, phòng và review.
3. Bộ lọc ngày, trạng thái, phòng và khách hàng.
4. Endpoint lấy chi tiết `GET /api/bookings/{id}` và cập nhật booking có kiểm tra lịch.
5. Tách transaction ledger cho mọi khoản thu/hoàn; không dùng `paidAmount` đơn lẻ làm sổ kế toán.
6. Rate limit dùng Redis/shared store khi chạy nhiều instance.
7. Tự động kiểm thử tích hợp với MongoDB và sandbox SePay.
8. Chuyển dần sang `/api/v1` khi có kế hoạch versioning; hiện giữ URL cũ để không làm hỏng frontend.

## 8. Chạy và xem tài liệu

- Chạy ứng dụng: `npm install` rồi `npm start`.
- Kiểm thử: `npm test`.
- OpenAPI: `docs/openapi.json`.
- Postman collection: `docs/StayManager.postman_collection.json`.
- Postman environment: `docs/StayManager.local.postman_environment.json`.
