/**
 * Giặt Sấy 24/7 — nhận dữ liệu form và ghi vào Google Sheet
 *
 * Cách dùng nhanh:
 * 1. Tạo Google Sheet mới.
 * 2. Extensions > Apps Script.
 * 3. Dán toàn bộ file này vào Code.gs.
 * 4. Chạy hàm setup() một lần để tạo tiêu đề cột.
 * 5. Deploy > New deployment > Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Copy URL Web App, dán vào assets/js/config.js.
 */

var SHEET_NAME = "DonHang";
var SHEET_ID = ""; // Để trống nếu script được tạo từ Google Sheet (khuyến nghị)
var NOTIFY_EMAIL = ""; // Ví dụ: "giatsay247@gmail.com" nếu muốn nhận email mỗi đơn
var TIMEZONE = "Asia/Ho_Chi_Minh";

var HEADERS = [
  "Thời gian",
  "Loại form",
  "Họ tên",
  "Số điện thoại",
  "Email",
  "Dịch vụ",
  "Địa chỉ",
  "Ghi chú",
  "Trạng thái",
  "Trang gửi",
  "Nguồn",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var data = parseData_(e);
    var sheet = getSheet_();
    ensureHeader_(sheet);

    sheet.appendRow([
      Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy HH:mm:ss"),
      data.formType || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.service || "",
      data.address || "",
      data.note || "",
      "Mới",
      data.page || "",
      data.source || "website",
    ]);

    if (NOTIFY_EMAIL) {
      sendNotification_(data);
    }

    return json_({ ok: true, message: "Đã ghi nhận yêu cầu" });
  } catch (err) {
    return json_({ ok: false, message: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

function doGet() {
  return json_({
    ok: true,
    service: "Giặt Sấy 24/7 — form endpoint",
    sheet: SHEET_NAME,
  });
}

function parseData_(e) {
  if (e && e.postData && /application\/json/i.test(e.postData.type || "")) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignore) {}
  }
  return (e && e.parameter) || {};
}

function getSheet_() {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      "Không tìm thấy Google Sheet. Hãy tạo Apps Script từ Sheet hoặc điền SHEET_ID."
    );
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(HEADERS);
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header
    .setFontWeight("bold")
    .setBackground("#185ca8")
    .setFontColor("#ffffff")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);
  sheet.setColumnWidths(1, HEADERS.length, 150);
  sheet.setColumnWidth(8, 300);
  sheet.setColumnWidth(10, 260);

  // Giữ số điện thoại dạng text để không mất số 0 đầu.
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("E:E").setNumberFormat("@");
}

function sendNotification_(data) {
  var lines = [
    "Có yêu cầu mới từ website Giặt Sấy 24/7",
    "",
    "Loại form: " + (data.formType || ""),
    "Họ tên: " + (data.name || ""),
    "Số điện thoại: " + (data.phone || ""),
    "Email: " + (data.email || ""),
    "Dịch vụ: " + (data.service || ""),
    "Địa chỉ: " + (data.address || ""),
    "Ghi chú: " + (data.note || ""),
    "Trang gửi: " + (data.page || ""),
  ];
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "Đơn mới — " + (data.name || "Khách hàng"),
    body: lines.join("\n"),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Chạy hàm này một lần sau khi dán code để tạo sheet + tiêu đề cột. */
function setup() {
  var sheet = getSheet_();
  ensureHeader_(sheet);
  SpreadsheetApp.getActive().toast(
    'Đã tạo sheet "' + SHEET_NAME + '" và tiêu đề cột.'
  );
}

/** Chạy thử để kiểm tra ghi dữ liệu (sẽ thêm 1 dòng test). */
function testPost() {
  var result = doPost({
    parameter: {
      formType: "test",
      name: "Khách test",
      phone: "0901888759",
      email: "test@example.com",
      service: "Giặt sấy gia đình",
      address: "TP.HCM",
      note: "Dòng kiểm tra từ Apps Script",
      page: "Apps Script editor",
      source: "test",
    },
  });
  Logger.log(result.getContent());
}
