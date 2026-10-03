# USER STORY: US18 - THANH TOÁN VÀ HÓA ĐƠN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US18** |
| **Tên User Story** | Thanh toán và hóa đơn |
| **Phân hệ (Module)** | Phân hệ 5: Khách hàng – Dịch vụ – Thanh toán |
| **Use Case liên quan** | **UC22, UC23, UC24** |
| **Yêu cầu SRS** | **[FR-32][FR-33][FR-34][FR-35]**, BR-10 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Quản lý / Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Xem tổng hợp công nợ, ghi nhận thanh toán và xuất thông tin hóa đơn,
* **Để (So that):** Tôi chốt thanh toán chính xác với khách và lưu chứng từ.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Hiển thị: tiền phòng, dịch vụ, phụ thu, giảm giá, tiền cọc, đã thanh toán, còn lại.  
Ghi nhận số tiền không được âm. Phương thức có thể là tiền mặt / chuyển khoản / thẻ (mở rộng).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-10]** Không trừ lặp tiền cọc hoặc khoản đã thanh toán.
* Không cho số tiền thanh toán âm (FR-33).
* Có thể xem/in/xuất thông tin hóa đơn ở mức phù hợp đồ án (FR-34).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xem công nợ đúng
* **Given:** Booking có các khoản phát sinh.
* **When:** Mở màn hình thanh toán.
* **Then:** Hiển thị đầy đủ các thành phần và số còn lại đúng.

### Kịch bản 2: Ghi nhận thanh toán
* **Given:** Còn số dư > 0.
* **When:** Lễ tân nhập số tiền và phương thức.
* **Then:** Payment được lưu, số dư cập nhật.

### Kịch bản 3: Xuất hóa đơn
* **Given:** Booking đã có thanh toán.
* **When:** Chọn xuất/in.
* **Then:** Hiển thị thông tin hóa đơn phù hợp.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `Payment`: bookingId, amount, method, paidAt, note, status.
* API: `GET /api/bookings/:id/billing`, `POST /api/bookings/:id/payments`

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Được dùng mạnh trong US12 (Check-out).
