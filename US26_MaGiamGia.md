# USER STORY: US26 - MÃ GIẢM GIÁ (MỞ RỘNG)

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US26** |
| **Tên User Story** | Mã giảm giá |
| **Phân hệ (Module)** | Phân hệ 7: Mở rộng |
| **Use Case liên quan** | — |
| **Yêu cầu SRS** | **[FR-45]** |
| **Độ ưu tiên (Priority)** | **Could-Have (Mở rộng)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | Khách hàng (áp dụng mã) |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Tạo và quản lý mã giảm giá với điều kiện hiệu lực,
* **Để (So that):** Khách có thể áp dụng mã khi đặt phòng và tăng tỷ lệ chuyển đổi.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Mã giảm giá có thể là % hoặc số tiền cố định, có ngày hiệu lực, giới hạn số lần dùng.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Mã hết hạn hoặc không hợp lệ → từ chối.
* Nếu giới hạn 1 lần dùng thì không cho dùng lại.
* Giảm giá được phản ánh trong tổng tiền booking.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Áp dụng mã hợp lệ
* **Given:** Mã còn hiệu lực.
* **When:** Khách hoặc lễ tân nhập mã vào booking.
* **Then:** Tổng tiền được giảm đúng theo quy tắc mã.

### Kịch bản 2: Mã hết hạn
* **Given:** Mã đã quá ngày hiệu lực.
* **When:** Cố áp dụng.
* **Then:** Hệ thống từ chối.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `Coupon`: code, type (percent/fixed), value, validFrom, validTo, usageLimit, usedCount...
* API: CRUD `/api/coupons`, validate khi tạo/cập nhật booking.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Ảnh hưởng US04, US06, US12, US18.
* Thiết kế cho phép bổ sung mà không viết lại booking core (NFR-15).
