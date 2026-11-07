# StayManager — API Design chi tiết

**Phiên bản tài liệu:** 1.1  
**Ứng dụng:** StayManager  
**Backend:** Node.js + Express  
**Database:** MongoDB + Mongoose  
**API base URL local:** `http://localhost:5500`  
**API prefix:** `/api`

> Tài liệu này được đối chiếu với `server.js` và các model trong dự án. Mục “Đang có” là route đã được tìm thấy trong mã nguồn. Mục “Đề xuất” là hướng mở rộng, chưa được coi là đã triển khai.

---

# 1. Kiến trúc tổng thể

```text
Khách hàng / Nhân viên / Quản lý
              |
              v
       Frontend (public/)
              |
              v
        Express REST API
              |
      +-------+--------+
      |       |        |
      v       v        v
 Authentication  Validation  Rate limit
      |       |        |
      +-------+--------+
              |
       Business logic
              |
      +-------+---------+
      |       |         |
      v       v         v
   MongoDB  SePay     Resend
  (Mongoose) Webhook   Email
```

## Nguyên tắc thiết kế

1. Frontend không được tự quyết định giá phòng, giảm giá, tổng tiền hoặc trạng thái thanh toán.
2. Backend xác minh mọi dữ liệu quan trọng trước khi ghi MongoDB.
3. API quản trị cần token đăng nhập và kiểm tra vai trò tại backend.
4. Booking chỉ được tạo khi ngày hợp lệ và phòng còn trống.
5. Webhook thanh toán phải xác minh API key, đúng tài khoản nhận và chống ghi nhận giao dịch trùng.
6. Đánh giá lấy tên khách từ booking đã xác minh, không lấy tên tùy ý do trình duyệt gửi.
7. Không trả password hash, salt, token nhân viên hoặc API key ra frontend.
8. Không lưu thông tin bí mật trong Git hoặc file ZIP phát hành.

## Quy ước chung

| Thuộc tính | Quy ước |
|---|---|
| Body | JSON |
| Header body | `Content-Type: application/json` |
| Ngày | `YYYY-MM-DD` |
| Tiền | Số nguyên VND |
| ID | MongoDB ObjectId dạng chuỗi |
| Xác thực quản trị | `Authorization: Bearer <token>` |
| Xác thực webhook | `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>` |
| Request trace | `X-Request-Id` |
| API prefix | `/api` |

---

# 2. Vai trò và phân quyền

Các role hiện có trong `model/User.js`:

| Role | Ý nghĩa | Quyền tổng quan |
|---|---|---|
| `admin` | Quản trị viên | Toàn quyền |
| `manager` | Quản lý | Vận hành, phòng, dịch vụ, khuyến mãi, báo cáo |
| `receptionist` | Lễ tân | Booking, check-in/out, khách hàng và thanh toán |
| `housekeeping` | Buồng phòng | Xem phòng và cập nhật trạng thái vệ sinh |

## Luồng đăng nhập

### `POST /api/auth/login` — Đang có

Request:

```json
{
  "username": "admin",
  "password": "YOUR_ADMIN_PASSWORD"
}
```

Response thành công:

```json
{
  "token": "TOKEN_DO_SERVER_CAP",
  "user": {
    "id": "MONGODB_USER_ID",
    "name": "Quản trị viên",
    "username": "admin",
    "role": "admin"
  }
}
```

Các bước xử lý:
1. Chuẩn hóa username về chữ thường.
2. Tìm tài khoản đang hoạt động.
3. So sánh password với password hash và salt.
4. Tạo token ngẫu nhiên và lưu token cho user.
5. Trả token và thông tin không nhạy cảm của user.

Giới hạn hiện có: 10 lần đăng nhập trong 15 phút theo IP/path.

Lỗi:
- `401`: sai tài khoản hoặc mật khẩu.
- `429`: vượt giới hạn đăng nhập.

### `GET /api/me` — Đang có

Header:

```http
Authorization: Bearer YOUR_TOKEN
```

Trả về thông tin tài khoản đang đăng nhập.

### `POST /api/logout` — Đang có

Header Bearer như trên. Server vô hiệu hóa token hiện tại.

## Ma trận quyền tóm tắt

| Nhóm chức năng | Admin | Manager | Receptionist | Housekeeping |
|---|---:|---:|---:|---:|
| Đăng nhập / đăng xuất | Có | Có | Có | Có |
| Xem phòng | Có | Có | Có | Có |
| Tạo/sửa phòng | Có | Có | Không | Không |
| Xóa phòng | Có | Không | Không | Không |
| Cập nhật vệ sinh | Có | Theo quyền route | Không | Có |
| Xem booking | Có | Có | Có | Không |
| Tạo booking tại quầy | Có | Có | Có | Không |
| Check-in / check-out | Có | Có | Có | Không |
| Xem khách hàng | Có | Có | Có | Không |
| Sửa khách hàng | Có | Có | Theo route hiện hành | Không |
| Sửa dịch vụ | Có | Có | Không | Không |
| Sửa khuyến mãi | Có | Có | Không | Không |
| Quản lý nhân viên | Có | Không | Không | Không |
| Cập nhật hoàn tiền | Có | Có | Không | Không |
| Cập nhật cài đặt | Có | Không | Không | Không |
| Xem dashboard | Có | Có | Có theo route | Không |

> Quyền cụ thể được quyết định bởi `auth` và `roleGuard` trong `server.js`. Hãy kiểm tra lại guard trước khi bổ sung route mới. Không nên dựa vào việc ẩn nút ở frontend làm cơ chế bảo mật.

---

# 3. Phòng — Rooms

## Model `Room`

| Field | Kiểu | Bắt buộc | Ý nghĩa |
|---|---|---:|---|
| `roomNumber` | String | Có | Số/tên phòng, duy nhất |
| `type` | String | Có | Loại phòng |
| `price` | Number | Có | Giá cơ bản mỗi đêm |
| `capacity` | Number | Không | Sức chứa, mặc định 2 |
| `floor` | Number | Không | Tầng |
| `amenities` | String[] | Không | Danh sách tiện nghi |
| `status` | Enum | Không | `available`, `cleaning`, `maintenance` |
| `isAvailable` | Boolean | Không | Cờ hiển thị/tình trạng |
| `notes` | String | Không | Ghi chú |
| `createdAt` | Date | Tự động | Ngày tạo |
| `updatedAt` | Date | Tự động | Ngày cập nhật |

## Endpoint đang có

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| `GET` | `/api/public/rooms` | Public | Danh sách phòng công khai |
| `GET` | `/api/public/available` | Public | Tìm phòng trống theo ngày |
| `GET` | `/api/rooms` | Bearer | Danh sách quản trị |
| `POST` | `/api/rooms` | Admin/Manager | Tạo phòng |
| `PUT` | `/api/rooms/:id` | Admin/Manager | Cập nhật phòng |
| `DELETE` | `/api/rooms/:id` | Admin | Xóa phòng |
| `GET` | `/api/rooms/available` | Bearer | Tìm phòng trống nội bộ |
| `POST` | `/api/rooms/:id/housekeeping` | Housekeeping và role được phép | Cập nhật vệ sinh |

### Tạo phòng — `POST /api/rooms`

Ví dụ payload theo model:

```json
{
  "roomNumber": "201",
  "type": "Deluxe Double",
  "price": 850000,
  "capacity": 2,
  "floor": 2,
  "amenities": ["Wi-Fi", "Điều hòa", "TV", "Minibar"],
  "status": "available",
  "isAvailable": true,
  "notes": ""
}
```

Kiểm tra backend cần thực hiện:
- `roomNumber` không được trùng.
- `price >= 0`.
- `capacity >= 1`.
- `status` chỉ nhận enum đã định nghĩa.
- Không cho client truyền `bookingLockToken` hoặc `bookingLockUntil`.

### Cập nhật phòng — `PUT /api/rooms/:id`

Payload tương tự tạo phòng nhưng chỉ chứa field cần cập nhật theo logic hiện tại. Nên validate ObjectId trước khi truy vấn.

### Xóa phòng — `DELETE /api/rooms/:id`

Không xóa phòng có booking đang hoạt động. Đề xuất production: chuyển `isAvailable=false` hoặc thêm `archivedAt` để giữ lịch sử thay vì xóa cứng.

### Tìm phòng trống

`GET /api/public/available?checkIn=2026-12-20&checkOut=2026-12-22`

Quy tắc:
- Ngày checkout phải sau ngày checkin.
- Không tính phòng bảo trì hoặc không được phép bán.
- Kiểm tra giao nhau của khoảng ngày booking.
- Kiểm tra lại availability ở thời điểm tạo booking, không tin kết quả tìm kiếm cũ.

---

# 4. Đặt phòng — Bookings

## Model `Booking`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `bookingCode` | String | Mã đặt phòng duy nhất |
| `customerName` | String | Họ tên khách |
| `customerPhone` | String | Điện thoại khách |
| `customerEmail` | String | Email khách |
| `customerId` | ObjectId | Liên kết Customer |
| `roomId` | ObjectId | Liên kết Room |
| `checkInDate` | Date | Ngày nhận phòng dự kiến |
| `checkOutDate` | Date | Ngày trả phòng dự kiến |
| `actualCheckIn` | Date | Thời điểm nhận thực tế |
| `actualCheckOut` | Date | Thời điểm trả thực tế |
| `guests` | Number | Số khách |
| `roomAmount` | Number | Tiền phòng |
| `serviceItems` | Array | Dịch vụ đã dùng |
| `serviceAmount` | Number | Tổng tiền dịch vụ |
| `discount` | Number | Số tiền giảm |
| `totalAmount` | Number | Tổng tiền cần thanh toán |
| `deposit` | Number | Tiền cọc |
| `paidAmount` | Number | Tiền đã nhận |
| `paymentMethod` | Enum | cash, transfer, card, other |
| `paymentStatus` | Enum | unpaid, pending, paid, refunded, partially_refunded |
| `status` | Enum | confirmed, checked_in, checked_out, cancelled |
| `refundAmount` | Number | Số tiền hoàn |
| `refundStatus` | Enum | not_applicable, pending, processing, completed, rejected |
| `promoCode` | String | Mã khuyến mãi |
| `notes` | String | Ghi chú |

## Endpoint đang có

| Method | Endpoint | Quyền |
|---|---|---|
| `POST` | `/api/public/bookings` | Public |
| `POST` | `/api/public/bookings/lookup` | Public |
| `POST` | `/api/public/bookings/cancel` | Public |
| `GET` | `/api/bookings` | Bearer, role vận hành |
| `POST` | `/api/bookings` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/checkin` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/services` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/payment` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/checkout` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/cancel` | Bearer, role vận hành |
| `POST` | `/api/bookings/:id/refund-status` | Admin/Manager |

### Khách đặt phòng online

`POST /api/public/bookings`

Ví dụ:

```json
{
  "customerName": "Nguyễn Văn An",
  "customerPhone": "0901234567",
  "customerEmail": "an@example.com",
  "roomId": "ROOM_OBJECT_ID",
  "checkInDate": "2026-12-20",
  "checkOutDate": "2026-12-22",
  "guests": 2,
  "promoCode": "STAY10",
  "paymentMethod": "transfer"
}
```

Luồng backend:
1. Validate tên, điện thoại, email nếu có.
2. Validate ngày lưu trú.
3. Tìm phòng và kiểm tra sức chứa.
4. Lấy giá phòng từ MongoDB.
5. Kiểm tra booking trùng lịch.
6. Kiểm tra mã khuyến mãi và điều kiện áp dụng.
7. Tự tính roomAmount, discount, totalAmount.
8. Ghi booking.
9. Trả bookingCode và hướng dẫn thanh toán.

Không được tin các field `totalAmount`, `discount`, `paidAmount` do client gửi lên.

### Tra cứu booking

`POST /api/public/bookings/lookup`

```json
{
  "bookingCode": "BK123ABC",
  "customerPhone": "0901234567"
}
```

Chỉ trả dữ liệu cần thiết cho khách. Không trả dữ liệu nội bộ, token, log hay thông tin thanh toán nhạy cảm.

### Hủy booking công khai

`POST /api/public/bookings/cancel`

```json
{
  "bookingCode": "BK123ABC",
  "customerPhone": "0901234567"
}
```

Yêu cầu:
- Xác minh cả bookingCode và phone.
- Kiểm tra trạng thái booking.
- Áp dụng chính sách hủy.
- Không tự đánh dấu đã hoàn tiền nếu tiền chưa thực sự về tài khoản khách.

### Check-in

`POST /api/bookings/:id/checkin`

Chỉ booking hợp lệ mới chuyển `confirmed` → `checked_in`. Ghi `actualCheckIn`.

### Thêm dịch vụ

`POST /api/bookings/:id/services`

Ví dụ payload khuyến nghị:

```json
{
  "serviceId": "SERVICE_OBJECT_ID",
  "quantity": 2
}
```

Backend phải lấy giá từ Service đang active; không tin giá do frontend gửi. Cập nhật `serviceItems`, `serviceAmount` và `totalAmount`.

### Ghi nhận thanh toán tại quầy

`POST /api/bookings/:id/payment`

```json
{
  "amount": 500000,
  "method": "cash"
}
```

Backend cần:
- `amount > 0`.
- Kiểm tra booking chưa bị hủy.
- Ghi nhận phương thức.
- Cập nhật `paidAmount` và `paymentStatus`.
- Ghi audit log.
- Chống ghi nhận cùng giao dịch nhiều lần nếu có transaction reference.

### Check-out

`POST /api/bookings/:id/checkout`

Chỉ booking `checked_in` mới được check-out. Ghi `actualCheckOut`, chuyển trạng thái `checked_out`. Đây là điều kiện để khách đủ tư cách gửi review.

---

# 5. Khách hàng — Customers

## Model `Customer`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | String | Họ tên |
| `phone` | String | Điện thoại, có index |
| `email` | String | Email |
| `idNumber` | String | Số giấy tờ tùy thân |
| `address` | String | Địa chỉ |
| `notes` | String | Ghi chú |

## Endpoint đang có

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/customers` | Bearer |
| `POST` | `/api/customers` | Theo roleGuard hiện tại |
| `PUT` | `/api/customers/:id` | Admin/Manager theo roleGuard |

### Tạo khách hàng — `POST /api/customers`

```json
{
  "name": "Nguyễn Văn An",
  "phone": "0901234567",
  "email": "an@example.com",
  "idNumber": "",
  "address": "",
  "notes": ""
}
```

Khuyến nghị:
- Chuẩn hóa số điện thoại trước khi tìm trùng.
- Không công khai `idNumber`.
- Hạn chế hiển thị địa chỉ/giấy tờ cho nhân viên không cần quyền.
- Không tạo hai hồ sơ khách trùng số điện thoại nếu nghiệp vụ yêu cầu một hồ sơ duy nhất.

---

# 6. Thanh toán — Payments / SePay

## Model `PaymentTransaction`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `transactionId` | String | Mã giao dịch ngân hàng, duy nhất |
| `bookingCode` | String | Mã booking đối chiếu |
| `amount` | Number | Số tiền nhận |
| `accountNumber` | String | Tài khoản nhận |
| `content` | String | Nội dung chuyển khoản |
| `receivedAt` | Date | Thời điểm nhận |
| `result` | String | Kết quả xử lý |

## Webhook đang có

`POST /api/payments/sepay-webhook`

Header:

```http
Authorization: Apikey YOUR_SEPAY_WEBHOOK_API_KEY
Content-Type: application/json
```

Payload minh họa — cần đối chiếu schema thực tế trong tài liệu SePay đang sử dụng:

```json
{
  "id": "SEPAY_TRANSACTION_ID",
  "transferType": "in",
  "accountNumber": "BANK_ACCOUNT",
  "transferAmount": 1000000,
  "content": "STAY BK123ABC"
}
```

Luồng xử lý cần có:
1. Xác thực API key bằng so sánh an toàn.
2. Chỉ chấp nhận giao dịch tiền vào.
3. Đối chiếu đúng tài khoản nhận.
4. Trích bookingCode từ nội dung chuyển khoản.
5. Tìm booking hợp lệ.
6. Kiểm tra transactionId đã được xử lý chưa.
7. Ghi PaymentTransaction.
8. Cập nhật paidAmount/paymentStatus.
9. Ghi audit log.

### Quy tắc idempotency

`transactionId` có unique index. Nếu SePay gửi lại cùng webhook, server không được cộng tiền lần thứ hai. Trả response thành công theo hợp đồng webhook sau khi xác nhận giao dịch đã được xử lý trước đó.

### Hoàn tiền

Booking có `refundAmount` và `refundStatus`. Trạng thái `completed` chỉ được đặt sau khi có xác nhận tiền hoàn thực tế. API cập nhật trạng thái hiện có:

`POST /api/bookings/:id/refund-status`

```json
{
  "status": "processing"
}
```

Enum: `pending`, `processing`, `completed`, `rejected`.

---

# 7. Dịch vụ — Services

## Model `Service`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | String | Tên dịch vụ |
| `price` | Number | Giá |
| `unit` | String | Đơn vị |
| `active` | Boolean | Đang kinh doanh hay không |

## Endpoint đang có

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/services` | Bearer |
| `POST` | `/api/services` | Admin/Manager |
| `PUT` | `/api/services/:id` | Admin/Manager |
| `DELETE` | `/api/services/:id` | Admin/Manager |

Ví dụ tạo:

```json
{
  "name": "Bữa sáng",
  "price": 80000,
  "unit": "suất",
  "active": true
}
```

Không xóa cứng dịch vụ đã gắn với booking cũ nếu cần bảo toàn lịch sử; nên chuyển `active=false`.

---

# 8. Khuyến mãi — Promotions

## Model `Promotion`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `code` | String | Mã duy nhất, uppercase |
| `title` | String | Tên chương trình |
| `description` | String | Mô tả |
| `type` | Enum | `percent` hoặc `fixed` |
| `value` | Number | Phần trăm hoặc số tiền |
| `maxDiscount` | Number | Mức giảm tối đa |
| `minAmount` | Number | Giá trị đơn tối thiểu |
| `startsAt` | Date | Bắt đầu |
| `expiresAt` | Date | Hết hạn |
| `usageLimit` | Number | Giới hạn lượt |
| `usedCount` | Number | Đã dùng |
| `active` | Boolean | Đang bật |

## Endpoint đang có

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/public/promotions` | Public |
| `POST` | `/api/public/promotions/validate` | Public |
| `GET` | `/api/promotions` | Bearer |
| `POST` | `/api/promotions` | Admin/Manager |
| `PUT` | `/api/promotions/:id` | Admin/Manager |
| `DELETE` | `/api/promotions/:id` | Admin/Manager |

Ví dụ validate:

```json
{
  "code": "STAY10",
  "amount": 1200000
}
```

