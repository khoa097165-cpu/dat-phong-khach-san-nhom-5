# DANH MỤC CÁC USER STORY (AGILE USER STORIES)

## HỆ THỐNG QUẢN LÝ & ĐẶT PHÒNG KHÁCH SẠN (STAYMANAGER)

**Chủ đề trọng tâm:** Đặt phòng online – Quản lý booking – Check-in/Check-out – Housekeeping – Dashboard  
**Tài liệu cơ sở:** [srs.md](../attachments/srs.md)  
**Phiên bản:** 1.0  
**Ngày lập:** 03/10/2026  

---

## 1. TỔNG QUAN HỆ THỐNG USER STORIES

Hệ thống User Story được thiết kế chuẩn mực theo phương pháp Agile/Scrum, đóng vai trò làm cầu nối giữa các yêu cầu nghiệp vụ chuyên sâu trong tài liệu SRS với đội ngũ phát triển phần mềm (Developers) và đội ngũ kiểm thử chất lượng (QA/QC).

Mỗi User Story được tổ chức thành một file Markdown độc lập trong thư mục `user_stories/`, tuân thủ cấu trúc chuẩn:

1. **Thông tin chung (Metadata):** Mã US, Tên, Phân hệ, Mức độ ưu tiên (MoSCoW), Tác nhân, Trạng thái.
2. **Nội dung User Story (Story Statement):** Định dạng *As a... / I want to... / So that...*
3. **Bối cảnh & Nghiệp vụ thực tế (Business Context).**
4. **Quy tắc nghiệp vụ & Thuật toán (Business Rules & Algorithms).**
5. **Tiêu chí nghiệm thu (Acceptance Criteria - AC):** Kịch bản kiểm thử chuẩn BDD/Gherkin (*Given - When - Then*).
6. **Đặc tả kỹ thuật & CSDL liên quan (Technical & Data Specs):** Schema CSDL, Pseudo-code, NFR, UI/UX shortcuts.
7. **Truy vết & Điều kiện phụ thuộc (Traceability & Dependencies).**

---

## 2. MA TRẬN TRUY VẾT YÊU CẦU (TRACEABILITY MATRIX)

Bảng đối chiếu 1-1 giữa User Stories với Use Case và Yêu cầu chức năng (SRS.md):

