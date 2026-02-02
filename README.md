Thành viên 1 – Backend
Tên: Nguyễn Quang Vương
MSSV : 226332
Vai trò: Xử lý nghiệp vụ và dữ liệu trung gian hỗ trợ Kết nối blockchain
Nhiệm vụ:
•	Thiết kế API phục vụ hệ thống xác thực mỹ phẩm
•	Xử lý logic nghiệp vụ (đăng ký, truy xuất thông tin)
•	Kết nối cơ sở dữ liệu (nếu có)
•	Hỗ trợ frontend trong việc trao đổi dữ liệu
•	Đảm bảo bảo mật và kiểm soát truy cập

 Thành viên 2 – Frontend 1 (UI / UX)
Tên : Phạm Cao Kiệt
MSSV : 220369
Vai trò: Giao diện & trải nghiệm người dùng
Nhiệm vụ:
•	Thiết kế giao diện người dùng (UI)
•	Xây dựng các trang: trang chủ, xác thực mỹ phẩm, hiển thị kết quả
•	Xây dựng các component React
•	Thiết kế luồng tương tác người dùng
•	Hiển thị thông báo, trạng thái loading, lỗi

 Thành viên 3 – Frontend 2 (Blockchain Integration)
Tên : Lâm Nhật Hào
MSSV : 222764
Vai trò: Kết nối blockchain trên frontend
Nhiệm vụ:
•	Kết nối ví MetaMask
•	Cấu hình mạng blockchain (Cronos Testnet)
•	Tích hợp ethers.js / web3.js
•	Gọi smart contract để đăng ký và xác thực mỹ phẩm
•	Xử lý dữ liệu trả về từ blockchain
•	Tích hợp QR Code (tạo & quét)

ĐỀ TÀI
HỆ THỐNG XÁC THỰC MỸ PHẨM CHÍNH HÃNG BẰNG QR CODE & BLOCKCHAIN
##  Giới thiệu
Dự án **Xác thực mỹ phẩm chính hãng** sử dụng **QR Code kết hợp Blockchain** nhằm giải quyết vấn đề hàng giả, hàng nhái trên thị trường mỹ phẩm.

Hệ thống cho phép:
- Nhà sản xuất đăng ký sản phẩm lên Blockchain
- Sinh mã QR cho từng sản phẩm
- Người dùng quét QR để kiểm tra tính xác thực
- Lưu vết lịch sử xác thực một cách minh bạch, không thể sửa đổi

---

##  Mục tiêu dự án
- Ngăn chặn mỹ phẩm giả
- Minh bạch thông tin sản phẩm
- Tăng độ tin cậy cho người tiêu dùng
- Ứng dụng Blockchain vào bài toán thực tế

---

##  Công nghệ sử dụng

###  Blockchain
- Solidity
- Hardhat
- Ethers.js
- Ethereum (Localhost / Testnet)
- MetaMask

###  Frontend
- ReactJS (JSX)
- CSS
- QR Code Generator & Scanner
- Web3 / Ethers.js

---

##  Cấu trúc thư mục

MYPHAM
├── blockchain
│ ├── contracts
│ │ ├── CosmeticAuthentication.sol
│ │ ├── MyToken.sol
│ │ └── ...
│ ├── scripts
│ ├── artifacts
│ ├── test
│ ├── hardhat.config.ts
│ ├── package.json
│ └── README.md
│
├── frontend
│ ├── public
│ ├── src
│ │ ├── blockchain # Kết nối smart contract
│ │ ├── components
│ │ │ ├── WalletConnect.jsx
│ │ │ ├── QRScanner.jsx
│ │ │ ├── QRCodeGenerator.jsx
│ │ │ ├── ProductCard.jsx
│ │ │ ├── VerificationTimeline.jsx
│ │ │ └── Loader.jsx
│ │ ├── App.jsx
│ │ └── index.js
│ ├── package.json
│ └── README.md
│
└── README.md


##  Chức năng chính

### Nhà sản xuất
- Thêm sản phẩm mỹ phẩm mới
- Lưu thông tin sản phẩm lên Blockchain
- Sinh mã QR cho từng sản phẩm

###  Người tiêu dùng
- Quét QR Code
- Kiểm tra thông tin sản phẩm
- Xác thực mỹ phẩm chính hãng
- Xem lịch sử xác thực

### Blockchain đảm bảo
- Dữ liệu không thể chỉnh sửa
- Minh bạch & an toàn
- Mỗi sản phẩm là duy nhất

---

## Hướng dẫn cài đặt & chạy dự án

### Cài đặt Blockchain
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat node
npx them nội dung