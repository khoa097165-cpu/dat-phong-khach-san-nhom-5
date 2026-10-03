# USER STORY: US13 - QUẢN LÝ PHÒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US13** |
| **Tên User Story** | Quản lý phòng |
| **Phân hệ (Module)** | Phân hệ 4: Quản lý Phòng & Housekeeping |
| **Use Case liên quan** | **UC13** |
| **Yêu cầu SRS** | **[FR-19][FR-20][FR-21][FR-23]**, BR-05, AC-07 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Thêm, sửa, xem phòng với số phòng, loại, giá, sức chứa, tầng, tiện nghi và trạng thái,
* **Để (So that):** Danh mục phòng luôn chính xác phục vụ đặt phòng và vận hành.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Mỗi phòng có số phòng duy nhất. Trạng thái phòng gồm: Sẵn sàng, Đã đặt, Đang có khách, Đang dọn, Bảo trì.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[FR-20]** `roomNumber` duy nhất trong khách sạn.
* **[FR-21]** Hỗ trợ đầy đủ 5 trạng thái.
* **[FR-23][BR-05]** Phòng Bảo trì không xuất hiện trong kết quả đặt phòng (AC-07).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Thêm phòng thành công
* **Given:** Số phòng chưa tồn tại.
* **When:** Quản lý nhập thông tin và lưu.
* **Then:** Phòng được tạo với trạng thái mặc định `available`.

### Kịch bản 2: Trùng số phòng
* **Given:** Số phòng đã tồn tại.
* **When:** Cố tạo mới.
* **Then:** Hệ thống từ chối.

### Kịch bản 3: Đưa vào bảo trì
* **Given:** Phòng đang `available`.
* **When:** Chuyển sang `maintenance`.
* **Then:** Phòng không còn xuất hiện trong availability search.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `Room`: roomNumber (unique), roomTypeId, price, capacity, beds, floor, amenities, status (enum).
* API: CRUD `/api/rooms` (JWT + quyền).

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** US14 (Loại phòng).
* **Ảnh hưởng:** US03, US15.