| Mã US | Tên User Story | Phân hệ | Use Case | Yêu cầu SRS | Tác nhân chính | File chi tiết |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **US01** | Xem thông tin khách sạn | Website KH | UC01 | **[FR-01]** | Khách hàng | [US01_XemThongTinKhachSan.md](US01_XemThongTinKhachSan.md) |
| **US02** | Xem danh sách phòng / loại phòng | Website KH | UC02 | **[FR-02]** | Khách hàng | [US02_XemDanhSachPhong.md](US02_XemDanhSachPhong.md) |
| **US03** | Kiểm tra phòng trống | Website KH | UC03 | **[FR-03]** | Khách hàng | [US03_KiemTraPhongTrong.md](US03_KiemTraPhongTrong.md) |
| **US04** | Tạo booking trực tuyến | Website KH | UC04 | **[FR-04][FR-05]** | Khách hàng | [US04_TaoBookingTrucTuyen.md](US04_TaoBookingTrucTuyen.md) |
| **US05** | Tra cứu booking | Website KH | UC05 | **[FR-06]** | Khách hàng | [US05_TraCuuBooking.md](US05_TraCuuBooking.md) |
| **US06** | Tạo booking tại trang quản trị | Booking | UC06 | **[FR-07]** | Lễ tân / Quản lý | [US06_TaoBookingTaiQuanTri.md](US06_TaoBookingTaiQuanTri.md) |
| **US07** | Cập nhật booking | Booking | UC07 | **[FR-08][FR-09]** | Lễ tân / Quản lý | [US07_CapNhatBooking.md](US07_CapNhatBooking.md) |
| **US08** | Tìm kiếm booking | Booking | UC08 | **[FR-10]** | Lễ tân / Quản lý | [US08_TimKiemBooking.md](US08_TimKiemBooking.md) |
| **US09** | Quản lý trạng thái booking | Booking | UC09 | **[FR-11][FR-12]** | Lễ tân / Quản lý | [US09_QuanLyTrangThaiBooking.md](US09_QuanLyTrangThaiBooking.md) |
| **US10** | Xem lịch phòng | Booking | UC10 | **[FR-13][FR-14]** | Lễ tân / Quản lý | [US10_XemLichPhong.md](US10_XemLichPhong.md) |
| **US11** | Check-in | Check-in/out | UC11 | **[FR-15][FR-16]** | Lễ tân | [US11_CheckIn.md](US11_CheckIn.md) |
| **US12** | Check-out & Tính tiền | Check-in/out | UC12 | **[FR-17][FR-18]** | Lễ tân | [US12_CheckOutTinhTien.md](US12_CheckOutTinhTien.md) |
| **US13** | Quản lý phòng | Phòng | UC13 | **[FR-19][FR-20][FR-21][FR-23]** | Quản lý / Admin | [US13_QuanLyPhong.md](US13_QuanLyPhong.md) |
| **US14** | Quản lý loại phòng | Phòng | UC14 | **[FR-22]** | Quản lý / Admin | [US14_QuanLyLoaiPhong.md](US14_QuanLyLoaiPhong.md) |
| **US15** | Housekeeping – Vệ sinh phòng | Housekeeping | UC16-17 | **[FR-24][FR-25]** | Housekeeping | [US15_Housekeeping.md](US15_Housekeeping.md) |
| **US16** | Quản lý khách hàng | Khách hàng | UC18-19 | **[FR-26][FR-27][FR-28]** | Lễ tân / Quản lý | [US16_QuanLyKhachHang.md](US16_QuanLyKhachHang.md) |
| **US17** | Dịch vụ và phụ thu | Dịch vụ | UC20-21 | **[FR-29][FR-30][FR-31]** | Lễ tân / Quản lý | [US17_DichVuVaPhuThu.md](US17_DichVuVaPhuThu.md) |
| **US18** | Thanh toán và hóa đơn | Thanh toán | UC22-24 | **[FR-32][FR-33][FR-34][FR-35]** | Lễ tân | [US18_ThanhToanVaHoaDon.md](US18_ThanhToanVaHoaDon.md) |
| **US19** | Dashboard tổng quan | Báo cáo | UC25 | **[FR-36][FR-37]** | Quản lý / Admin | [US19_Dashboard.md](US19_Dashboard.md) |
| **US20** | Báo cáo và biểu đồ doanh thu | Báo cáo | UC26-27 | **[FR-38][FR-39]** | Quản lý / Admin | [US20_BaoCaoVaBieuDo.md](US20_BaoCaoVaBieuDo.md) |
| **US21** | Đăng nhập trang quản trị | Hệ thống | UC28 | **[FR-40][FR-43]** | Tất cả nhân viên | [US21_DangNhapQuanTri.md](US21_DangNhapQuanTri.md) |
| **US22** | Cài đặt khách sạn | Hệ thống | UC29 | **[FR-46]** | Admin / Quản lý | [US22_CaiDatKhachSan.md](US22_CaiDatKhachSan.md) |
| **US23** | Quản lý nhân viên / tài khoản | Hệ thống | UC30 | **[FR-41]** | Admin | [US23_QuanLyNhanVien.md](US23_QuanLyNhanVien.md) |
| **US24** | Phân quyền vai trò | Hệ thống | UC31 | **[FR-42]** | Admin | [US24_PhanQuyenVaiTro.md](US24_PhanQuyenVaiTro.md) |
| **US25** | Giá theo thời điểm | Mở rộng | - | **[FR-44]** | Quản lý | [US25_GiaTheoThoiDiem.md](US25_GiaTheoThoiDiem.md) |
| **US26** | Mã giảm giá | Mở rộng | - | **[FR-45]** | Quản lý | [US26_MaGiamGia.md](US26_MaGiamGia.md) |

---

## 3. PHÂN BỔ THEO PHÂN HỆ CHỨC NĂNG

