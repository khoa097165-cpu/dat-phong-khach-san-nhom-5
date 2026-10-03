# USER STORY: US15 - HOUSEKEEPING – VỆ SINH PHÒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US15** |
| **Tên User Story** | Housekeeping – Quản lý vệ sinh phòng |
| **Phân hệ (Module)** | Phân hệ 4: Quản lý Phòng & Housekeeping |
| **Use Case liên quan** | **UC16, UC17** |
| **Yêu cầu SRS** | **[FR-24][FR-25]**, BR-07, AC-06 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 3)** |
| **Tác nhân chính (Primary Actor)** | Housekeeping |
| **Tác nhân phụ (Secondary Actor)** | Lễ tân / Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Nhân viên Housekeeping,
* **Tôi muốn (I want to):** Xem danh sách phòng đang cần dọn và xác nhận hoàn tất vệ sinh,
* **Để (So that):** Phòng chuyển từ Đang dọn sang Sẵn sàng cho khách tiếp theo.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Sau check-out, phòng tự động chuyển sang `cleaning`. Chỉ Housekeeping (hoặc người có quyền) mới đưa về `available` (BR-07).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[FR-24]** Chỉ hiển thị phòng có status = `cleaning`.
* **[FR-25][AC-06]** Xác nhận hoàn tất → status = `available`.
* Ghi nhận người thực hiện + thời gian (HousekeepingRecord).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xem phòng cần dọn
* **Given:** Có phòng status = `cleaning`.
* **When:** Housekeeping mở danh sách.
* **Then:** Chỉ thấy các phòng đang dọn.

### Kịch bản 2: Xác nhận đã dọn
* **Given:** Phòng đang `cleaning`.
* **When:** Nhân viên xác nhận hoàn tất.
* **Then:** Phòng → `available` (AC-06).

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `GET /api/housekeeping/tasks`, `POST /api/housekeeping/:roomId/complete`
* Schema `HousekeepingRecord`: roomId, status, performedBy, performedAt, notes.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** US12 (Check-out tạo ra phòng cần dọn).
* **Include:** Danh sách phòng cần dọn trước khi xác nhận.
