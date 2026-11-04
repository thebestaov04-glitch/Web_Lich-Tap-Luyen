# Nhịp Võ — Lịch tập cá nhân

## Thông tin người thực hiện và dự án

- **Người thực hiện:** Aru (theo tên tác giả trong lịch sử Git của dự án).
- **Tên dự án:** Web_Lich-Tap-Luyen, giao diện mang tên **Nhịp Võ**.
- **Mục đích:** Hỗ trợ người tập Taekwondo tự lập lịch, ghi nhận quá trình tập luyện và theo dõi một số thông tin dinh dưỡng.
- **Công nghệ:** HTML, CSS và JavaScript thuần.
- **Cách lưu dữ liệu:** Lưu trên trình duyệt bằng `localStorage`; có chức năng xuất và nhập dữ liệu JSON.
- **Tài khoản và máy chủ:** Trong mã nguồn hiện có, ứng dụng không yêu cầu đăng nhập và không có máy chủ lưu dữ liệu.

---

## 1. Sản phẩm này là gì?

**Nhịp Võ** là ứng dụng web hỗ trợ tập luyện Taekwondo cá nhân. Ứng dụng kết hợp lịch tập, bài tập, nhật ký hoàn thành, đồng hồ hiệp, thông tin dinh dưỡng và thống kê tiến độ trong một giao diện.

Ứng dụng phù hợp với người muốn tự sắp xếp lịch và ghi lại quá trình tập trên trình duyệt của mình.

## 2. Demo

Hiện chưa thấy liên kết demo trực tuyến trong dự án. Có thể xem giao diện bằng cách mở `index.html` trong trình duyệt hoặc chạy ứng dụng trên máy tính theo hướng dẫn ở mục 4.

## 3. Tính năng hiện có

### Hồ sơ học viên

Mở mục **Hồ sơ** hoặc nút **Hồ sơ học viên**, rồi nhập mã học viên, họ tên, ngày sinh và cấp đai. Có thể thêm ảnh cá nhân. Thông tin hồ sơ được lưu trên trình duyệt hiện tại.

### Tổng quan

Trang **Tổng quan** hiển thị kế hoạch gần nhất, nhịp tập trong tuần và các thông tin tiến độ. Có thể chọn nhanh ngày trong tuần hoặc chuyển sang lịch tập, theo dõi và đồng hồ hiệp.

### Lịch tập

Vào mục **Lịch tập** để chọn số buổi mỗi tuần, mục tiêu, trình độ, thời lượng và ngày ưu tiên. Chọn **Tự động tạo lịch** để tạo kế hoạch, sau đó có thể thêm buổi hoặc tùy chỉnh bài tập.

Trong phần thêm bài tập, chọn buổi tập, nhập tên bài, loại bài, số hiệp, thời gian, số lần lặp, thời gian nghỉ và ghi chú. Có thể chọn bài từ thư viện có sẵn hoặc tạo bài riêng.

### Theo dõi buổi tập

Vào **Theo dõi**, chọn chế độ ngày, tuần, tháng hoặc năm để xem lịch sử. Chọn ngày cần ghi nhận, đánh dấu buổi tập hoàn thành hoặc bỏ đánh dấu. Có thể ghi chú kết quả và nhận xét sau buổi sparring.

### Đồng hồ hiệp

Vào **Đồng hồ hiệp**, chọn cài đặt có sẵn cho Taekwondo, Boxing hoặc Tabata; cũng có thể tự chỉnh thời gian khởi động, hiệp, nghỉ và số hiệp. Dùng các nút **Bắt đầu**, **Bỏ qua** và **Làm lại** để điều khiển đồng hồ. Âm thanh và rung có thể bật hoặc tắt trong phần cài đặt.

### Dinh dưỡng

Trong mục **Dinh dưỡng**, nhập chiều cao, cân nặng, tuổi, giới tính, mức vận động và mục tiêu để xem ước tính năng lượng. Chọn món ăn, khẩu phần và bữa ăn để ghi nhật ký; có thể thêm món tự tạo, ghi lượng nước uống và cập nhật cân nặng.

### Thống kê

Mục **Thống kê** tổng hợp dữ liệu đã ghi nhận như buổi tập, thời lượng tập, chuỗi ngày tập và hoạt động sparring. Có thể đổi khoảng thời gian để xem dữ liệu theo các mốc khác nhau.

### Giao diện và sao lưu

Dùng các nút ở thanh trên cùng để đổi màu chủ đạo, giao diện sáng/tối và cỡ chữ. Nút xuất dữ liệu tạo tệp JSON dự phòng; nút nhập dữ liệu dùng để khôi phục từ tệp JSON.

## 4. Cách mở hoặc chạy thử

Ứng dụng không có bước cài đặt thư viện riêng trong các tệp hiện có.

1. Tải hoặc sao chép thư mục dự án về máy.
2. Mở `index.html` bằng trình duyệt để xem ứng dụng.
3. Nếu dùng VS Code, có thể mở thư mục dự án và chạy bằng tiện ích **Live Server** để xem qua địa chỉ cục bộ.

Để dữ liệu được lưu ổn định hơn trong lúc sử dụng, nên chạy ứng dụng qua máy chủ web cục bộ thay vì mở trực tiếp tệp. Dữ liệu vẫn gắn với trình duyệt và thiết bị đang dùng.

## 5. Cấu trúc thư mục

```text
Web_Lich-Tap-Luyen/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── taekwondo-belt.svg
    └── world-taekwondo.png
```

- `index.html`: Cấu trúc giao diện và các khu vực chức năng.
- `style.css`: Màu sắc, bố cục và kiểu hiển thị.
- `script.js`: Xử lý chức năng, dữ liệu và tương tác.
- `assets/`: Hình ảnh và biểu tượng được dùng trong giao diện.
- `README.md`: Tài liệu giới thiệu dự án.

## 6. Đã kiểm tra

Đã rà soát cấu trúc thư mục và mã nguồn để xác định các khu vực chức năng, cách lưu dữ liệu trên trình duyệt và chức năng nhập/xuất JSON.

Chưa chạy thử giao diện trên trình duyệt hoặc kiểm thử tự động trong lần rà soát này.

## 7. Giới hạn / Chưa kiểm tra

- Dữ liệu lưu trong trình duyệt hiện tại; không tự đồng bộ giữa các thiết bị hoặc trình duyệt. Nên xuất tệp JSON để sao lưu.
- Chưa thấy đăng nhập, máy chủ lưu trữ, hoặc đường dẫn demo trực tuyến trong dự án.
- Số liệu thực phẩm và năng lượng là ước tính tham khảo, không thay thế tư vấn dinh dưỡng hoặc y tế.
- Tính năng rung và giữ màn hình sáng phụ thuộc vào trình duyệt và thiết bị.
- Chưa xác định giấy phép hoặc nguồn gốc của các tệp hình ảnh trong `assets/`.

## 8. Nguồn và khai báo AI (nếu có)

- **Mã nguồn:** Các tệp HTML, CSS và JavaScript trong dự án.
- **Tài nguyên giao diện:** `assets/taekwondo-belt.svg` và `assets/world-taekwondo.png`. Cần bổ sung nguồn hoặc giấy phép sử dụng nếu đã biết.
- **AI trong ứng dụng:** Qua rà soát mã nguồn, chưa thấy ứng dụng tích hợp API hoặc tính năng AI.
- **AI hỗ trợ phát triển:** AI hỗ trợ xây dựng trang Web chỉnh sửa hình ảnh, bố cục trong trang Web.
