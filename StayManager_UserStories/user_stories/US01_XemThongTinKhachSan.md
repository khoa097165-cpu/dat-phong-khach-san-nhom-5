# USER STORY: US01 - XEM THÔNG TIN KHÁCH SẠN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US01** |
| **Tên User Story** | Xem thông tin khách sạn |
| **Phân hệ (Module)** | Phân hệ 1: Website Khách hàng |
| **Use Case liên quan** | **UC01: Xem thông tin khách sạn** |
| **Yêu cầu SRS** | **[FR-01]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Khách hàng |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Khách hàng,
* **Tôi muốn (I want to):** Xem thông tin cơ bản của khách sạn (tên, địa chỉ, điện thoại, email, giờ check-in/check-out và chính sách công khai),
* **Để (So that):** Tôi có thể nắm rõ thông tin liên hệ và quy định trước khi quyết định đặt phòng.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Khách truy cập website cần thấy ngay các thông tin công khai của khách sạn để tin tưởng và tiện liên hệ. Thông tin này được lấy từ cấu hình `HotelSetting` do Admin/Quản lý quản lý.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-01.1]** Thông tin hiển thị tối thiểu gồm: Tên, Địa chỉ, Điện thoại, Email, Giờ check-in, Giờ check-out, Chính sách công khai.
* **[BR-01.2]** Dữ liệu được lấy từ bản ghi `HotelSetting` duy nhất của hệ thống.
* **[BR-01.3]** Giao diện phải responsive (desktop + mobile).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Hiển thị đầy đủ thông tin (Happy Path)
* **Given:** Khách truy cập trang chủ hoặc trang thông tin khách sạn.
* **When:** Trang được tải.
* **Then:** Hệ thống hiển thị đầy đủ tên, địa chỉ, điện thoại, email, giờ check-in/out và chính sách công khai lấy từ `HotelSetting`.

### Kịch bản 2: Responsive
* **Given:** Khách truy cập từ thiết bị di động.
* **When:** Trang được tải.
* **Then:** Layout hiển thị đúng, không vỡ trên màn hình phổ biến.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* `HotelSetting`: name, address, phone, email, checkInTime, checkOutTime, policy, tax, invoiceInfo...

### 6.2. API gợi ý
* `GET /api/public/hotel-info` – không cần xác thực.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có bản ghi `HotelSetting` được cấu hình (US22).
* **Là tiền đề cho:** Toàn bộ luồng website khách hàng.