Backend phải kiểm tra active, thời gian, minAmount, usageLimit và tính discount. Việc validate mã ở frontend chỉ nhằm hiển thị; khi tạo booking vẫn phải kiểm tra lại.

---

# 9. Đánh giá — Reviews

## Model `Review`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `bookingId` | ObjectId | Booking được đánh giá, unique |
| `bookingCode` | String | Mã booking |
| `customerName` | String | Tên lấy từ booking xác minh |
| `rating` | Number | 1–5 sao |
| `title` | String | Tiêu đề |
| `comment` | String | Nội dung tối đa 1500 ký tự |
| `status` | Enum | pending, published, rejected |
| `moderatedBy` | String | Người duyệt |
| `moderatedAt` | Date | Thời điểm duyệt |

## Endpoint đang có

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/public/reviews` | Public, chỉ review công khai |
| `POST` | `/api/public/reviews` | Public có xác minh booking |
| `GET` | `/api/reviews` | Admin/Manager |
| `PATCH` | `/api/reviews/:id` | Admin/Manager |

### Gửi review

`POST /api/public/reviews`

```json
{
  "bookingCode": "BK123ABC",
  "customerPhone": "0901234567",
  "rating": 5,
  "title": "Kỳ nghỉ tuyệt vời",
  "comment": "Phòng sạch sẽ, nhân viên thân thiện và vị trí thuận tiện."
}
```

Backend phải:
1. Tìm booking theo mã và xác minh số điện thoại.
2. Yêu cầu booking đã `checked_out`.
3. Lấy `customerName` trực tiếp từ booking.
4. Kiểm tra booking chưa có review.
5. Validate rating 1–5 và comment 10–1500 ký tự.
6. Tạo review trạng thái `pending`.

Không nhận `customerName` từ body làm nguồn sự thật.

### Duyệt review

`PATCH /api/reviews/:id`

Payload trạng thái cần tuân theo logic moderation trong `server.js`. Review chỉ được hiển thị công khai sau khi được duyệt.

---

# 10. Dashboard, báo cáo và nhật ký

## Endpoint đang có

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/api/stats` | Dữ liệu dashboard |
| `GET` | `/api/reports/bookings.csv` | Xuất báo cáo booking |
| `GET` | `/api/audit-logs` | Nhật ký thao tác |

### Dashboard

Các chỉ số nghiệp vụ nên có:
- Tổng số phòng.
- Phòng đang có khách.
- Phòng trống.
- Phòng đang vệ sinh.
- Phòng bảo trì.
- Booking hôm nay.
- Check-in hôm nay.
- Check-out hôm nay.
- Doanh thu đã thu.
- Công nợ chưa thu.
- Tỷ lệ lấp đầy.

**Phân biệt doanh thu và tiền đã thu:** `totalAmount` là giá trị booking; `paidAmount` là tiền đã thu. Không cộng `totalAmount` vào doanh thu tiền mặt đã thu nếu booking chưa thanh toán.

### CSV

`GET /api/reports/bookings.csv?from=2026-12-01&to=2026-12-31`

Cần kiểm tra quyền, ngày bắt đầu/kết thúc và escape dữ liệu CSV để tránh CSV formula injection.

### Audit log

Lưu actor, role, action, method, path, status code, IP, details. Không ghi password, token, API key hoặc thông tin thẻ.

---

# 11. Cấu hình và tài khoản nhân viên

## Settings

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/public/settings` | Public, chỉ trường an toàn |
| `GET` | `/api/settings` | Bearer |
| `PUT` | `/api/settings` | Admin |

Các field trong `Setting`:
- `hotelName`
- `address`
- `phone`
- `email`
- `checkInTime`
- `checkOutTime`
- `taxPercent`
- `invoicePrefix`

Không đưa cấu hình bí mật `.env` vào Settings public.

## Users

| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/users` | Admin |
| `POST` | `/api/users` | Admin |
| `PUT` | `/api/users/:id` | Admin |

