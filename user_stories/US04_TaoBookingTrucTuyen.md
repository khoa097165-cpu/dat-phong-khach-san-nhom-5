# USER STORY: US04 - TẠO BOOKING TRỰC TUYẾN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US04** |
| **Tên User Story** | Tạo booking trực tuyến |
| **Phân hệ (Module)** | Phân hệ 1: Website Khách hàng |
| **Use Case liên quan** | **UC04** |
| **Yêu cầu SRS** | **[FR-04][FR-05]**, BR-11, AC-01, AC-02, NFR-03 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Khách hàng |
| **Tác nhân phụ (Secondary Actor)** | Hệ thống (sinh mã booking) |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Khách hàng,
* **Tôi muốn (I want to):** Chọn phòng trống, nhập thông tin liên hệ và tạo booking trực tuyến,
* **Để (So that):** Tôi nhận được mã booking duy nhất và hoàn tất đặt phòng mà không cần gọi điện.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Sau khi tìm phòng trống, khách điền form đặt phòng. Hệ thống phải kiểm tra lại khả dụng ngay trước khi lưu để chống double-booking (NFR-03).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-11]** Mã booking phải duy nhất và đủ khó đoán.
* **[AC-01]** Tạo thành công → sinh mã, booking xuất hiện trong quản trị.
* **[AC-02]** Nếu phòng đã bị đặt bởi request khác → từ chối.
* Phải include kiểm tra khả dụng (US03) ngay trước khi commit.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo booking thành công
* **Given:** Phòng còn trống, ngày và thông tin khách hợp lệ.
* **When:** Khách gửi form đặt phòng.
* **Then:** Hệ thống tạo booking, sinh mã duy nhất, hiển thị mã cho khách và lưu vào CSDL (AC-01).

### Kịch bản 2: Chặn double-booking
* **Given:** Hai request gần như đồng thời cùng chọn một phòng.
* **When:** Cả hai cố tạo booking.
* **Then:** Chỉ một booking được tạo; request còn lại bị từ chối với thông báo rõ ràng (AC-02, NFR-03).

### Kịch bản 3: Validation thiếu thông tin
* **Given:** Khách bỏ trống họ tên hoặc số điện thoại.
* **When:** Gửi form.
* **Then:** Hệ thống không lưu và báo lỗi validation.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể
* `Booking`: bookingCode, customerId, roomId, checkIn, checkOut, guests, status, deposit, notes, totals...
* `Customer`: name, phone, email...

### 6.2. API gợi ý
* `POST /api/public/bookings` (body: roomId, checkIn, checkOut, guests, customerInfo, notes)

### 6.3. Sinh mã booking
* Ví dụ: `SM` + timestamp ngắn + random 4 ký tự (đảm bảo unique + index unique).

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Include:** US03 (Kiểm tra phòng trống).
* **Điều kiện tiên quyết:** RoomType, Room, Customer schema đã sẵn sàng.
* **Là tiền đề cho:** US05 (Tra cứu), toàn bộ luồng quản trị booking.
