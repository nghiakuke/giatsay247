# Hướng dẫn đưa dữ liệu form về Google Sheet

Mục tiêu: mỗi lần khách đặt lịch hoặc gửi form liên hệ, một dòng mới tự động được thêm vào Google Sheet.

> Mình không thể tạo Sheet trong tài khoản Google của bạn vì cần đăng nhập. Các bước dưới đây chỉ mất khoảng 5 phút và không cần cài đặt gì.

## Bước 1 — Tạo Google Sheet

1. Mở https://sheets.new
2. Đổi tên file thành **Giặt Sấy 24/7 — Đơn hàng**.
3. Đổi tên tab dưới cùng thành **DonHang** (đúng chữ, không dấu).
4. Vào **Extensions → Apps Script**.

## Bước 2 — Dán code

1. Xóa đoạn code mặc định trong `Code.gs`.
2. Mở file `google-sheet/Code.gs` trong thư mục website.
3. Copy toàn bộ nội dung và dán vào Apps Script.
4. Bấm **Save** (Ctrl/Cmd + S).

## Bước 3 — Tạo tiêu đề cột

1. Trong Apps Script, chọn hàm **setup** ở thanh trên.
2. Bấm **Run**.
3. Google sẽ hỏi quyền → **Review permissions → Choose account → Allow**.
4. Quay lại Sheet, bạn sẽ thấy tab **DonHang** với các cột:
   `Thời gian | Loại form | Họ tên | Số điện thoại | Email | Dịch vụ | Địa chỉ | Ghi chú | Trạng thái | Trang gửi | Nguồn`

## Bước 4 — Deploy Web App

1. Trong Apps Script, bấm **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. Điền:
   - **Description:** `Form Giặt Sấy 24/7`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Bấm **Deploy**.
5. Copy **Web app URL** (dạng `https://script.google.com/macros/s/AKfycb.../exec`).

> Quan trọng: phải chọn **Anyone**, không phải "Anyone with Google account", nếu không khách sẽ không gửi được.

## Bước 5 — Nối vào website

1. Mở file `assets/js/config.js`.
2. Dán URL vừa copy vào giữa hai dấu ngoặc kép:

```js
window.GIATSAY_CONFIG = {
  formEndpoint: "https://script.google.com/macros/s/AKfycb.../exec",
};
```

3. Build lại và đẩy lên GitHub:

```bash
cd /root/workspace/giatsay247
node build.js
```

Sau đó commit/push lên nhánh `main`. GitHub Pages sẽ tự cập nhật.

## Bước 6 — Kiểm tra

1. Mở website, gửi thử form đặt lịch.
2. Mở Google Sheet → tab **DonHang**.
3. Nếu có dòng mới là thành công.

Có thể chạy hàm `testPost()` trong Apps Script để kiểm tra ghi Sheet trước khi thử trên website.

## Khi sửa code Apps Script

Mỗi lần sửa `Code.gs`, cần tạo phiên bản mới:

**Deploy → Manage deployments → biểu tượng bút → Version: New version → Deploy**

Nếu không, Web App vẫn chạy code cũ.

## Nhận email khi có đơn mới (tùy chọn)

Trong `Code.gs`, sửa:

```js
var NOTIFY_EMAIL = "giatsay247@gmail.com";
```

Rồi deploy lại. Mỗi đơn mới sẽ gửi thêm một email. Lưu ý giới hạn gửi mail miễn phí của Google.

## Bảo mật

- URL Web App là công khai; ai biết URL cũng có thể gửi dữ liệu vào Sheet.
- Script chỉ **thêm dòng**, không đọc/sửa dữ liệu cũ.
- Không đặt thông tin nhạy cảm trong `Code.gs`.
- Nếu bị spam, có thể thêm kiểm tra từ khóa, giới hạn số điện thoại hoặc chuyển sang backend có xác thực.

## Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| Gửi form báo thành công nhưng Sheet trống | Chưa deploy đúng quyền **Anyone** | Deploy lại, chọn Who has access: Anyone |
| `Không tìm thấy Google Sheet` | Script tạo độc lập, không phải từ Sheet | Tạo script từ Sheet hoặc điền `SHEET_ID` |
| Dữ liệu vào nhưng thiếu số 0 đầu | Cột SĐT bị định dạng số | Chạy lại `setup()` hoặc đặt định dạng cột D là Text |
| Sửa code nhưng không thay đổi | Chưa tạo deployment version mới | Manage deployments → New version |
| Form vẫn hiện thông báo demo | Chưa dán URL vào `config.js` | Kiểm tra `formEndpoint` và build lại |

## Cấu trúc dữ liệu

| Cột | Nội dung |
|---|---|
| A | Thời gian gửi (dd/MM/yyyy HH:mm:ss) |
| B | `booking` hoặc `contact` |
| C | Họ tên |
| D | Số điện thoại |
| E | Email |
| F | Dịch vụ |
| G | Địa chỉ |
| H | Ghi chú |
| I | Trạng thái mặc định `Mới` |
| J | Trang gửi |
| K | Nguồn (`website`) |

Bạn có thể thêm cột **Đã gọi**, **Hoàn tất**, **Ghi chú nội bộ** bên phải mà không ảnh hưởng script.
