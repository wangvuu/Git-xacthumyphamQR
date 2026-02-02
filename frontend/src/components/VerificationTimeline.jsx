import React, { useState } from 'react';
import './VerificationTimeline.css';

const VerificationTimeline = ({ history }) => {
  // State để quản lý việc hiển thị toàn bộ lịch sử hay chỉ 5 mục đầu
  const [showAll, setShowAll] = useState(false);
  
  const formatDate = (timestamp) => {
    // Chuyển đổi timestamp (giây) sang milliseconds và format theo kiểu Việt Nam
    return new Date(timestamp * 1000).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAddress = (address) => {
    // Rút gọn địa chỉ ví: hiển thị 6 ký tự đầu ... 4 ký tự cuối (từ ký tự 38 đến hết)
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const getRelativeTime = (timestamp) => {
    // Tính thời gian tương đối (x ngày/giờ/phút trước)
    const now = Date.now(); // Lấy thời gian hiện tại (milliseconds)
    const diff = now - (timestamp * 1000); // Tính khoảng cách thời gian
    
    // Chuyển đổi milliseconds sang các đơn vị thời gian khác
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Trả về chuỗi thời gian phù hợp nhất
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  // Kiểm tra nếu không có lịch sử hoặc lịch sử rỗng
  if (!history || history.length === 0) {
    return (
      <div className="timeline-container">
        <h3 className="timeline-title">📊 Lịch Sử Xác Thực</h3>
        <div className="timeline-empty">
          <p>Chưa có lịch sử xác thực</p>
        </div>
      </div>
    );
  }

  // Nếu showAll=false thì chỉ lấy 5 mục đầu, ngược lại lấy toàn bộ
  const displayHistory = showAll ? history : history.slice(0, 5);
  // Đảo ngược mảng để hiển thị mục mới nhất lên đầu
  const sortedHistory = [...displayHistory].reverse();

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3 className="timeline-title">📊 Lịch Sử Xác Thực</h3>
        {/* Hiển thị tổng số lần xác thực */}
        <div className="timeline-count">
          Tổng số: <strong>{history.length}</strong> lần
        </div>
      </div>

      <div className="timeline">
        {/* Duyệt qua từng mục trong lịch sử đã được sắp xếp */}
        {sortedHistory.map((log, index) => (
          <div key={index} className="timeline-item">
            {/* Marker (dấu chấm) bên trái timeline */}
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              {/* Hiển thị đường kẻ dọc nối các marker, trừ mục cuối cùng */}
              {index !== sortedHistory.length - 1 && <div className="marker-line"></div>}
            </div>
            
            {/* Nội dung chi tiết của mỗi mục */}
            <div className="timeline-content">
              {/* Hiển thị thời gian (cả dạng tuyệt đối và tương đối) */}
              <div className="timeline-time">
                <span className="time-absolute">{formatDate(log.timestamp)}</span>
                <span className="time-relative">{getRelativeTime(log.timestamp)}</span>
              </div>
              
              {/* Chi tiết người xác thực và vị trí */}
              <div className="timeline-details">
                {/* Thông tin người xác thực */}
                <div className="detail-row">
                  <span className="detail-icon">👤</span>
                  <span className="detail-label">Người xác thực:</span>
                  <span className="detail-value" title={log.verifier}>
                    {formatAddress(log.verifier)}
                  </span>
                </div>
                
                {/* Thông tin vị trí */}
                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <span className="detail-label">Vị trí:</span>
                  <span className="detail-value">{log.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút "Xem thêm" chỉ hiển thị khi có hơn 5 mục */}
      {history.length > 5 && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)} // Toggle giữa hiển thị tất cả và 5 mục
        >
          {showAll ? '▲ Ẩn bớt' : `▼ Xem thêm (${history.length - 5} mục)`}
        </button>
      )}

      {/* Phần thống kê tổng quan */}
      <div className="timeline-stats">
        {/* Thống kê: Tổng số lần xác thực */}
        <div className="stat-item">
          <span className="stat-icon">🔍</span>
          <div className="stat-info">
            <span className="stat-value">{history.length}</span>
            <span className="stat-label">Tổng xác thực</span>
          </div>
        </div>
        
        {/* Thống kê: Lần xác thực mới nhất (lấy mục cuối cùng) */}
        <div className="stat-item">
          <span className="stat-icon">🕒</span>
          <div className="stat-info">
            <span className="stat-value">
              {history.length > 0 ? getRelativeTime(history[history.length - 1].timestamp) : 'N/A'}
            </span>
            <span className="stat-label">Lần xác thực mới nhất</span>
          </div>
        </div>

        {/* Thống kê: Lần đầu tiên xác thực (lấy mục đầu tiên, chỉ hiển thị ngày) */}
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <span className="stat-value">
              {history.length > 0 ? formatDate(history[0].timestamp).split(',')[0] : 'N/A'}
            </span>
            <span className="stat-label">Lần đầu xác thực</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTimeline;