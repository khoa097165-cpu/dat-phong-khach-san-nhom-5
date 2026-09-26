# Danh Sách Sinh Viên:
1. Nguyễn Anh Khoa MSSV:2606042025
2. Huỳnh Anh Khoa MSSV: 2606042040
3. Lê Nguyễn Bảo Nam MSSV:2606042023

# Tên Đề Tài: Đặt Phòng Khách Sạn

# StayManager -- Hotel Management & Online Booking System

StayManager là hệ thống **quản lý và đặt phòng khách sạn** dành cho đồ
án học tập, gồm website khách hàng và trang quản trị.

## Chức năng chính

### Khách hàng

-   Xem thông tin khách sạn, phòng, loại phòng, giá, sức chứa và tiện
    nghi.
-   Chọn ngày nhận/trả phòng và kiểm tra phòng trống.
-   Đặt phòng trực tuyến và nhận mã booking.
-   Tra cứu thông tin đặt phòng.

### Booking

-   Tạo và quản lý booking.
-   Quản lý ngày check-in/check-out, số khách, tiền cọc và ghi chú.
-   Kiểm tra trùng lịch phòng.
-   Tìm booking theo tên, số điện thoại hoặc số phòng.
-   Trạng thái: Chờ xác nhận, Đã xác nhận, Đã check-in, Đã check-out, Đã
    hủy.

### Lịch phòng

-   Theo dõi phòng trống, phòng đã đặt và phòng đang có khách theo ngày.

### Check-in / Check-out

-   Xác nhận khách đến và cập nhật trạng thái phòng.
-   Khi trả phòng, tính: **Tiền phòng + Dịch vụ + Phụ thu - Giảm giá -
    Tiền cọc = Còn phải thanh toán**.
-   Sau check-out, phòng chuyển sang trạng thái cần dọn.

### Quản lý phòng

-   Số phòng, loại phòng, giá, sức chứa, số giường, tầng, tiện nghi và
    trạng thái.
-   Trạng thái: Sẵn sàng, Đã đặt, Đang có khách, Đang dọn, Bảo trì.

### Housekeeping

-   Danh sách phòng cần vệ sinh.
-   Xác nhận đã dọn xong để đưa phòng về trạng thái sẵn sàng.

### Khách hàng

-   Họ tên, điện thoại, email, địa chỉ, CCCD/Hộ chiếu.
-   Lịch sử booking và lưu trú.

### Dịch vụ & phụ thu

-   Ăn sáng, minibar, giặt ủi, thuê xe, đưa đón, thêm giường, check-in
    sớm, check-out muộn.
-   Chi phí dịch vụ được cộng vào booking.

### Thanh toán & hóa đơn

-   Quản lý tiền phòng, dịch vụ, phụ thu, giảm giá, tiền cọc, đã thanh
    toán và còn lại.
-   Có thể mở rộng thanh toán bằng tiền mặt, chuyển khoản và thẻ.

### Dashboard & báo cáo

-   Doanh thu, tỷ lệ lấp đầy, tổng booking.
-   Phòng đang có khách, phòng trống, phòng cần dọn, phòng bảo trì.
-   Khách đến/trả phòng hôm nay, booking gần đây và biểu đồ doanh thu.
-   Báo cáo doanh thu, booking, tỷ lệ lấp đầy và tình trạng phòng.

### Nhân viên & phân quyền

Có thể mở rộng các vai trò: - **Admin:** toàn quyền. - **Quản lý:**
phòng, booking, báo cáo. - **Lễ tân:** booking, check-in/out, thanh
toán. - **Housekeeping:** cập nhật vệ sinh phòng.

### Giá & khuyến mãi

Có thể mở rộng giá ngày thường, cuối tuần, mùa cao điểm, ngày lễ và mã
giảm giá.

### Cài đặt khách sạn

Tên, địa chỉ, điện thoại, email, giờ check-in/out, chính sách, thuế và
thông tin hóa đơn.

## Công nghệ

**Frontend:** HTML, Tailwind CSS, JavaScript, Alpine.js, Chart.js\
**Backend:** Node.js, Express.js\
**Database:** MongoDB, Mongoose, MongoDB Atlas\
**Deployment:** Render\
**Version Control:** GitHub

## Cài đặt

Yêu cầu Node.js, npm và MongoDB/MongoDB Atlas.

Cài dependencies:

    npm install

Tạo file `.env`:

    MONGODB_URI=your_mongodb_connection_string
    PORT=5500
    ADMIN_USER=your_admin_username
    ADMIN_PASSWORD=your_admin_password

> Không đưa file `.env` chứa thông tin thật lên GitHub.

Chạy project:

    node server.js

Trang quản trị:

    http://localhost:5500

Website khách hàng:

    http://localhost:5500/hotel.html

## Cấu trúc project

    StayManager/
    ├── model/
    ├── public/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .env
    ├── .env.example
    └── README.md

## Luồng nghiệp vụ

    Khách xem phòng
        ↓
    Chọn ngày lưu trú
        ↓
    Kiểm tra phòng trống
        ↓
    Đặt phòng
        ↓
    Lưu booking vào MongoDB
        ↓
    Lễ tân xác nhận
        ↓
    Check-in
        ↓
    Sử dụng dịch vụ
        ↓
    Thanh toán
        ↓
    Check-out
        ↓
    Housekeeping
        ↓
    Phòng sẵn sàng

## Mục tiêu đồ án

StayManager mô phỏng quy trình vận hành cơ bản của khách sạn từ đặt
phòng đến check-in, dịch vụ, thanh toán, check-out, housekeeping và báo
cáo. Project giúp thực hành giao diện web, REST API, Node.js/Express,
MongoDB/Mongoose, quản lý dữ liệu và triển khai ứng dụng.
