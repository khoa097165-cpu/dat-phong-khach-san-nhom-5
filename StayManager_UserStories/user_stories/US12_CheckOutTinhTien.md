# USER STORY: US12 - CHECK-OUT & TÍNH TIỀN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US12** |
| **Tên User Story** | Check-out và tính tiền |
| **Phân hệ (Module)** | Phân hệ 3: Check-in / Check-out |
| **Use Case liên quan** | **UC12** |
| **Yêu cầu SRS** | **[FR-17][FR-18]**, BR-07, BR-08, BR-09, BR-10, AC-05 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 2)** |
| **Tác nhân chính (Primary Actor)** | Lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Quản lý / Admin |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Lễ tân,
* **Tôi muốn (I want to):** Thực hiện check-out, xem tổng hợp chi phí và chốt số tiền còn phải thanh toán,
* **Để (So that):** Tôi tính đúng tiền phòng + dịch vụ + phụ thu − giảm giá − tiền cọc và chuyển phòng sang Đang dọn.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Công thức chuẩn:
> Tiền phòng + Dịch vụ + Phụ thu − Giảm giá − Tiền cọc (± đã thanh toán) = Còn phải thanh toán

Sau check-out phòng chuyển sang trạng thái Đang dọn (BR-07).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-08]** Tiền phòng = giá áp dụng × số đêm.
* **[BR-09]** Tổng dịch vụ = Σ (số lượng × đơn giá).
* **[BR-10]** Không trừ lặp tiền cọc / đã thanh toán.
* **[BR-07]** Check-out thành công → room = `cleaning`.
* Chỉ Housekeeping / người có quyền mới đưa phòng về `available`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Check-out thành công
* **Given:** Booking đang `checked_in`.
* **When:** Lễ tân xem tổng hợp tiền, ghi nhận thanh toán (nếu có) và xác nhận check-out.
* **Then:** Booking → `checked_out`, Phòng → `cleaning`, số còn lại tính đúng (AC-05).

### Kịch bản 2: Hiển thị đúng các thành phần tiền
* **Given:** Booking có dịch vụ và tiền cọc.
* **When:** Mở màn hình check-out.
* **Then:** Hiển thị rõ ràng từng khoản và số dư cuối cùng.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: `POST /api/bookings/:id/check-out`
* Liên quan: `BookingService`, `Payment`, `Room`.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Include:** US22 (xem công nợ), có thể extend US23 (ghi nhận thanh toán).
* **Sau đó:** US15 (Housekeeping đưa phòng về sẵn sàng).
