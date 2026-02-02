import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, isExpired }) => {
  const formatDate = (timestamp) => {
    // Chuyển đổi timestamp (giây) sang milliseconds và format theo định dạng Việt Nam (dd/mm/yyyy)
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = () => {
    // Kiểm tra nếu sản phẩm là hàng giả
    if (!product.isAuthentic) {
      return <span className="badge badge-fake">❌ Hàng Giả</span>;
    }
    // Kiểm tra nếu sản phẩm đã hết hạn
    if (isExpired) {
      return <span className="badge badge-expired">⚠️ Đã Hết Hạn</span>;
    }
    // Nếu không phải 2 trường hợp trên thì là sản phẩm chính hãng còn hạn
    return <span className="badge badge-authentic">✅ Chính Hãng</span>;
  };

  const getCardClass = () => {
    // Trả về class CSS tương ứng với trạng thái sản phẩm
    if (!product.isAuthentic) return 'product-card fake'; // Class cho hàng giả
    if (isExpired) return 'product-card expired'; // Class cho sản phẩm hết hạn
    return 'product-card authentic'; // Class cho sản phẩm chính hãng
  };

  return (
    // Div chính với class động dựa trên trạng thái sản phẩm
    <div className={getCardClass()}>
      {/* Header của card hiển thị tên và badge trạng thái */}
      <div className="card-header">
        <h2 className="product-name">{product.productName}</h2>
        {/* Hiển thị badge trạng thái (Chính hãng/Hàng giả/Hết hạn) */}
        {getStatusBadge()}
      </div>

      {/* Body chứa các thông tin chi tiết sản phẩm */}
      <div className="card-body">
        <div className="info-grid">
          {/* Thông tin thương hiệu */}
          <div className="info-row">
            <span className="info-label">🏷️ Thương hiệu:</span>
            <span className="info-value">{product.brand}</span>
          </div>

          {/* Thông tin số lô sản xuất */}
          <div className="info-row">
            <span className="info-label">📦 Số lô:</span>
            <span className="info-value">{product.batchNumber}</span>
          </div>

          {/* Thông tin nhà sản xuất */}
          <div className="info-row">
            <span className="info-label">🏭 Nhà sản xuất:</span>
            <span className="info-value">{product.manufacturer}</span>
          </div>

          {/* Thông tin ngày sản xuất */}
          <div className="info-row">
            <span className="info-label">📅 Ngày sản xuất:</span>
            <span className="info-value">{formatDate(product.manufacturingDate)}</span>
          </div>

          {/* Thông tin ngày hết hạn */}
          <div className="info-row">
            <span className="info-label">⏰ Ngày hết hạn:</span>
            <span className="info-value expiry">
              {formatDate(product.expiryDate)}
              {/* Hiển thị text "(Đã hết hạn)" nếu sản phẩm đã hết hạn */}
              {isExpired && <span className="expired-text"> (Đã hết hạn)</span>}
            </span>
          </div>

          {/* Thông tin số lần xác thực - được highlight */}
          <div className="info-row highlight">
            <span className="info-label">🔍 Số lần xác thực:</span>
            <span className="info-value count">{product.verificationCount}</span>
          </div>
        </div>
      </div>

      {/* Hiển thị cảnh báo nếu là hàng giả */}
      {!product.isAuthentic && (
        <div className="warning-box">
          <strong>⚠️ Cảnh báo:</strong> Sản phẩm này đã được đánh dấu là hàng giả. 
          Vui lòng không sử dụng và báo cáo cho cơ quan chức năng.
        </div>
      )}

      {/* Hiển thị thông báo nếu sản phẩm chính hãng nhưng đã hết hạn */}
      {isExpired && product.isAuthentic && (
        <div className="info-box">
          <strong>ℹ️ Lưu ý:</strong> Sản phẩm đã quá hạn sử dụng. 
          Không nên sử dụng sản phẩm này để đảm bảo an toàn.
        </div>
      )}
    </div>
  );
};

export default ProductCard;