User fields: `name`, `username`, `role`, `active`. Password chỉ nhận ở thao tác tạo/cập nhật phù hợp; database chỉ lưu hash và salt. Không trả `token`, `passwordHash`, `salt`.

---

# 12. Chuẩn lỗi API

| HTTP | Khi nào |
|---|---|
| `200` | Thành công |
| `201` | Tạo mới thành công |
| `400` | Payload không hợp lệ |
| `401` | Chưa đăng nhập / token sai |
| `403` | Không đủ quyền |
| `404` | Không tìm thấy dữ liệu hoặc route |
| `409` | Xung đột booking, giao dịch hoặc trạng thái |
| `413` | Request body vượt giới hạn |
| `429` | Quá nhiều request |
| `500` | Lỗi nội bộ |

Ví dụ:

```json
{
  "error": "Dữ liệu ngày lưu trú không hợp lệ",
  "requestId": "REQUEST_UUID"
}
```

Header `X-Request-Id` dùng để tìm log tương ứng. Không gửi stack trace ra client.

---

# 13. Danh sách API đang có và API nên bổ sung

## Đã có trong mã nguồn

- Auth: login, me, logout.
- Public hotel settings, public rooms, availability.
- Public bookings: create, lookup, cancel.
- Staff bookings: list, create, checkin, services, payment, checkout, cancel, refund status.
- Rooms: list/create/update/delete/available/housekeeping.
- Customers: list/create/update.
- Services: list/create/update/delete.
- Promotions: public list/validate và admin CRUD.
- Reviews: public list/create và admin list/moderate.
- SePay webhook.
- Dashboard stats, CSV report, audit logs.
- Users, settings.

## Nên bổ sung ở phiên bản tiếp theo

| API đề xuất | Lý do |
|---|---|
| `GET /api/v1/bookings/:id` | Xem chi tiết booking |
| `PATCH /api/v1/bookings/:id` | Sửa booking có kiểm tra ngày/phòng |
| `GET /api/v1/customers/:id` | Hồ sơ khách và lịch sử |
| `GET /api/v1/rooms/:id` | Chi tiết phòng |
| `GET /api/v1/services/:id` | Chi tiết dịch vụ |
| `GET /api/v1/payments` | Lịch sử giao dịch |
| `GET /api/v1/payments/:id` | Chi tiết giao dịch |
| `POST /api/v1/payments/:id/refund` | Khởi tạo quy trình hoàn tiền |
| `GET /api/v1/reviews/:id` | Chi tiết review quản trị |
| `GET /api/v1/reports/revenue` | Báo cáo doanh thu theo khoảng ngày |
| `GET /api/v1/reports/occupancy` | Báo cáo công suất phòng |
| `GET /api/v1/audit-logs` | Lọc nhật ký theo actor/action/date |
| `POST /api/v1/bookings` với `Idempotency-Key` | Chống tạo booking trùng do retry |

Các API đề xuất chưa được bật trong backend hiện tại. Khi triển khai, cần viết route, validation, authorization, service logic và integration test.

---

# 14. Bảo mật trước khi đưa website lên Internet

1. Đổi toàn bộ mật khẩu mẫu và API key mẫu.
2. Không commit `.env`.
3. Dùng HTTPS.
4. Chỉ khai báo domain thật trong `CORS_ORIGINS`.
5. Dùng password mạnh cho MongoDB và giới hạn IP truy cập database.
6. Thêm rate limit dùng Redis nếu chạy nhiều instance.
7. Thêm CSRF nếu chuyển sang cookie session; nếu dùng Bearer token cần bảo vệ token phía client.
8. Không log Authorization header.
9. Validate ObjectId, số tiền, ngày, chuỗi và enum ở server.
10. Thêm backup MongoDB và kiểm thử khôi phục.
11. Webhook phải chống duplicate transaction.
12. Kiểm tra quyền ở từng endpoint mới.

