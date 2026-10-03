# USER STORY: US24 - PHÂN QUYỀN VAI TRÒ (MỞ RỘNG)

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US24** |
| **Tên User Story** | Phân quyền theo vai trò (RBAC) |
| **Phân hệ (Module)** | Phân hệ 7: Mở rộng |
| **Use Case liên quan** | **UC31** |
| **Yêu cầu SRS** | **[FR-42][FR-43]** |
| **Độ ưu tiên (Priority)** | **Should-Have (Mở rộng)** |
| **Tác nhân chính (Primary Actor)** | Admin |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Admin,
* **Tôi muốn (I want to):** Cấu hình phân quyền theo vai trò Admin, Quản lý, Lễ tân, Housekeeping,
* **Để (So that):** Mỗi loại nhân viên chỉ truy cập được chức năng phù hợp với công việc.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

RBAC cơ bản:
- Admin: toàn quyền
- Quản lý: phòng, booking, dashboard, báo cáo, cài đặt
- Lễ tân: booking, khách hàng, check-in/out, dịch vụ, thanh toán
- Housekeeping: xem & xác nhận vệ sinh phòng

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* API phải kiểm tra quyền phía server (FR-43).
* Thay đổi role có hiệu lực với request tiếp theo.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Phân quyền đúng
* **Given:** User role = Housekeeping.
* **When:** Gọi API quản lý phòng.
* **Then:** Bị từ chối 403.

### Kịch bản 2: Admin toàn quyền
* **Given:** User role = Admin.
* **When:** Truy cập mọi chức năng quản trị.
* **Then:** Được phép.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Middleware `authorize('admin', 'manager')`...
* Role lưu trong User schema hoặc bảng Role riêng (nếu mở rộng).

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Phụ thuộc:** US21, US23.
