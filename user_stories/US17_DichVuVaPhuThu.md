# USER STORY: US17 - DỊCH VỤ VÀ PHỤ THU

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US17** |
| **Tên User Story** | Dịch vụ và phụ thu |
| **Phân hệ (Module)** | Phân hệ 5: Khách hàng – Dịch vụ – Thanh toán |
| **Use Case liên quan** | **UC20, UC21** |
| **Yêu cầu SRS** | **[FR-29][FR-30][FR-31]**, BR-09 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Quản lý danh mục dịch vụ và ghi nhận dịch vụ/phụ thu vào booking,
* **Để (So that):** Chi phí phát sinh trong thời gian lưu trú được tính đúng khi check-out.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Dịch vụ ví dụ: ăn sáng, minibar, giặt ủi, thuê xe, đưa đón.  
Phụ thu ví dụ: thêm giường, check-in sớm, check-out muộn.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-09]** Tổng dịch vụ = Σ (số lượng × đơn giá).
* Ghi nhận số lượng, đơn giá, thành tiền, thời điểm.
* Có thể soft-delete dịch vụ trong danh mục.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Quản lý danh mục dịch vụ
* **Given:** Quản lý đã đăng nhập.
* **When:** Thêm/sửa dịch vụ (tên + đơn giá).
* **Then:** Dịch vụ xuất hiện trong danh mục để chọn khi ghi nhận.

### Kịch bản 2: Ghi nhận dịch vụ vào booking
* **Given:** Booking đang `checked_in`.
* **When:** Lễ tân thêm dịch vụ với số lượng.
* **Then:** Thành tiền được tính đúng và cộng vào tổng khi check-out.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `Service`: name, unitPrice, active.
* Schema `BookingService`: bookingId, serviceId, quantity, unitPrice, amount, createdAt.
* API: CRUD `/api/services`, `POST /api/bookings/:id/services`

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Ảnh hưởng trực tiếp đến US12 (tính tiền check-out).
