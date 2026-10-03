# USER STORY: US23 - QUẢN LÝ NHÂN VIÊN / TÀI KHOẢN (MỞ RỘNG)

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US23** |
| **Tên User Story** | Quản lý nhân viên / tài khoản |
| **Phân hệ (Module)** | Phân hệ 7: Mở rộng |
| **Use Case liên quan** | **UC30** |
| **Yêu cầu SRS** | **[FR-41]** |
| **Độ ưu tiên (Priority)** | **Should-Have (Mở rộng)** |
| **Tác nhân chính (Primary Actor)** | Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Admin,
* **Tôi muốn (I want to):** Tạo, khóa/mở khóa và cập nhật tài khoản nhân viên,
* **Để (So that):** Tôi quản lý được đội ngũ sử dụng hệ thống.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Admin tạo tài khoản với vai trò phù hợp. Khóa tài khoản ngăn đăng nhập.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Mật khẩu phải được băm khi lưu.
* Không cho xóa cứng tài khoản đã có lịch sử thao tác quan trọng (ưu tiên khóa).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo tài khoản
* **Given:** Admin đã đăng nhập.
* **When:** Tạo user mới với role và mật khẩu.
* **Then:** Tài khoản được tạo, có thể đăng nhập.

### Kịch bản 2: Khóa tài khoản
* **Given:** User đang hoạt động.
* **When:** Admin khóa.
* **Then:** User không đăng nhập được nữa.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* API: CRUD `/api/users` (chỉ Admin).
* Field `status`: active / locked.

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Liên quan chặt:** US21, US24.
