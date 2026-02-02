import React from 'react';
import './Loader.css';

// Component Loader nhận 2 props: message (text hiển thị) và fullScreen (chế độ hiển thị)
const Loader = ({ message = 'Đang xử lý...', fullScreen = false }) => {
  
  // Nếu fullScreen = true, hiển thị loader toàn màn hình
  if (fullScreen) {
    return (
      // Overlay phủ toàn màn hình với background mờ
      <div className="loader-overlay">
        {/* Container chứa nội dung loader ở giữa màn hình */}
        <div className="loader-content">
          {/* Container của spinner (icon loading xoay tròn) */}
          <div className="loader-spinner">
            {/* Div spinner sẽ được CSS animation để tạo hiệu ứng xoay */}
            <div className="spinner"></div>
          </div>
          {/* Hiển thị message bên dưới spinner */}
          <p className="loader-message">{message}</p>
        </div>
      </div>
    );
  }

  // Nếu fullScreen = false, hiển thị loader dạng inline (nhỏ gọn)
  return (
    // Container inline cho loader, có thể đặt trong các component khác
    <div className="loader-inline">
      {/* Spinner nhỏ hơn cho chế độ inline */}
      <div className="loader-spinner-small">
        {/* Div spinner nhỏ sẽ được CSS animation để tạo hiệu ứng xoay */}
        <div className="spinner-small"></div>
      </div>
      {/* Message hiển thị bên cạnh spinner (inline) */}
      <span className="loader-message-small">{message}</span>
    </div>
  );
};

export default Loader;