```
HỆ THỐNG STAYMANAGER (Hotel Management & Online Booking)
├── Phân hệ 1: Website Khách hàng
│   ├── US01: Xem thông tin khách sạn
│   ├── US02: Xem danh sách phòng / loại phòng
│   ├── US03: Kiểm tra phòng trống
│   ├── US04: Tạo booking trực tuyến
│   └── US05: Tra cứu booking
├── Phân hệ 2: Quản lý Booking & Lịch phòng
│   ├── US06: Tạo booking tại trang quản trị
│   ├── US07: Cập nhật booking
│   ├── US08: Tìm kiếm booking
│   ├── US09: Quản lý trạng thái booking
│   └── US10: Xem lịch phòng
├── Phân hệ 3: Check-in / Check-out
│   ├── US11: Check-in
│   └── US12: Check-out & Tính tiền
├── Phân hệ 4: Quản lý Phòng & Housekeeping
│   ├── US13: Quản lý phòng
│   ├── US14: Quản lý loại phòng
│   └── US15: Housekeeping – Vệ sinh phòng
├── Phân hệ 5: Khách hàng – Dịch vụ – Thanh toán
│   ├── US16: Quản lý khách hàng
│   ├── US17: Dịch vụ và phụ thu
│   └── US18: Thanh toán và hóa đơn
├── Phân hệ 6: Dashboard – Báo cáo – Hệ thống
│   ├── US19: Dashboard tổng quan
│   ├── US20: Báo cáo và biểu đồ doanh thu
│   ├── US21: Đăng nhập trang quản trị
│   └── US22: Cài đặt khách sạn
└── Phân hệ 7: Mở rộng (Should / Could Have)
    ├── US23: Quản lý nhân viên / tài khoản
    ├── US24: Phân quyền vai trò
    ├── US25: Giá theo thời điểm
    └── US26: Mã giảm giá
```

---

## 4. MA TRẬN TÁC NHÂN VS USER STORY

| User Story | Khách hàng | Lễ tân | Housekeeping | Quản lý | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **US01** | **Chính** | | | | |
| **US02** | **Chính** | | | | |
| **US03** | **Chính** | | | | |
| **US04** | **Chính** | | | | |
| **US05** | **Chính** | | | | |
| **US06** | | **Chính** | | Chính | Toàn quyền |
| **US07** | | **Chính** | | Chính | Toàn quyền |
| **US08** | | **Chính** | | Chính | Toàn quyền |
| **US09** | | **Chính** | | Chính | Toàn quyền |
| **US10** | | **Chính** | | Chính | Toàn quyền |
| **US11** | | **Chính** | | Chính | Toàn quyền |
| **US12** | | **Chính** | | Chính | Toàn quyền |
| **US13** | | | | **Chính** | **Chính** |
| **US14** | | | | **Chính** | **Chính** |
| **US15** | | Hỗ trợ | **Chính** | Giám sát | Toàn quyền |
| **US16** | | **Chính** | | Chính | Toàn quyền |
| **US17** | | **Chính** | | Chính | Toàn quyền |
| **US18** | | **Chính** | | Chính | Toàn quyền |
| **US19** | | | | **Chính** | **Chính** |
| **US20** | | | | **Chính** | **Chính** |
| **US21** | | **Chính** | **Chính** | **Chính** | **Chính** |
| **US22** | | | | Chính | **Chính** |
| **US23** | | | | | **Chính** |
| **US24** | | | | | **Chính** |
| **US25** | | | | **Chính** | **Chính** |
| **US26** | Áp dụng | | | **Chính** | **Chính** |

---

## 5. ƯU TIÊN TRIỂN KHAI (THEO SRS MỤC 11)

| Giai đoạn | Nội dung | User Stories |
| :--- | :--- | :--- |
| **MVP 1** | Room Type, Room, Customer, Availability, Booking, mã booking, tra cứu | US01–US05, US13–US14, US16, US21 |
| **MVP 2** | Lịch phòng, quản trị booking, check-in/out, dịch vụ/phụ thu, thanh toán | US06–US12, US17–US18 |
| **MVP 3** | Housekeeping, dashboard, báo cáo, cài đặt khách sạn | US15, US19–US20, US22 |
| **Mở rộng** | RBAC chi tiết, giá động, mã giảm giá | US23–US26 |