---

# 15. Hướng dẫn kiểm thử

## Kiểm thử thủ công bằng Postman

1. Import `StayManager.postman_collection.json`.
2. Import `StayManager.local.postman_environment.json`.
3. Chọn environment `StayManager Local`.
4. Điền `adminUser` và `adminPassword` của máy bạn.
5. Gọi Login, token được lưu tự động nếu response có `token`.
6. Tạo phòng.
7. Tạo booking bằng public API.
8. Tra cứu booking.
9. Thử check-in, thêm dịch vụ, ghi nhận payment, check-out.
10. Gửi review bằng booking đã check-out.
11. Duyệt review trong quản trị.
12. Gửi webhook thử trong môi trường test, không dùng giao dịch thật.

## Test case quan trọng

| ID | Tình huống | Kết quả mong đợi |
|---|---|---|
| AUTH-01 | Login đúng | Trả token |
| AUTH-02 | Login sai | 401 |
| AUTH-03 | User inactive | Không đăng nhập được |
| AUTH-04 | Housekeeping gọi API users | 403 |
| ROOM-01 | Tạo phòng hợp lệ | Tạo thành công |
| ROOM-02 | Trùng roomNumber | Từ chối |
| ROOM-03 | Giá âm | Từ chối |
| BOOK-01 | Ngày checkout trước checkin | Từ chối |
| BOOK-02 | Phòng đã có booking trùng ngày | Từ chối |
| BOOK-03 | Hai request đặt cùng phòng đồng thời | Chỉ một request thành công |
| BOOK-04 | Client tự gửi totalAmount thấp | Backend tự tính lại |
| BOOK-05 | Lookup sai số điện thoại | Không tiết lộ booking |
| PAY-01 | Webhook API key sai | 401/403 |
| PAY-02 | Giao dịch tiền ra | Không cộng tiền |
| PAY-03 | Gửi webhook trùng transactionId | Không cộng tiền lần hai |
| REVIEW-01 | Booking chưa checkout | Từ chối |
| REVIEW-02 | Sai phone | Từ chối |
| REVIEW-03 | Gửi review lần hai | Từ chối |
| REVIEW-04 | Tên khách trong body giả mạo | Backend vẫn lấy tên booking |
| REVIEW-05 | Review pending | Không xuất hiện public |
| REVIEW-06 | Review published | Xuất hiện public |
| REPORT-01 | CSV chứa ký tự công thức | Được escape an toàn |

---

# 16. Quy trình phát triển khuyến nghị

**Giai đoạn A — Hoàn thiện API hiện có**
- Chuẩn hóa validation.
- Thống nhất response lỗi.
- Bổ sung chi tiết booking/customer/room.
- Phân trang và lọc dữ liệu.
- Kiểm thử quyền từng role.

**Giai đoạn B — Tăng độ tin cậy**
- Idempotency key cho booking/payment.
- Transaction MongoDB cho các cập nhật nhiều collection.
- Chống webhook trùng.
- Audit log có cấu trúc.
- Backup/restore.

**Giai đoạn C — Mở rộng**
- API versioning `/api/v1`.
- Báo cáo doanh thu và công suất.
- Quản lý hóa đơn.
- Notification/email queue.
- Tích hợp app mobile hoặc đối tác.

---

# 17. Chạy dự án

```bash
npm install
npm test
npm run api:check
npm start
```

Sau khi chạy:
- Website: `http://localhost:5500/hotel.html`
- Health check: `http://localhost:5500/health`
- API base: `http://localhost:5500/api`
- OpenAPI: `docs/openapi.json`
- Postman collection: `docs/StayManager.postman_collection.json`

**Lưu ý:** `docs/openapi.json` là hợp đồng mô tả API để tham khảo/import công cụ. Luôn kiểm tra route thực tế trong `server.js` khi cập nhật code để tránh tài liệu lệch khỏi implementation.
