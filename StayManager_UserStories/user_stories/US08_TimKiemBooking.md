# USER STORY: US08 - TÌM KIẾM BOOKING

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US08** |
| **Tên User Story** | Tìm kiếm booking |
| **Phân hệ (Module)** | Phân hệ 2: Quản lý Booking & Lịch phòng |
| **Use Case liên quan** | **UC08** |
| **Yêu cầu SRS** | **[FR-10]**, AC-09 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Tìm booking theo tên khách, số điện thoại, mã booking hoặc số phòng,
* **Để (So that):** Tôi nhanh chóng tìm được đơn cần xử lý check-in, check-out hoặc hỗ trợ khách.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Lễ tân cần tìm booking cực nhanh trong ca làm việc. Tìm kiếm phải hỗ trợ nhiều tiêu chí và kết quả rõ ràng.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Hỗ trợ tìm theo: tên khách, SĐT, mã booking, số phòng (AC-09).
* Có thể kết hợp bộ lọc trạng thái / khoảng ngày.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tìm theo mã booking
* **Given:** Có booking với mã `SMABC123`.
* **When:** Lễ tân nhập mã vào ô tìm kiếm.
* **Then:** Trả về đúng booking đó.

### Kịch bản 2: Tìm theo tên / SĐT / số phòng
* **Given:** Dữ liệu booking có thông tin khách và phòng.
* **When:** Nhập từng tiêu chí.
* **Then:** Kết quả khớp đúng và cho phép mở chi tiết.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `GET /api/bookings?q=...&status=...&from=...&to=...`
* Index: text index hoặc compound index trên customer.name, customer.phone, bookingCode, room.roomNumber.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Được include bởi:** US11 (Check-in), US12, US17, US21.
* **Điều kiện tiên quyết:** US21 (Đăng nhập).
