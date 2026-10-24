# USER STORY: US07 - CẬP NHẬT BOOKING

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US07** |
| **Tên User Story** | Cập nhật booking |
| **Phân hệ (Module)** | Phân hệ 2: Quản lý Booking & Lịch phòng |
| **Use Case liên quan** | **UC07** |
| **Yêu cầu SRS** | **[FR-08][FR-09]**, BR-12 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Cập nhật ngày check-in/out, số khách, tiền cọc, ghi chú của booking,
* **Để (So that):** Tôi điều chỉnh được thông tin khi khách yêu cầu thay đổi.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Khách thường đổi ngày hoặc số người. Mọi thay đổi liên quan phòng/ngày phải kiểm tra trùng lịch lại.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Khi đổi phòng hoặc đổi ngày → bắt buộc kiểm tra trùng lịch (FR-09).
* Lưu người thực hiện và thời gian cập nhật (BR-12).
* Không cho sửa booking đã check-out / đã hủy (tùy quy ước).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Cập nhật thành công
* **Given:** Booking ở trạng thái cho phép sửa.
* **When:** Lễ tân đổi ngày/ghi chú và lưu.
* **Then:** Dữ liệu được cập nhật, lịch sử thay đổi được ghi nhận.

### Kịch bản 2: Đổi ngày gây trùng
* **Given:** Ngày mới giao với booking khác của cùng phòng.
* **When:** Cố lưu.
* **Then:** Hệ thống từ chối và giữ nguyên dữ liệu cũ.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `PUT /api/bookings/:id` (JWT + quyền).
* Ghi `updatedAt`, `updatedBy`.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Include:** US03 khi đổi ngày/phòng.
* **Điều kiện tiên quyết:** US06 hoặc US04 (đã có booking).
