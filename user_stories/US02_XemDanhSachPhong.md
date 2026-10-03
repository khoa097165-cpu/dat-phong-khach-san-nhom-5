# USER STORY: US02 - XEM DANH SÁCH PHÒNG / LOẠI PHÒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US02** |
| **Tên User Story** | Xem danh sách phòng / loại phòng |
| **Phân hệ (Module)** | Phân hệ 1: Website Khách hàng |
| **Use Case liên quan** | **UC02** |
| **Yêu cầu SRS** | **[FR-02]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Khách hàng |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Khách hàng,
* **Tôi muốn (I want to):** Xem danh sách loại phòng và thông tin chi tiết (giá tham khảo, sức chứa, số giường, tiện nghi, hình ảnh/mô tả),
* **Để (So that):** Tôi có thể so sánh và chọn loại phòng phù hợp với nhu cầu lưu trú.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Website cần trình bày rõ ràng các loại phòng đang kinh doanh để khách dễ dàng lựa chọn trước khi kiểm tra tình trạng trống theo ngày.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-02.1]** Chỉ hiển thị loại phòng / phòng đang hoạt động (không ẩn phòng bảo trì ở danh sách tổng quan nếu cần).
* **[BR-02.2]** Thông tin giá, sức chứa, tiện nghi lấy từ `RoomType` và `Room`.
* **[BR-02.3]** Có thể xem chi tiết từng loại phòng.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xem danh sách loại phòng
* **Given:** Khách truy cập trang danh sách phòng.
* **When:** Trang tải xong.
* **Then:** Hiển thị các loại phòng với giá tham khảo, sức chứa, số giường, tiện nghi và hình ảnh (nếu có).

### Kịch bản 2: Xem chi tiết loại phòng
* **Given:** Khách chọn một loại phòng.
* **When:** Mở trang chi tiết.
* **Then:** Hiển thị đầy đủ mô tả, tiện nghi, hình ảnh và nút chuyển sang kiểm tra phòng trống.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL
* `RoomType`: name, description, capacity, bedCount, basePrice, amenities, images
* `Room`: roomNumber, roomTypeId, status, floor...

### 6.2. API gợi ý
* `GET /api/public/room-types`
* `GET /api/public/room-types/:id`

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu `RoomType` và `Room` (US13, US14).
* **Là tiền đề cho:** US03, US04.
