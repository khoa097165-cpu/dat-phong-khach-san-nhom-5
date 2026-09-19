# 1.Tên đồ án: HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN
# 2.HT_SV
**Nguyễn Anh Khoa** - '2606042025'
**Huỳnh Anh Khoa** - '2606042040'
**Lê Nguyễn Bảo Nam** - '2606042023'

# BÀI 5 - HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN / HOMESTAY

## 1. Giới thiệu

Xây dựng hệ thống quản lý và đặt phòng cho khách sạn/homestay.

Hệ thống cho phép khách hàng tìm kiếm phòng, kiểm tra phòng còn trống
theo khoảng thời gian, xem giá phòng và thực hiện đặt phòng.

Hệ thống cũng cần quản lý chính sách hủy phòng và giá phòng thay đổi
theo từng mùa hoặc từng khoảng thời gian.

---

## 2. Mục tiêu

- Quản lý thông tin khách sạn/homestay.
- Quản lý danh sách phòng.
- Kiểm tra phòng trống theo khoảng ngày.
- Cho phép khách hàng đặt phòng.
- Quản lý trạng thái đặt phòng.
- Áp dụng chính sách hủy phòng.
- Tính giá phòng theo mùa/thời gian.
- Tránh tình trạng một phòng được đặt trùng thời gian.

---

## 3. Các chức năng chính

### 3.1. Quản lý phòng

Mỗi phòng có các thông tin:

- Mã phòng
- Tên/số phòng
- Loại phòng
- Sức chứa
- Giá cơ bản
- Trạng thái phòng
- Mô tả

Các trạng thái có thể gồm:

- Trống
- Đang được đặt
- Đang sử dụng
- Bảo trì

---

### 3.2. Tìm kiếm phòng

Khách hàng nhập:

- Ngày nhận phòng
- Ngày trả phòng
- Số lượng khách
- Loại phòng (nếu có)

Hệ thống trả về danh sách các phòng có thể đặt.

Điều kiện:

```text
Ngày nhận phòng < ngày trả phòng
