# LTW – Bài thực hành 03 (N1): Sổ chi tiêu cá nhân

Bài thực hành React gồm **Phần A (Class Component)** và **Phần B (Function Component + Hooks)**, không dùng React Router, Redux, hay thư viện UI.


## 1. Cấu trúc

```text
LTW-BaiThucHanh03/
├── part-a-class/         # Ứng dụng Class Component (cổng 5173)
├── part-b-hooks/         # Ứng dụng Function Component (cổng 5174)
└── README.md
```

## 2. Cài đặt và chạy (Windows + VS Code)

Yêu cầu: Node.js phiên bản 18+ và npm, VS Code.

**Chạy Phần A** (Terminal thứ nhất):

```bash
cd part-a-class
npm install
npm run dev
```

Mở **http://localhost:5173/**.

**Chạy Phần B** (Terminal thứ hai, trở lại thư mục gốc trước):

```bash
cd part-b-hooks
npm install
npm run dev
```

Mở **http://localhost:5174/**. Nếu bạn đang đứng trong `part-a-class`, hãy chạy `cd ..` trước khi vào `part-b-hooks`.

> Nếu Vite báo cổng đang dùng, có thể tự chọn cổng khác; dùng địa chỉ hiển thị trong Terminal.

## 3. Chức năng

- Thêm khoản chi với nội dung, số tiền (lớn hơn 0), loại (Ăn uống / Đi lại / Học tập / Giải trí), ngày hợp lệ không ở tương lai.
- Xóa có hộp thoại xác nhận, danh sách dùng `key` theo `id`.
- Lọc theo loại, tìm nội dung với debounce 350ms; tổng tiền theo các dòng đang hiển thị.
- Thống kê tổng chi của **toàn bộ dữ liệu** theo từng loại.
- Đồng hồ cập nhật mỗi giây và dọn dẹp timer.
- Tiêu đề tab cập nhật tổng chi **toàn bộ dữ liệu**.
- Phần A sử dụng dữ liệu mẫu viết sẵn trong code (tải lại trang sẽ về ban đầu).
- Phần B dùng `useState`, `useEffect`, `useRef`, `useContext`, custom `useClock`, `useDebounce`; có sáng/tối và trạng thái đang tải / lỗi / đang lưu / đang xóa.

## 4. Cấu hình MockAPI (Phần B)

**Mặc định** Phần B ở chế độ demo bằng `localStorage`, để chạy được ngay mà không cần tài khoản. Để đáp ứng phần **lấy/thêm/xóa qua MockAPI**, thực hiện:

1. Vào https://mockapi.io/ và tạo project mới.
2. Tạo resource tên **`expenses`**, với các trường: `title` (String), `amount` (Number), `category` (String), `date` (String). MockAPI tự tạo `id`.
3. Lấy API base URL của project, ví dụ `https://abc123.mockapi.io/api/v1`. **Không thêm `/expenses` ở cuối**, vì code tự thêm.
4. Trong `part-b-hooks`, sao chép `.env.example` thành `.env` và sửa thành:

```env
VITE_MOCKAPI_URL=https://abc123.mockapi.io/api/v1
```

5. Tắt server đang chạy (`Ctrl + C`), rồi chạy lại `npm run dev` trong `part-b-hooks`.
6. Thử thêm và xóa khoản chi, mở trang resource `/expenses` trên MockAPI để kiểm tra dữ liệu được thay đổi thật. Nếu API chưa có dữ liệu, danh sách sẽ trống và bạn có thể thêm dòng đầu tiên.

**Chú ý:** URL `abc123` chỉ minh họa, phải thay bằng URL project **của bạn**. Đừng commit `.env` (đã có `.gitignore`). Khi mất mạng, sai URL hoặc server trả mã lỗi, ứng dụng hiển thị thông báo và nút thử lại; không âm thầm thay dữ liệu MockAPI bằng demo.

## 5. Giải thích: Hooks khắc phục những khó khăn của Class

| Yêu cầu | Class Component (Phần A) | Function Component + Hooks (Phần B) |
|---|---|---|
| State | `this.state` và `this.setState()` | `useState()` ngắn gọn, chia riêng từng biến |
| Vòng đời đồng hồ | `componentDidMount` + `componentWillUnmount` | `useEffect` + hàm cleanup trong `useClock` |
| Tiêu đề tab | `componentDidUpdate` + kiểm tra state cũ | `useEffect` với dependency `[allTotal]` |
| Gọi API | Cần tự tổ chức logic trong lifecycle class | `useEffect` gọi API, cleanup tránh cập nhật sau unmount |
| Focus input | Tạo ref cho class | `useRef`, gọi `titleRef.current.focus()` sau thêm thành công |
| Sáng/tối | Truyền props qua nhiều cấp hoặc dùng Context với class | `useContext` truy cập ThemeContext trực tiếp |
| Tái sử dụng logic | Thường dùng HOC/render props hoặc lặp code | Custom hooks `useClock`, `useDebounce` |

**Nhận xét:** Hooks giúp tách những logic có liên quan (đồng hồ, debounce, API), không cần `this`, và dễ tái sử dụng. Class vẫn hoạt động tốt; Hooks không tự động làm chương trình nhanh hơn, nhưng giảm code lifecycle lặp lại và dễ tổ chức logic hơn.

## 6. Kiểm thử thủ công

1. Mở app; đồng hồ phải nhảy mỗi giây.
2. Thử thêm khi bỏ trống nội dung, khi số tiền bằng 0, khi ngày ở tương lai: phải báo lỗi.
3. Thêm khoản chi hợp lệ: xuất hiện trong danh sách, tổng và thống kê cập nhật; tab browser đổi tổng.
4. Lọc `Ăn uống`: chỉ còn khoản chi loại đó; tổng hiển thị tính theo kết quả lọc.
5. Tìm chuỗi trong nội dung: kết quả đổi sau khoảng 350ms.
6. Bấm Xóa rồi chọn Cancel: giữ nguyên; chọn OK: dòng bị xóa.
7. Phần B: thêm thành công thì ô nội dung được focus; chuyển theme sáng/tối.
8. Phần B MockAPI: kiểm tra Network trong F12 có GET `/expenses`, POST `/expenses`, DELETE `/expenses/:id`; thử URL sai để thấy trạng thái lỗi.

## 7. Build và đưa lên GitHub

Kiểm tra từng thư mục:

```bash
npm run build
```

Trong **thư mục gốc `LTW-BaiThucHanh03`**, sau khi tạo repository public rỗng trên GitHub:

```bash
git init
git add .
git commit -m "Hoan thanh bai thuc hanh 03"
git branch -M main
git remote add origin https://github.com/USERNAME/LTW-BaiThucHanh03.git
git push -u origin main
```

Thay `USERNAME` bằng tên GitHub của bạn; nếu repo đã tạo có README hay commit sẵn, cần đồng bộ lịch sử trước khi push. Không đưa `node_modules`, `dist`, `.env` lên repository.
