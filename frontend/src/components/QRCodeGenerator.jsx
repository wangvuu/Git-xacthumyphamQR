import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ productId, productName }) => {
  // Ref để truy cập DOM element chứa QR code (canvas)
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    // Tìm element canvas chứa QR code trong ref
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return; // Nếu không tìm thấy canvas thì dừng

    // Chuyển đổi canvas thành URL data dạng PNG
    const url = canvas.toDataURL('image/png');
    // Tạo element <a> ảo để trigger download
    const link = document.createElement('a');
    // Đặt tên file download với format: QR_[mã sản phẩm]_[timestamp].png
    link.download = `QR_${productId}_${Date.now()}.png`;
    link.href = url; // Gán URL data vào href
    link.click(); // Trigger click để tải xuống
  };

  const printQRCode = () => {
    // Tìm element canvas chứa QR code
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return; // Nếu không tìm thấy thì dừng

    // Tạo nội dung HTML cho cửa sổ in
    const windowContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${productId}</title>
        <style>
          /* CSS cho layout in ấn */
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
          }
          .print-container {
            text-align: center;
            border: 2px solid #333;
            padding: 30px;
            border-radius: 10px;
          }
          h1 { color: #667eea; margin-bottom: 10px; }
          h2 { color: #333; margin-bottom: 20px; }
          img { margin: 20px 0; }
          .info { margin-top: 20px; font-size: 14px; color: #666; }
          /* CSS đặc biệt cho chế độ in - ẩn border khi in */
          @media print {
            body { margin: 0; }
            .print-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <h1>QR Code Xác Thực Mỹ Phẩm</h1>
          <h2>${productName || 'Sản phẩm'}</h2>
          {/* Chèn QR code dưới dạng base64 image */}
          <img src="${canvas.toDataURL()}" />
          <div class="info">
            <p><strong>Mã sản phẩm:</strong> ${productId}</p>
            <p><strong>Ngày tạo:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Mở cửa sổ popup mới với kích thước 800x600
    const printWindow = window.open('', '', 'width=800,height=600');
    // Ghi nội dung HTML vào cửa sổ mới
    printWindow.document.write(windowContent);
    // Đóng stream ghi để hoàn tất việc render
    printWindow.document.close();
    // Focus vào cửa sổ in
    printWindow.focus();
    
    // Đợi 250ms để đảm bảo nội dung đã render xong
    setTimeout(() => {
      printWindow.print(); // Mở hộp thoại in
      printWindow.close(); // Đóng cửa sổ popup sau khi in
    }, 250);
  };

  const copyToClipboard = () => {
    // Sao chép mã sản phẩm vào clipboard
    navigator.clipboard.writeText(productId).then(() => {
      // Thông báo thành công
      alert('Đã sao chép mã sản phẩm!');
    }).catch(err => {
      // Log lỗi nếu sao chép thất bại
      console.error('Lỗi khi sao chép:', err);
    });
  };

  return (
    <div className="qr-generator-container">
      {/* Header hiển thị tiêu đề và tên sản phẩm */}
      <div className="qr-header">
        <h3>📱 QR Code Sản Phẩm</h3>
        {/* Chỉ hiển thị tên sản phẩm nếu có */}
        {productName && <p className="product-name-display">{productName}</p>}
      </div>

      {/* Phần hiển thị QR code */}
      <div className="qr-display" ref={qrRef}>
        <div className="qr-wrapper">
          {/* Component tạo QR code */}
          <QRCode 
            value={productId} // Giá trị mã hóa trong QR (mã sản phẩm)
            size={280} // Kích thước QR code (280x280 px)
            level="H" // Mức độ error correction cao nhất (High)
            includeMargin={true} // Thêm margin xung quanh QR code
            renderAs="canvas" // Render dưới dạng canvas (thay vì SVG)
          />
        </div>
        
        {/* Hiển thị thông tin mã sản phẩm */}
        <div className="qr-info">
          <div className="product-id-box">
            <span className="label">Mã sản phẩm:</span>
            <span className="value">{productId}</span>
            {/* Nút sao chép mã sản phẩm */}
            <button 
              className="copy-btn"
              onClick={copyToClipboard}
              title="Sao chép mã"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Các nút action: tải xuống và in */}
      <div className="qr-actions">
        <button className="action-btn download-btn" onClick={downloadQRCode}>
          <span className="btn-icon">💾</span>
          <span className="btn-text">Tải xuống</span>
        </button>

        <button className="action-btn print-btn" onClick={printQRCode}>
          <span className="btn-icon">🖨️</span>
          <span className="btn-text">In QR Code</span>
        </button>
      </div>

      {/* Hướng dẫn sử dụng QR code */}
      <div className="qr-instructions">
        <h4>📋 Hướng dẫn sử dụng:</h4>
        <ol>
          <li>Tải xuống hoặc in QR code</li>
          <li>Dán QR code lên bao bì sản phẩm</li>
          <li>Khách hàng quét QR để xác thực</li>
          <li>Thông tin sản phẩm sẽ hiển thị ngay lập tức</li>
        </ol>
      </div>

      {/* Ghi chú quan trọng */}
      <div className="qr-note">
        <p>💡 <strong>Lưu ý:</strong> QR code này chứa mã định danh duy nhất của sản phẩm trên blockchain. 
        Mỗi lần quét sẽ được ghi nhận vào lịch sử xác thực.</p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;