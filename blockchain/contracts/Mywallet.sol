// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
  Project: He thong xac thuc my pham chinh hang
  Technology: Blockchain
*/

contract Mywallet {

    address public owner;

    struct Product {
        string productId;
        string name;
        string brand;
        uint256 createdAt;
        bool isValid;
        bool exists;
    }

    mapping(string => Product) private products;

    event ProductAdded(string productId);
    event ProductRevoked(string productId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Them san pham moi
    function addProduct(
        string memory _productId,
        string memory _name,
        string memory _brand
    ) public onlyOwner {
        require(!products[_productId].exists, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            name: _name,
            brand: _brand,
            createdAt: block.timestamp,
            isValid: true,
            exists: true
        });

        emit ProductAdded(_productId);
    }

    /// @notice Xac thuc san pham
    function verifyProduct(string memory _productId)
        public
        view
        returns (
            string memory name,
            string memory brand,
            bool isValid,
            uint256 createdAt
        )
    {
        require(products[_productId].exists, "Product does not exist");

        Product memory p = products[_productId];
        return (p.name, p.brand, p.isValid, p.createdAt);
    }

    /// @notice Thu hoi san pham
    function revokeProduct(string memory _productId)
        public
        onlyOwner
    {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].isValid, "Product already revoked");

        products[_productId].isValid = false;
        emit ProductRevoked(_productId);
    }

    /// @notice Kiem tra san pham co ton tai hay khong
    function productExists(string memory _productId)
        public
        view
        returns (bool)
    {
        return products[_productId].exists;
    }
}
