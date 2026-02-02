import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  // Ref để lưu trữ instance của QR scanner, giúp quản lý scanner qua các lần render
  const scannerRef = useRef(null);
  // State để theo dõi trạng thái camera đang bật hay tắt
  const [isScanning, setIsScanning] = useState(false);
  // State để lưu giá trị nhập tay từ input
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    // Khi isScanning thay đổi thành true, khởi tạo scanner
    if (isScanning) {
      initScanner();
    }

    // Cleanup function: chạy khi component unmount hoặc trước khi effect chạy lại
    return () => {
      // Nếu scanner đang tồn tại, clear nó để giải phóng camera
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isScanning]); // Effect chỉ chạy lại khi isScanning thay đổi

  const initScanner = () => {
    // Tạo instance mới của Html5QrcodeScanner
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10, // Số khung hình quét mỗi giây (frame per second)
      qrbox: { width: 250, height: 250 }, // Kích thước khung vuông để quét QR
      aspectRatio: 1.0, // Tỷ lệ khung hình camera (1:1 = vuông)
      showTorchButtonIfSupported: true, // Hiển thị nút bật đèn flash nếu thiết bị hỗ trợ
      showZoomSliderIfSupported: true, // Hiển thị thanh zoom nếu thiết bị hỗ trợ
    });

    // Render scanner với 2 callback functions
    scanner.render(
      (decodedText) => {
        // Callback khi quét thành công
        handleScanSuccess(decodedText); // Xử lý dữ liệu QR đã quét
        scanner.clear(); // Dừng và xóa scanner
        setIsScanning(false); // Tắt trạng thái scanning
      },
      (error) => {
        // Callback khi có lỗi (bỏ qua các lỗi liên tục trong quá trình quét)
      }
    );

    // Lưu instance scanner vào ref để có thể truy cập sau này
    scannerRef.current = scanner;
  };

  const handleScanSuccess = (data) => {
    // Nếu có callback onScanSuccess được truyền từ component cha
    if (onScanSuccess) {
      // Gọi callback với dữ liệu đã quét/nhập
      onScanSuccess(data);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault(); // Ngăn form reload trang
    // Kiểm tra input có giá trị sau khi loại bỏ khoảng trắng
    if (manualInput.trim()) {
      handleScanSuccess(manualInput.trim()); // Xử lý giống như quét QR thành công
      setManualInput(''); // Reset input về rỗng
    }
  };

  const toggleScanner = () => {
    // Nếu đang scanning và scanner tồn tại, clear scanner trước
    if (isScanning && scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    // Đảo ngược trạng thái scanning (bật/tắt)
    setIsScanning(!isScanning);
  };

  return (
    <div className="qr-scanner-container">
      {/* Header của scanner */}
      <div className="scanner-header">
        <h3>🔍 Quét QR Code hoặc Nhập Mã</h3>
      </div>

      <div className="scanner-content">
        {/* Phần QR Scanner */}
        <div className="scanner-section">
          {/* Nút bật/tắt camera */}
          <button 
            className={`toggle-scanner-btn ${isScanning ? 'active' : ''}`} // Thêm class 'active' khi đang scan
            onClick={toggleScanner}
          >
            {isScanning ? '⏸️ Dừng Camera' : '📷 Bật Camera'}
          </button>

          {/* Hiển thị khung scanner khi camera đang bật */}
          {isScanning && (
            <div className="scanner-box">
              {/* Div này sẽ được Html5QrcodeScanner render vào */}
              <div id="qr-reader"></div>
            </div>
          )}

          {/* Hiển thị placeholder khi camera chưa bật */}
          {!isScanning && (
            <div className="scanner-placeholder">
              <div className="placeholder-icon">📱</div>
              <p>Nhấn "Bật Camera" để quét QR Code</p>
            </div>
          )}
        </div>

        {/* Phần nhập mã thủ công */}
        <div className="manual-section">
          <form onSubmit={handleManualSubmit}>
            <div className="input-group">
              <label htmlFor="manual-input">Hoặc nhập mã sản phẩm:</label>
              <input
                id="manual-input"
                type="text"
                value={manualInput} // Giá trị input được quản lý bởi state
                onChange={(e) => setManualInput(e.target.value)} // Cập nhật state khi user gõ
                placeholder="VD: PROD001"
                className="manual-input"
              />
            </div>
            {/* Nút submit, disabled khi input rỗng */}
            <button 
              type="submit" 
              className="manual-submit-btn"
              disabled={!manualInput.trim()} // Vô hiệu hóa nếu input chỉ có khoảng trắng
            >
              ✓ Xác thực
            </button>
          </form>
        </div>
      </div>

      {/* Phần tips/hướng dẫn sử dụng */}
      <div className="scanner-tips">
        <h4>💡 Mẹo:</h4>
        <ul>
          <li>Đảm bảo QR code nằm trong khung vuông</li>
          <li>Giữ camera ổn định và có đủ ánh sáng</li>
          <li>QR code không bị mờ hoặc hư hỏng</li>
        </ul>
      </div>
    </div>
  );
};

export default QRScanner;