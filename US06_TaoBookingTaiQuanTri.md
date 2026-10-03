# USER STORY: US06 - TẠO BOOKING TẠI TRANG QUẢN TRỊ

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US06** |
| **Tên User Story** | Tạo booking tại trang quản trị |
| **Phân hệ (Module)** | Phân hệ 2: Quản lý Booking & Lịch phòng |
| **Use Case liên quan** | **UC06** |
| **Yêu cầu SRS** | **[FR-07][FR-09]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Tạo booking thay cho khách và chọn phòng còn trống ngay trên trang quản trị,
* **Để (So that):** Tôi hỗ trợ được khách gọi điện hoặc đến trực tiếp đặt phòng.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Nhiều khách đặt qua điện thoại hoặc walk-in. Lễ tân cần tạo booking nhanh với đầy đủ kiểm tra trùng lịch như website.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Phải kiểm tra trùng lịch (FR-09, BR-03) trước khi lưu.
* Có thể tạo Customer mới hoặc chọn Customer đã có.
* Trạng thái mặc định thường là `confirmed` hoặc `pending` tùy cấu hình.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo thành công
* **Given:** Lễ tân đã đăng nhập, phòng còn trống.
* **When:** Điền thông tin khách + ngày + chọn phòng và lưu.
* **Then:** Booking được tạo, xuất hiện trong danh sách và lịch phòng.

### Kịch bản 2: Trùng lịch
* **Given:** Phòng đã có booking giao ngày.
* **When:** Cố tạo booking mới trên cùng phòng/ngày.
* **Then:** Hệ thống từ chối và báo lỗi trùng lịch.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `POST /api/bookings` (yêu cầu JWT + quyền).
* Include logic availability giống US03.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Include:** US03 (kiểm tra phòng trống).
* **Điều kiện tiên quyết:** US21 (Đăng nhập).
