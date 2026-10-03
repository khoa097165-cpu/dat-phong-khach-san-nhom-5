# USER STORY: US10 - XEM LỊCH PHÒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US10** |
| **Tên User Story** | Xem lịch phòng theo ngày |
| **Phân hệ (Module)** | Phân hệ 2: Quản lý Booking & Lịch phòng |
| **Use Case liên quan** | **UC10** |
| **Yêu cầu SRS** | **[FR-13][FR-14]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Xem tình trạng phòng theo ngày/khoảng ngày (trống, đã đặt, đang có khách),
* **Để (So that):** Tôi nắm được lịch phòng và có thể xem nhanh booking liên quan.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Lịch phòng là công cụ trực quan quan trọng nhất cho front-desk. Không chỉ dựa vào trạng thái phòng hiện tại mà phải phản ánh booking theo ngày.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Phân biệt rõ: Trống / Đã đặt / Đang có khách / Đang dọn / Bảo trì.
* Click vào ô lịch có thể xem thông tin booking liên quan (FR-14).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Hiển thị lịch đúng
* **Given:** Có booking trong khoảng ngày chọn.
* **When:** Lễ tân mở màn hình lịch phòng.
* **Then:** Các ô ngày thể hiện đúng tình trạng và màu sắc phân biệt.

### Kịch bản 2: Xem chi tiết booking từ lịch
* **Given:** Ô lịch có booking.
* **When:** Click vào ô.
* **Then:** Hiển thị thông tin booking liên quan theo quyền.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `GET /api/rooms/calendar?from=...&to=...`
* Frontend có thể dùng full-calendar hoặc grid tùy chỉnh.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Phụ thuộc dữ liệu Booking + Room status.
* **Điều kiện tiên quyết:** US21.
