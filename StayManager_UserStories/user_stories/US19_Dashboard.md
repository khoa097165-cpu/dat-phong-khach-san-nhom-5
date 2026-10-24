# USER STORY: US19 - DASHBOARD TỔNG QUAN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US19** |
| **Tên User Story** | Dashboard tổng quan |
| **Phân hệ (Module)** | Phân hệ 6: Dashboard – Báo cáo – Hệ thống |
| **Use Case liên quan** | **UC25** |
| **Yêu cầu SRS** | **[FR-36][FR-37]**, AC-10 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 3)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Xem dashboard tổng quan với doanh thu, tỷ lệ lấp đầy, số phòng đang có khách/trống/cần dọn/bảo trì và hoạt động hôm nay,
* **Để (So that):** Tôi nắm nhanh tình hình vận hành khách sạn.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Dashboard là màn hình đầu tiên sau khi đăng nhập quản trị. Các chỉ số phải lấy từ dữ liệu thực và cập nhật khi dữ liệu thay đổi (AC-10).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Hiển thị: doanh thu, occupancy rate, tổng booking, phòng occupied / available / cleaning / maintenance.
* Hoạt động hôm nay: khách dự kiến đến, khách dự kiến trả, booking gần đây (FR-37).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Chỉ số đúng từ DB
* **Given:** Có dữ liệu booking và phòng thực tế.
* **When:** Mở dashboard.
* **Then:** Các chỉ số phản ánh đúng dữ liệu hiện tại (AC-10).

### Kịch bản 2: Thay đổi khi có nghiệp vụ mới
* **Given:** Vừa có check-in mới.
* **When:** Refresh dashboard.
* **Then:** Số phòng đang có khách tăng lên tương ứng.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `GET /api/reports/dashboard`
* Tính occupancy = (số phòng occupied / tổng phòng hoạt động) × 100.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** US21 (Đăng nhập) + dữ liệu vận hành.
