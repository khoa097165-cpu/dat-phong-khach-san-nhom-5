# USER STORY: US16 - QUẢN LÝ KHÁCH HÀNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US16** |
| **Tên User Story** | Quản lý khách hàng |
| **Phân hệ (Module)** | Phân hệ 5: Khách hàng – Dịch vụ – Thanh toán |
| **Use Case liên quan** | **UC18, UC19** |
| **Yêu cầu SRS** | **[FR-26][FR-27][FR-28]** |
| **Độ ưu tiên (Priority)** | **Must-Have** |
| **Tác nhân chính (Primary Actor)** | Lễ tân / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Quản lý hồ sơ khách hàng (họ tên, SĐT, email, địa chỉ, CCCD/Hộ chiếu) và xem lịch sử lưu trú,
* **Để (So that):** Tôi phục vụ khách tốt hơn và tra cứu nhanh thông tin.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Hồ sơ khách là trung tâm. Từ hồ sơ có thể xem toàn bộ booking/lịch sử lưu trú.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Lưu các trường: name, phone, email, address, idDocument (khi cần).
* Tìm kiếm theo tên, SĐT, email, số giấy tờ (theo quyền).
* Dữ liệu cá nhân chỉ trả về khi cần thiết (NFR-06).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo / cập nhật hồ sơ
* **Given:** Lễ tân đã đăng nhập.
* **When:** Nhập thông tin khách và lưu.
* **Then:** Hồ sơ được tạo/cập nhật thành công.

### Kịch bản 2: Xem lịch sử lưu trú
* **Given:** Khách đã có booking trước đó.
* **When:** Mở hồ sơ khách.
* **Then:** Hiển thị danh sách booking/lịch sử liên quan (FR-27).

### Kịch bản 3: Tìm kiếm khách
* **Given:** Nhiều hồ sơ khách.
* **When:** Nhập tên hoặc SĐT.
* **Then:** Trả về kết quả khớp (FR-28).

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `Customer`: name, phone, email, address, idNumber, ...
* API: CRUD `/api/customers`, `GET /api/customers/:id/bookings`

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Được dùng bởi US04, US06, US08.
