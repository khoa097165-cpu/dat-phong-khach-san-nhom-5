# USER STORY: US20 - BÁO CÁO VÀ BIỂU ĐỒ DOANH THU

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US20** |
| **Tên User Story** | Báo cáo và biểu đồ doanh thu |
| **Phân hệ (Module)** | Phân hệ 6: Dashboard – Báo cáo – Hệ thống |
| **Use Case liên quan** | **UC26, UC27** |
| **Yêu cầu SRS** | **[FR-38][FR-39]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 3)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Xem biểu đồ doanh thu và các báo cáo (doanh thu, booking, tỷ lệ lấp đầy, tình trạng phòng) theo khoảng thời gian,
* **Để (So that):** Tôi phân tích được hiệu quả kinh doanh.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Sử dụng Chart.js để vẽ biểu đồ. Báo cáo hỗ trợ lọc theo khoảng ngày.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Dữ liệu lấy từ database thực tế.
* Có thể lọc theo fromDate – toDate.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Biểu đồ doanh thu
* **Given:** Có dữ liệu thanh toán/booking trong khoảng thời gian.
* **When:** Chọn khoảng ngày và xem biểu đồ.
* **Then:** Biểu đồ phản ánh đúng doanh thu theo thời gian (FR-38).

### Kịch bản 2: Báo cáo tổng hợp
* **Given:** Quản lý chọn khoảng thời gian.
* **When:** Xem báo cáo.
* **Then:** Có số liệu doanh thu, booking, occupancy, tình trạng phòng (FR-39).

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `GET /api/reports/revenue?from=...&to=...`, `GET /api/reports/occupancy?...`
* Frontend: Chart.js.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** US21 + dữ liệu Payment/Booking.
