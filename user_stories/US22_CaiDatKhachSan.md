# USER STORY: US22 - CÀI ĐẶT KHÁCH SẠN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US22** |
| **Tên User Story** | Cài đặt thông tin khách sạn |
| **Phân hệ (Module)** | Phân hệ 6: Dashboard – Báo cáo – Hệ thống |
| **Use Case liên quan** | **UC29** |
| **Yêu cầu SRS** | **[FR-46]** |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 3)** |
| **Tác nhân chính (Primary Actor)** | Admin / Quản lý |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Admin,
* **Tôi muốn (I want to):** Cấu hình tên, địa chỉ, điện thoại, email, giờ check-in/out, chính sách, thuế và thông tin hóa đơn,
* **Để (So that):** Hệ thống hiển thị đúng thông tin công khai và dùng cho nghiệp vụ xuất hóa đơn.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

`HotelSetting` là bản ghi cấu hình duy nhất. Thay đổi sẽ phản ánh ngay trên website khách hàng (US01).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Chỉ Admin/Quản lý có quyền thay đổi.
* Các trường quan trọng không được để trống.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Cập nhật thành công
* **Given:** Admin đã đăng nhập.
* **When:** Sửa thông tin và lưu.
* **Then:** Dữ liệu được cập nhật và hiển thị đúng trên trang công khai.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `HotelSetting` (singleton).
* API: `GET /api/settings`, `PUT /api/settings` (JWT + role Admin/Manager).

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Ảnh hưởng trực tiếp:** US01.
