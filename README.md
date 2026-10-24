# StayManager -- Hotel Management & Online Booking System

StayManager là hệ thống **quản lý và đặt phòng khách sạn** dành cho đồ
án học tập, gồm website khách hàng và trang quản trị.

## Chức năng chính

### Khách hàng

-   Xem thông tin khách sạn, phòng, loại phòng, giá, sức chứa và tiện
    nghi.
-   Chọn ngày nhận/trả phòng và kiểm tra phòng trống.
-   Đặt phòng trực tuyến và nhận mã booking.
-   Chọn thanh toán QR chuyển khoản hoặc tiền mặt tại quầy.
-   Xem ưu đãi, áp dụng mã giảm giá và xem số tiền được giảm.
-   Tra cứu booking bằng mã đặt phòng + số điện thoại; xem trạng thái phòng, thanh toán và số tiền còn lại.
-   Gửi yêu cầu hủy booking theo chính sách hiển thị trên website.

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
-   Hỗ trợ phương thức tiền mặt và chuyển khoản QR VietQR khi cấu hình thông tin ngân hàng. QR chỉ tạo thông tin chuyển khoản; bản này chưa có webhook ngân hàng để tự xác nhận tiền về, nên nhân viên cần đối soát và cập nhật thanh toán trong quản trị.

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


## Cập nhật: thanh toán và khuyến mãi website khách hàng

- Website `/hotel.html` hỗ trợ chọn **chuyển khoản QR** hoặc **tiền mặt tại quầy**.
- QR VietQR được tạo khi cấu hình tài khoản nhận tiền qua biến môi trường `BANK_ID`, `BANK_ACCOUNT`, `BANK_NAME`.
- Trạng thái chuyển khoản là chờ xác nhận; cần đối soát giao dịch thực tế trước khi đánh dấu đã thanh toán.
- Quản trị viên có mục **Ưu Đãi & Mã Giảm Giá** để tạo mã, đặt kiểu giảm theo phần trăm/số tiền, mức giảm tối đa, giá trị đơn tối thiểu, thời gian áp dụng và giới hạn lượt dùng.
- Mã khuyến mãi được xác thực lại ở máy chủ trước khi tạo booking. Các API quản trị mã yêu cầu đăng nhập.


### Chính sách hủy hiển thị cho khách

- Hủy trước giờ nhận phòng ít nhất 72 giờ: dự kiến hoàn 100% khoản đã thanh toán.
- Từ 24 đến dưới 72 giờ: dự kiến hoàn 50% khoản đã thanh toán.
- Dưới 24 giờ: không hoàn tiền.

Đây là chính sách mẫu để bạn chỉnh theo quy định thật của khách sạn. Website ghi nhận yêu cầu và tính số tiền dự kiến; nhân viên vẫn cần xác minh và thực hiện hoàn tiền thủ công. Không công bố đây là giao dịch hoàn tiền tự động.


## Bản nâng cấp: luồng đặt phòng, thanh toán và phân quyền

- **Chống đặt trùng:** cả booking từ website khách và booking do nhân viên tạo đều dùng khóa phòng ngắn hạn được lưu trong MongoDB, rồi kiểm tra lại khoảng ngày trước khi tạo đơn. Các trạng thái `cancelled` và `checked_out` không chiếm lịch; đơn `confirmed` và `checked_in` chiếm lịch trong khoảng lưu trú.
- **QR:** website khách hàng kiểm tra định kỳ trạng thái booking. Sau khi nhân viên kiểm tra giao dịch ngân hàng và xác nhận đã nhận tiền trong quản trị, trạng thái trên màn hình đặt phòng sẽ đổi thành **Thanh toán thành công**. Không đánh dấu thành công chỉ vì khách bấm nút.
- **Check-in:** chỉ cho phép check-in trong ngày lưu trú hợp lệ và khi phòng không đang dọn/bảo trì.
- **Check-out:** không tự động ghi nhận tiền đã thu. Nhân viên cần xác nhận khách đã trả số dư thực tế; sau check-out, phòng chuyển sang `cleaning`.
- **Housekeeping:** tài khoản buồng phòng chỉ xem danh sách phòng và xác nhận vệ sinh xong qua endpoint chuyên dụng.
- **Phân quyền:** `admin` quản trị toàn bộ và tạo/khóa tài khoản; `manager` quản lý nghiệp vụ phòng/đặt phòng/dịch vụ/ưu đãi nhưng không quản lý tài khoản; `receptionist` xử lý đặt phòng, khách hàng, thanh toán và check-in/check-out; `housekeeping` chỉ cập nhật vệ sinh. Quyền được kiểm tra ở backend, không chỉ ẩn nút trên giao diện.
- **Tạo tài khoản nhân viên:** đăng nhập bằng admin, mở mục **Tài Khoản & Phân Quyền**, tạo tài khoản với mật khẩu tối thiểu 8 ký tự.

