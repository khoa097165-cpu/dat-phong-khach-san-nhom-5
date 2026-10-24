# USER STORY: US11 - CHECK-IN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US11** |
| **Tên User Story** | Check-in |
| **Phân hệ (Module)** | Phân hệ 3: Check-in / Check-out |
| **Use Case liên quan** | **UC11** |
| **Yêu cầu SRS** | **[FR-15][FR-16]**, BR-06, AC-04 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Quản lý / Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Thực hiện check-in cho khách đã có booking,
* **Để (So that):** Hệ thống cập nhật đúng trạng thái booking thành Đã check-in và phòng thành Đang có khách.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Khi khách đến nhận phòng, lễ tân xác nhận thông tin và thực hiện check-in. Thao tác phải đồng bộ cả booking và phòng (BR-06).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Không cho check-in booking đã hủy hoặc đã check-out (FR-16).
* Phải có phòng hợp lệ và thông tin khách cần thiết.
* Check-in thành công → booking = `checked_in`, room = `occupied` (AC-04).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Check-in thành công
* **Given:** Booking ở trạng thái `confirmed`.
* **When:** Lễ tân xác nhận check-in.
* **Then:** Booking → `checked_in`, Phòng → `occupied` (AC-04).

### Kịch bản 2: Chặn check-in không hợp lệ
* **Given:** Booking đã `cancelled` hoặc `checked_out`.
* **When:** Cố check-in.
* **Then:** Hệ thống từ chối.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `POST /api/bookings/:id/check-in`
* Transaction: cập nhật Booking + Room trong cùng transaction nếu có thể.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Include:** US08 (thường tìm booking trước).
* **Điều kiện tiên quyết:** Booking đã `confirmed`.
