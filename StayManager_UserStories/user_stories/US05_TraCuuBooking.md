# USER STORY: US05 - TRA CỨU BOOKING

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US05** |
| **Tên User Story** | Tra cứu booking |
| **Phân hệ (Module)** | Phân hệ 1: Website Khách hàng |
| **Use Case liên quan** | **UC05** |
| **Yêu cầu SRS** | **[FR-06]**, AC-08, BR-11 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Khách hàng |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Khách hàng,
* **Tôi muốn (I want to):** Tra cứu booking bằng mã booking kết hợp thông tin xác minh (số điện thoại/email),
* **Để (So that):** Tôi xem lại được thông tin đặt phòng của mình mà không lộ dữ liệu nhạy cảm.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Khách sau khi đặt phòng cần cách tra cứu đơn giản. Hệ thống chỉ trả dữ liệu khi mã + thông tin xác minh khớp, tránh lộ thông tin khi đoán mã.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-11]** Mã booking đủ khó đoán.
* **[AC-08]** Đúng mã + xác minh → trả booking; sai → không trả dữ liệu.
* Không hiển thị CCCD/Hộ chiếu đầy đủ nếu không cần thiết.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tra cứu thành công
* **Given:** Booking tồn tại với mã `SMABC123` và SĐT khớp.
* **When:** Khách nhập đúng mã + SĐT.
* **Then:** Hệ thống hiển thị thông tin booking cần thiết (ngày, phòng, trạng thái, tổng tiền...).

### Kịch bản 2: Thông tin sai
* **Given:** Mã đúng nhưng SĐT sai (hoặc ngược lại).
* **When:** Khách gửi form tra cứu.
* **Then:** Hệ thống không trả dữ liệu booking và thông báo "Không tìm thấy".

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. API gợi ý
* `POST /api/public/bookings/lookup` (body: bookingCode, phone hoặc email)

### 6.2. Bảo mật
* Rate-limit endpoint tra cứu.
* Không log đầy đủ thông tin cá nhân.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** US04 (đã có booking).
* **Liên quan NFR:** NFR-06 (bảo vệ dữ liệu cá nhân).
