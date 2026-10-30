/* Build static pages from src/partials + src/pages.
   Run: node build.js
*/
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const layout = read("src/partials/layout.html");
const header = read("src/partials/header.html");
const footer = read("src/partials/footer.html");

const pages = [
  {
    file: "index.html",
    title: "Giặt Sấy 24/7 – Giặt sấy, giặt ủi công nghiệp giao tận nơi TP.HCM",
    desc: "Giặt Sấy 24/7 cung cấp dịch vụ giặt sấy gia đình, giặt sấy dân sinh, giặt ủi công nghiệp, giặt hấp cao cấp và vệ sinh văn phòng tại TP.HCM. Nhận hàng tận nơi, giao trả trong 24h. Hotline 0901 888 759.",
  },
  {
    file: "gioi-thieu.html",
    title: "Giới thiệu Giặt Sấy 24/7 – Đơn vị giặt sấy uy tín tại TP.HCM",
    desc: "Tìm hiểu về Giặt Sấy 24/7: quy trình giặt sấy chuẩn, đội ngũ chuyên nghiệp, máy móc hiện đại và cam kết chất lượng cho khách hàng tại TP.HCM.",
  },
  {
    file: "dich-vu.html",
    title: "Dịch vụ giặt sấy, giặt ủi công nghiệp – Giặt Sấy 24/7",
    desc: "Các dịch vụ của Giặt Sấy 24/7: giặt ủi công nghiệp, giặt hấp giặt khô cao cấp, giặt sấy dân sinh, giặt sấy gia đình và vệ sinh văn phòng tại TP.HCM.",
  },
  {
    file: "bang-gia.html",
    title: "Bảng giá dịch vụ giặt sấy 2026 – Giặt Sấy 24/7",
    desc: "Bảng giá giặt sấy dân sinh, giặt sấy gia đình, giặt ủi công nghiệp, giặt hấp cao cấp tại Giặt Sấy 24/7. Giá minh bạch, không phát sinh, giao nhận tận nơi.",
  },
  {
    file: "tin-tuc.html",
    title: "Tin tức, mẹo hay giặt sấy – Giặt Sấy 24/7",
    desc: "Cẩm nang giặt sấy hữu ích: mẹo tẩy vết bẩn, bảo quản quần áo, kinh nghiệm chọn dịch vụ giặt ủi và tin tức khuyến mãi từ Giặt Sấy 24/7.",
  },
  {
    file: "bai-viet.html",
    title: "5 mẹo giữ quần áo luôn như mới sau mỗi lần giặt – Giặt Sấy 24/7",
    desc: "Bí quyết giữ quần áo bền màu, không xù lông, không biến dạng sau mỗi lần giặt sấy. Hướng dẫn chi tiết từ đội ngũ Giặt Sấy 24/7.",
  },
  {
    file: "lien-he.html",
    title: "Liên hệ đặt lịch giặt sấy – Giặt Sấy 24/7",
    desc: "Liên hệ Giặt Sấy 24/7 qua hotline 0901 888 759, Zalo hoặc form đặt lịch. Địa chỉ, giờ làm việc và chính sách hỗ trợ khách hàng.",
  },
];

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

for (const page of pages) {
  const content = read(path.join("src/pages", page.file));
  const html = layout
    .split("{{TITLE}}").join(escapeHtml(page.title))
    .split("{{DESC}}").join(escapeHtml(page.desc))
    .split("{{HEADER}}").join(header)
    .split("{{FOOTER}}").join(footer)
    .split("{{CONTENT}}").join(content);
  fs.writeFileSync(path.join(root, page.file), html);
  console.log("Built", page.file);
}
