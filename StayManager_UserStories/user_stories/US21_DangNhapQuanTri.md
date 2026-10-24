# USER STORY: US21 - ĐĂNG NHẬP TRANG QUẢN TRỊ

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US21** |
| **Tên User Story** | Đăng nhập trang quản trị |
| **Phân hệ (Module)** | Phân hệ 6: Dashboard – Báo cáo – Hệ thống |
| **Use Case liên quan** | **UC28** |
| **Yêu cầu SRS** | **[FR-40][FR-43]**, NFR-04, NFR-05, AC-11 |
| **Độ ưu tiên (Priority)** | **Must-Have (MVP 1)** |
| **Tác nhân chính (Primary Actor)** | Tất cả nhân viên (Admin, Quản lý, Lễ tân, Housekeeping) |
| **Tác nhân phụ (Secondary Actor)** | — |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Nhân viên quản trị,
* **Tôi muốn (I want to):** Đăng nhập vào trang quản trị bằng tài khoản được cấp,
* **Để (So that):** Tôi truy cập được các chức năng nội bộ theo đúng quyền hạn.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Mọi API quản trị phải kiểm tra JWT/token và quyền phía server, không chỉ ẩn nút trên UI (FR-43, AC-11).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* Mật khẩu phải được băm (bcrypt hoặc tương đương) – NFR-04.
* Token/session có thời hạn.
* Người chưa đăng nhập hoặc không đủ quyền bị từ chối ở server (AC-11).

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Đăng nhập thành công
* **Given:** Tài khoản hợp lệ và đang hoạt động.
* **When:** Nhập đúng email/username + mật khẩu.
* **Then:** Nhận token và chuyển vào dashboard/trang chính theo vai trò.

### Kịch bản 2: Chặn truy cập không đăng nhập
* **Given:** Chưa có token.
* **When:** Gọi API quản trị.
* **Then:** Trả về 401 Unauthorized (AC-11).

### Kịch bản 3: Không đủ quyền
* **Given:** Đã đăng nhập với vai trò Housekeeping.
* **When:** Gọi API chỉ dành cho Admin.
* **Then:** Trả về 403 Forbidden.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

* Schema `User`: email/username, passwordHash, role, status, name...
* API: `POST /api/auth/login`, middleware `authenticate` + `authorize(roles)`.
* JWT secret lưu trong biến môi trường (NFR-14).

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Là tiền đề bắt buộc** cho hầu hết US quản trị (US06 → US24).
