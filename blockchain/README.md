# 🔗 Blockchain – Hệ thống xác thực mỹ phẩm chính hãng

Thư mục `blockchain` chứa toàn bộ **Smart Contract**, cấu hình **Hardhat**, script deploy và dữ liệu build phục vụ cho hệ thống xác thực mỹ phẩm bằng **QR Code & Blockchain**.

---

##  Chức năng chính
- Lưu trữ thông tin mỹ phẩm trên Blockchain
- Đảm bảo dữ liệu **minh bạch – không thể chỉnh sửa**
- Cung cấp dữ liệu cho Frontend xác thực thông qua QR Code
- Ghi nhận lịch sử xác thực sản phẩm

---

##  Công nghệ sử dụng
- **Solidity**
- **Hardhat**
- **Hardhat Ignition**
- **TypeScript**
- **Ethers.js**
- **Ethereum (Local / Testnet)**

---

##  Cấu trúc thư mục
blockchain
├── artifacts/ # File build sau khi compile
├── cache/ # Cache của Hardhat
├── contracts/ # Smart Contract
│ ├── CosmeticAuthentication.sol
│ ├── MyToken.sol
│ ├── Mywallet.sol
│ ├── Counter.sol
│ └── Counter.t.sol
│
├── ignition/
│ ├── deployments/
│ │ └── chain-338/ # Thông tin deploy theo network
│ └── modules/ # Module deploy Ignition
│
├── scripts/ # Script deploy thủ công
├── test/ # Unit test Smart Contract
├── types/ # Typechain types
│
├── hardhat.config.ts # Cấu hình Hardhat
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
##  Mô tả Smart Contract

###  CosmeticAuthentication.sol
- Lưu thông tin mỹ phẩm:
  - Mã sản phẩm
  - Tên sản phẩm
  - Thương hiệu
  - Nhà sản xuất
  - Ngày sản xuất / hạn sử dụng
- Xác thực mỹ phẩm thông qua địa chỉ ví
- Ghi nhận lịch sử xác thực

###  MyToken.sol
- Smart contract token (ERC20 / custom)
- Phục vụ mở rộng tính năng (reward, fee, …)

###  Mywallet.sol
- Quản lý ví
- Phục vụ demo & thử nghiệm

###  Counter.sol
- Contract mẫu (demo Hardhat)

---
