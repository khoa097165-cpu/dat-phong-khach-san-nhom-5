# USER STORY: US03 - KIỂM TRA PHÒNG TRỐNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US03** |
| **Tên User Story** | Kiểm tra phòng trống |
| **Phân hệ (Module)** | Phân hệ 1: Website Khách hàng |
| **Use Case liên quan** | **UC03** |
| **Yêu cầu SRS** | **[FR-03]**, BR-01, BR-02, BR-03, BR-05, AC-03, AC-07 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Khách hàng |
| **Tác nhân phụ (Secondary Actor)** | Hệ thống (kiểm tra khả dụng backend) |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Khách hàng,
* **Tôi muốn (I want to):** Nhập ngày nhận, ngày trả và số khách để hệ thống trả về danh sách phòng còn trống phù hợp,
* **Để (So that):** Tôi chỉ thấy những phòng thực sự khả dụng và phù hợp sức chứa.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Khả dụng phòng không dựa duy nhất vào trạng thái "Đã đặt" của phòng mà phải dựa trên lịch booking hợp lệ. Khoảng lưu trú dùng quy ước nửa mở `[check-in, check-out)`.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-01]** Ngày check-out phải sau ngày check-in.
* **[BR-02]** Số khách ≤ sức chứa phòng (trừ khi có thêm giường được cấu hình).
* **[BR-03]** Hai booking cùng phòng trùng lịch khi khoảng `[check-in, check-out)` giao nhau và cả hai đang ở trạng thái chiếm chỗ.
* **[BR-05]** Phòng Bảo trì không được trả về trong kết quả tìm kiếm.
* **[AC-03]** Cho phép đặt sát ngày (A checkout D, B checkin D).
* Kiểm tra phải thực hiện ở **backend** (NFR-02, NFR-03).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tìm thấy phòng trống (Happy Path)
* **Given:** Có ít nhất một phòng phù hợp sức chứa và không có booking giao lịch.
* **When:** Khách nhập ngày check-in, check-out hợp lệ và số khách, bấm "Tìm phòng".
* **Then:** Hệ thống trả về danh sách phòng còn trống đúng điều kiện.

### Kịch bản 2: Không có phòng trống
* **Given:** Tất cả phòng phù hợp đều bị chiếm lịch hoặc bảo trì.
* **When:** Khách thực hiện tìm kiếm.
* **Then:** Hệ thống thông báo không còn phòng trống và không trả về phòng sai.

### Kịch bản 3: Ngày không hợp lệ
* **Given:** Khách nhập check-out ≤ check-in.
* **When:** Bấm tìm kiếm.
* **Then:** Hệ thống từ chối và hiển thị lỗi validation.

### Kịch bản 4: Phòng bảo trì không xuất hiện
* **Given:** Một phòng đang ở trạng thái Bảo trì.
* **When:** Khách tìm kiếm trong khoảng ngày đó.
* **Then:** Phòng bảo trì không xuất hiện trong kết quả (AC-07).

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Logic kiểm tra khả dụng (pseudo)
```
Tìm Room WHERE
  capacity >= số_khách
  AND status != 'maintenance'
  AND NOT EXISTS (
    Booking WHERE roomId = Room.id
      AND status IN ('pending','confirmed','checked_in')
      AND checkIn < requestedCheckOut
      AND checkOut > requestedCheckIn
  )
```

### 6.2. API gợi ý
* `GET /api/public/availability?checkIn=...&checkOut=...&guests=...`

### 6.3. Index khuyến nghị
* Index trên `Booking(roomId, checkIn, checkOut, status)`

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Có dữ liệu Room + Booking.
* **Được include bởi:** US04 (Tạo booking online), US06, US07.
