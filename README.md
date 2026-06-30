# Shop Auto Final

Website bán sản phẩm số tự động, thiết kế glassmorphism hiện đại, tối ưu để deploy trên Vercel.

## Tính năng
- Trang chủ sạch, không hiển thị tài khoản ngân hàng
- Danh sách sản phẩm + tìm kiếm + lọc danh mục
- Đăng ký / đăng nhập email mật khẩu
- Đăng nhập Google
- Đăng nhập Apple ID / iCloud qua Firebase OAuth `apple.com`
- Giỏ hàng
- Tạo đơn hàng và sinh QR thanh toán chỉ ở bước checkout
- SePay webhook tự đánh dấu đơn đã thanh toán
- Trang tải file sau thanh toán
- Admin ẩn, chỉ mở nếu user có role `admin` hoặc `owner` trong Firestore
- Quản lý sản phẩm
- Quản lý đơn hàng
- Tạo coupon
- Upload ảnh và file số lên Cloudinary

---

## 1) Cài đặt local

```bash
npm install
npm run dev
```

Mở:
`http://localhost:3000`

---

## 2) Biến môi trường

Copy `.env.example` thành `.env.local` rồi điền giá trị thật.

### Firebase client
Các biến `NEXT_PUBLIC_FIREBASE_*` lấy từ Firebase web app config.

### Firebase Admin
Khuyến nghị dùng 1 biến duy nhất:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Lấy file này từ:
Firebase Console → Project settings → Service accounts → Generate new private key

### Cloudinary
Tạo `unsigned upload preset`:
- Upload → Upload presets
- Unsigned: ON
- Tên preset trùng `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Bank
Các biến:
- `NEXT_PUBLIC_BANK_NAME`
- `NEXT_PUBLIC_BANK_ACCOUNT`
- `NEXT_PUBLIC_BANK_HOLDER`
- `NEXT_PUBLIC_BANK_BIN`

Mặc định trong app:
- MB Bank
- 0333096434
- Lầu A Vang

### SePay
Nếu muốn kiểm tra thêm lớp bảo vệ webhook:
```env
SEPAY_WEBHOOK_SECRET=YOUR_SECRET
```

---

## 3) Cách phân quyền admin

1. Tạo tài khoản bằng trang đăng ký.
2. Mở Firestore.
3. Vào collection `users`.
4. Tìm document theo `uid`.
5. Đổi field `role` thành `admin` hoặc `owner`.

Sau đó user đó mới thấy trang `/admin`.

---

## 4) Luồng hoạt động

1. Khách vào trang chủ và chọn sản phẩm.
2. Thêm vào giỏ hàng.
3. Vào checkout, nhập thông tin và tạo đơn.
4. Website chuyển sang trang QR.
5. Khách chuyển khoản đúng số tiền và đúng nội dung `OD-...`.
6. SePay gọi webhook:
   `POST /api/webhooks/sepay`
7. Đơn đổi sang `paid`.
8. Trang tải file mở link tải của từng sản phẩm.

---

## 5) Cấu hình SePay

Đặt webhook URL:

```text
https://YOUR_DOMAIN/api/webhooks/sepay
```

Nếu dùng secret, gửi thêm header:

```text
x-webhook-secret: YOUR_SECRET
```

Payload SePay cần có nội dung giao dịch chứa mã đơn hàng, ví dụ:

```text
Thanh toan OD-ABC12345
```

Hệ thống sẽ tự dò mã `OD-...` trong payload.

---

## 6) Deploy Vercel

1. Push project lên GitHub.
2. Vào Vercel → Add New Project.
3. Import repository.
4. Thêm toàn bộ biến môi trường trong `Settings → Environment Variables`.
5. Deploy.

Không cần Express, không cần server riêng.

---

## 7) Bảo mật sản phẩm số

- Sản phẩm chỉ được thêm ở admin.
- File tải lưu ở Cloudinary dưới dạng URL riêng cho từng sản phẩm.
- Mã đơn và token tải được sinh riêng khi tạo đơn.
- Trang download chỉ mở khi đơn đã thanh toán hoặc bạn có token hợp lệ.

---

## 8) Gợi ý cấu hình Firebase Auth

Bật:
- Email/Password
- Google
- Sign in with Apple

Với Apple, Firebase cần cấu hình thêm trong console với dịch vụ Apple Developer.
