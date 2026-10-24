# USER STORY: US14 - QUẢN LÝ LOẠI PHÒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US14** |
| **Tên User Story** | Quản lý loại phòng |
| **Phân hệ (Module)** | Phân hệ 4: Quản lý Phòng & Housekeeping |
| **Use Case liên quan** | **UC14** |
| **Yêu cầu SRS** | **[FR-22]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Quản lý tên loại phòng, mô tả, sức chứa mặc định, giá cơ sở và tiện nghi mặc định,
* **Để (So that):** Các phòng cùng loại kế thừa thông tin chuẩn và hiển thị đúng trên website.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

RoomType là master data. Mỗi Room thuộc một RoomType.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Tên loại phòng nên duy nhất.
* Giá cơ sở và sức chứa dùng làm mặc định khi tạo Room mới.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: CRUD loại phòng
* **Given:** Quản lý đã đăng nhập.
* **When:** Thêm / sửa / xem danh sách loại phòng.
* **Then:** Dữ liệu lưu đúng và phản ánh trên website khách hàng (US02).

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `RoomType`: name, description, capacity, bedCount, basePrice, amenities, images.
* API: CRUD `/api/room-types`.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Là tiền đề cho:** US13, US02, US03.
