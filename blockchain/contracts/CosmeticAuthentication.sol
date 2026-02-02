// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CosmeticAuthentication {
    struct Product {
        string productId;
        string productName;
        string brand;
        string batchNumber;
        uint256 manufacturingDate;
        uint256 expiryDate;
        string manufacturer;
        address owner;
        bool isAuthentic;
        uint256 verificationCount;
        uint256 createdAt;
    }

    struct VerificationLog {
        address verifier;
        uint256 timestamp;
        string location;
    }

    mapping(string => Product) public products;
    mapping(string => VerificationLog[]) public verificationHistory;

    address public admin;
    uint256 public totalProducts;

    event ProductRegistered(
        string indexed productId,
        string productName,
        string brand,
        address owner
    );

    event ProductVerified(
        string indexed productId,
        address verifier,
        uint256 timestamp
    );

    event ProductTransferred(
        string indexed productId,
        address from,
        address to
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // ✅ AI CŨNG CÓ THỂ ĐĂNG KÝ SẢN PHẨM
    function registerProduct(
        string memory _productId,
        string memory _productName,
        string memory _brand,
        string memory _batchNumber,
        uint256 _manufacturingDate,
        uint256 _expiryDate,
        string memory _manufacturer
    ) external {
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(bytes(products[_productId].productId).length == 0, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            productName: _productName,
            brand: _brand,
            batchNumber: _batchNumber,
            manufacturingDate: _manufacturingDate,
            expiryDate: _expiryDate,
            manufacturer: _manufacturer,
            owner: msg.sender,
            isAuthentic: true,
            verificationCount: 0,
            createdAt: block.timestamp
        });

        totalProducts++;

        emit ProductRegistered(_productId, _productName, _brand, msg.sender);
    }

    function verifyProduct(string memory _productId, string memory _location)
        external
        returns (bool)
    {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");

        Product storage product = products[_productId];
        product.verificationCount++;

        verificationHistory[_productId].push(
            VerificationLog({
                verifier: msg.sender,
                timestamp: block.timestamp,
                location: _location
            })
        );

        emit ProductVerified(_productId, msg.sender, block.timestamp);
        return product.isAuthentic;
    }

    function getProduct(string memory _productId)
        external
        view
        returns (
            string memory productName,
            string memory brand,
            string memory batchNumber,
            uint256 manufacturingDate,
            uint256 expiryDate,
            string memory manufacturer,
            bool isAuthentic,
            uint256 verificationCount
        )
    {
        Product memory product = products[_productId];
        require(bytes(product.productId).length > 0, "Product does not exist");

        return (
            product.productName,
            product.brand,
            product.batchNumber,
            product.manufacturingDate,
            product.expiryDate,
            product.manufacturer,
            product.isAuthentic,
            product.verificationCount
        );
    }

    function getVerificationHistory(string memory _productId)
        external
        view
        returns (VerificationLog[] memory)
    {
        return verificationHistory[_productId];
    }

    function transferProduct(string memory _productId, address _newOwner) external {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        require(products[_productId].owner == msg.sender, "Not the product owner");

        address previousOwner = products[_productId].owner;
        products[_productId].owner = _newOwner;

        emit ProductTransferred(_productId, previousOwner, _newOwner);
    }

    // ✅ Chỉ admin mới được đánh dấu hàng giả
    function markAsCounterfeit(string memory _productId) external onlyAdmin {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        products[_productId].isAuthentic = false;
    }

    function isProductExpired(string memory _productId) external view returns (bool) {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        return block.timestamp > products[_productId].expiryDate;
    }
}
