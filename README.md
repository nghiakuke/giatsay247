# Giặt Sấy 24/7 — Website dịch vụ giặt sấy

Website tĩnh tiếng Việt cho dịch vụ giặt sấy, giao nhận tận nơi.

## Website đang chạy

- **GitHub Pages:** https://nghiakuke.github.io/giatsay247/
- **Mã nguồn:** https://github.com/nghiakuke/giatsay247

> Form đặt lịch/liên hệ hiện chỉ kiểm tra dữ liệu và hiện thông báo trên trình duyệt, chưa gửi về server. Muốn nhận đơn thật, cần nối form với Formspree, Google Apps Script hoặc backend riêng.

## Thông tin thương hiệu

- Tên: **Giặt Sấy 24/7**
- Hotline / Zalo: **0901 888 759** (`tel:0901888759`, `https://zalo.me/0901888759`)
- Email: giatsay247@gmail.com
- Khu vực: TP.HCM

## Xem website

Chạy một server tĩnh tại thư mục này:

```bash
cd giatsay247
python3 -m http.server 4173
```

Mở `http://127.0.0.1:4173/`.

Có thể mở trực tiếp `index.html` bằng trình duyệt, nhưng nên dùng server để đường dẫn và form hoạt động ổn định.

## Cấu trúc

```
giatsay247/
├── index.html          # Trang chủ
├── gioi-thieu.html     # Giới thiệu
├── dich-vu.html        # Dịch vụ
├── bang-gia.html       # Bảng giá
├── tin-tuc.html        # Tin tức / blog
├── bai-viet.html       # Bài viết mẫu
├── lien-he.html        # Liên hệ
├── build.js            # Build HTML từ src/
├── src/
│   ├── partials/       # layout, header, footer dùng chung
│   └── pages/          # nội dung từng trang
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/            # ảnh, logo, favicon
```

## Chỉnh sửa nội dung

1. Sửa file trong `src/pages/` hoặc `src/partials/`.
2. Chạy build lại:

```bash
node build.js
```

CSS và JS được tham chiếu trực tiếp nên không cần build lại khi chỉ sửa `assets/`.

## Tính năng

- Hero slider, menu mobile, hiệu ứng reveal, đếm số.
- Bảng giá dạng tab, FAQ accordion.
- Lọc bài viết theo danh mục (hỗ trợ `?cat=...`).
- Modal đặt lịch, kiểm tra số điện thoại, toast thông báo.
- Nút gọi / Zalo / đặt lịch nổi, back-to-top.
- Responsive cho desktop, tablet và mobile.
