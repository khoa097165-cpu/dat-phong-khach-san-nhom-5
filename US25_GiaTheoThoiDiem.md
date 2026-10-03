# USER STORY: US25 - GIÁ THEO THỜI ĐIỂM (MỞ RỘNG)

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US25** |
| **Tên User Story** | Giá theo thời điểm |
| **Phân hệ (Module)** | Phân hệ 7: Mở rộng |
| **Use Case liên quan** | — |
| **Yêu cầu SRS** | **[FR-44]** |
| **Độ ưu tiên (Priority)** | **Could-Have (Mở rộng)** |
| **Tác nhân chính (Primary Actor)** | Quản lý / Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý,
* **Tôi muốn (I want to):** Thiết lập giá khác nhau cho ngày thường, cuối tuần, mùa cao điểm và ngày lễ,
* **Để (So that):** Tối ưu doanh thu theo nhu cầu thị trường.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Giá động được áp dụng khi tạo booking mới. Booking đã tạo giữ nguyên giá đã chốt.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Có thể cấu hình rule theo loại ngày.
* Giá được snapshot vào booking tại thời điểm tạo.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Áp dụng giá cuối tuần
* **Given:** Đã cấu hình giá cuối tuần cao hơn.
* **When:** Tạo booking có ngày cuối tuần.
* **Then:** Hệ thống tính tiền phòng theo giá cuối tuần.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Có thể thêm collection `PriceRule` hoặc field mở rộng trên RoomType/Room.
* Logic tính giá nằm ở service layer khi tạo booking.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* Ảnh hưởng US04, US06, US12 (tính tiền).
* Thiết kế core booking phải cho phép mở rộng (NFR-15).