### Lưu ý triển khai thực tế

1. Đổi `ADMIN_PASSWORD` thành mật khẩu mạnh trong `.env`, thay tài khoản ngân hàng mẫu bằng thông tin thật và không commit `.env` lên GitHub.
2. QR VietQR chỉ chứa thông tin chuyển khoản; tự động xác nhận tiền về vẫn cần API/webhook từ ngân hàng hoặc đơn vị thanh toán.
3. Khóa phòng ngăn các yêu cầu đồng thời qua các tiến trình cùng MongoDB trong thời gian tạo booking. Với hệ thống thương mại lớn, nên bổ sung bộ kiểm thử tích hợp, giám sát giao dịch, webhook đã ký, nhật ký kiểm toán và quy trình xử lý sự cố.
4. Đã kiểm tra cú pháp JavaScript của backend, model và script giao diện; cần chạy thử với MongoDB của bạn để xác minh dữ liệu và cấu hình môi trường.

## Tích hợp xác nhận chuyển khoản tự động bằng SePay (MB)

Đã có endpoint `POST /api/payments/sepay-webhook`. Khi SePay báo **tiền vào**, backend kiểm tra API Key, số tài khoản nhận, mã booking trong nội dung `STAY <MÃ_ĐẶT_PHÒNG>`, số tiền còn phải trả và mã giao dịch duy nhất trước khi chuyển `paymentStatus` sang `paid`. Webhook gửi lặp không ghi nhận thanh toán lần hai.

### 1. Đăng ký và kết nối MB với SePay

1. Đăng ký tại https://my.sepay.vn/.
2. Trong Dashboard chọn **Ngân hàng → Kết nối thêm → MB** và làm theo hướng dẫn chính thức của SePay. Chỉ nhập thông tin xác thực/OTP trong trang chính thức của ngân hàng/SePay; không gửi OTP cho người hỗ trợ.
3. Chờ trạng thái tài khoản là hoạt động và kiểm tra nhận được giao dịch tiền vào.

Hướng dẫn chính thức: https://docs.sepay.vn/ket-noi-mb-api.html

### 2. Cấu hình biến môi trường

Sao chép `.env.example` thành `.env` và đặt các giá trị của riêng bạn:

- `BANK_ID=MB`
- `BANK_ACCOUNT=0378116354`
- `BANK_NAME=NGUYEN ANH KHOA`
- `SEPAY_WEBHOOK_API_KEY=` một chuỗi bí mật ngẫu nhiên dài. Dùng cùng giá trị ở bước bảo mật webhook trong Dashboard.
- `MONGODB_URI` trỏ đến database của ứng dụng.

Không commit `.env` lên GitHub và không gửi API Key cho người khác.

### 3. Cần URL HTTPS công khai

SePay không thể gọi `localhost:5500` trên máy của bạn. Khi thử nghiệm, có thể dùng một tunnel HTTPS tạm thời (ví dụ Cloudflare Tunnel hoặc ngrok) trỏ tới cổng 5500; URL webhook sẽ là `https://<domain-tunnel>/api/payments/sepay-webhook`. Khi dùng thật, nên deploy backend lên host có HTTPS ổn định (ví dụ Render) và đặt URL webhook cố định. Không dùng tunnel tạm cho giao dịch thật lâu dài.

### 4. Tạo webhook trên SePay

Vào **Tích hợp → Webhooks → Thêm webhook**:

- Sự kiện: **Có tiền vào**.
- URL: `https://<domain-cua-ban>/api/payments/sepay-webhook` (thay bằng URL HTTPS thật của backend).
- Tài khoản: chọn đúng tài khoản MB đã kết nối.
- Xác thực: **API Key**.
- API Key: nhập đúng giá trị `SEPAY_WEBHOOK_API_KEY` trong môi trường backend.
- Bật gửi lại webhook khi lỗi nếu tùy chọn này có sẵn.

Hướng dẫn webhook: https://developer.sepay.vn/vi/sepay-webhooks/tao-webhook

### 5. Kiểm tra

1. Tạo booking mới, chọn chuyển khoản; QR có nội dung `STAY <MÃ_ĐẶT_PHÒNG>`.
2. Chuyển đúng số tiền vào tài khoản MB đã liên kết.
3. Khi SePay nhận được giao dịch và webhook được gửi tới backend, trang khách sẽ tự kiểm tra trạng thái booking và hiện thông báo thanh toán thành công.
4. Kiểm tra lịch sử giao dịch/webhook trên Dashboard SePay nếu chưa cập nhật.

Lưu ý: code này chỉ tự xác nhận giao dịch khi số tiền nhận được đủ số dư còn phải trả của booking. Giao dịch thiếu tiền được lưu để đối soát nhưng không đánh dấu paid. Phải thử với một giao dịch nhỏ trước khi đưa vào sử dụng thật; trạng thái còn phụ thuộc việc MB đã liên kết và SePay gửi webhook thành công.
