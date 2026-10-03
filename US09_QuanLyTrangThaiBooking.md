# USER STORY: US09 - QUẢN LÝ TRẠNG THÁI BOOKING

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US09** |
| **Tên User Story** | Quản lý trạng thái booking |
| **Phân hệ (Module)** | Phân hệ 2: Quản lý Booking & Lịch phòng |
| **Use Case liên quan** | **UC09** |
| **Yêu cầu SRS** | **[FR-11][FR-12]**, BR-04 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Chuyển trạng thái booking theo quy trình (Chờ xác nhận → Đã xác nhận → Đã check-in → Đã check-out / Đã hủy),
* **Để (So that):** Tôi theo dõi được tiến trình và giải phóng lịch phòng khi hủy.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Trạng thái booking quyết định việc chiếm lịch phòng. Chỉ các trạng thái chiếm chỗ mới chặn availability.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Trạng thái hỗ trợ: `pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`.
* Chỉ cho phép chuyển trạng thái hợp lệ.
* Booking `cancelled` và `checked_out` **không chiếm lịch** tương lai (BR-04).
* Hủy booking cần xác nhận từ người dùng.
* Ghi nhận người thực hiện + thời gian (BR-12).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xác nhận booking
* **Given:** Booking đang `pending`.
* **When:** Lễ tân chuyển sang `confirmed`.
* **Then:** Trạng thái cập nhật thành công.

### Kịch bản 2: Hủy booking
* **Given:** Booking chưa check-in.
* **When:** Lễ tân chọn Hủy và xác nhận.
* **Then:** Booking → `cancelled`, không còn chiếm lịch phòng.

### Kịch bản 3: Chặn chuyển trạng thái không hợp lệ
* **Given:** Booking đã `checked_out`.
* **When:** Cố chuyển về `confirmed`.
* **Then:** Hệ thống từ chối.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `PATCH /api/bookings/:id/status`
* Enum status trong schema Mongoose.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Liên quan chặt với US11, US12, US03 (availability).
