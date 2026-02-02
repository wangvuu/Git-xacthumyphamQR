import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './WalletConnect.css';

const WalletConnect = ({ onConnect, onDisconnect }) => {
  // Khai báo các state để lưu trữ thông tin ví
  const [account, setAccount] = useState(''); // Địa chỉ ví người dùng
  const [balance, setBalance] = useState('0'); // Số dư ETH
  const [network, setNetwork] = useState(''); // Tên mạng blockchain
  const [isConnecting, setIsConnecting] = useState(false); // Trạng thái đang kết nối

  useEffect(() => {
    // Kiểm tra xem ví đã được kết nối trước đó chưa khi component được mount
    checkIfWalletIsConnected();

    if (window.ethereum) {
      // Lắng nghe sự kiện khi người dùng đổi tài khoản trong MetaMask
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // Lắng nghe sự kiện khi người dùng đổi mạng blockchain
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      // Cleanup: Xóa các listener khi component bị unmount để tránh memory leak
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      // Kiểm tra xem MetaMask có được cài đặt không
      if (!window.ethereum) return;

      // Lấy danh sách các tài khoản đã được kết nối trước đó
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      // Nếu có tài khoản đã kết nối, tự động kết nối lại
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
    }
  };

  const connectWallet = async () => {
    // Kiểm tra xem MetaMask có được cài đặt không
    if (!window.ethereum) {
      alert('Vui lòng cài đặt MetaMask!');
      return;
    }

    setIsConnecting(true); // Bật trạng thái đang kết nối
    try {
      // Tạo provider từ MetaMask (ethers v5)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Yêu cầu người dùng cấp quyền truy cập tài khoản
      await provider.send('eth_requestAccounts', []);

      // Lấy signer (đối tượng đại diện cho tài khoản có thể ký giao dịch)
      const signer = provider.getSigner();
      // Lấy địa chỉ ví của người dùng
      const address = await signer.getAddress();

      // Lấy số dư ví (đơn vị Wei)
      const balanceWei = await provider.getBalance(address);
      // Chuyển đổi từ Wei sang ETH
      const balanceEth = ethers.utils.formatEther(balanceWei);

      // Lấy thông tin mạng blockchain đang kết nối
      const networkInfo = await provider.getNetwork();

      // Cập nhật các state với thông tin vừa lấy được
      setAccount(address);
      setBalance(parseFloat(balanceEth).toFixed(4)); // Làm tròn 4 chữ số thập phân
      setNetwork(networkInfo.name === 'unknown' ? 'Localhost' : networkInfo.name);

      // Gọi callback onConnect nếu được truyền vào từ component cha
      if (onConnect) {
        onConnect({ provider, signer, account: address });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Lỗi kết nối ví: ' + error.message);
    }

    setIsConnecting(false); // Tắt trạng thái đang kết nối
  };

  const disconnectWallet = () => {
    // Reset tất cả các state về giá trị ban đầu
    setAccount('');
    setBalance('0');
    setNetwork('');
    // Gọi callback onDisconnect nếu được truyền vào
    if (onDisconnect) onDisconnect();
  };

  const handleAccountsChanged = (accounts) => {
    // Xử lý khi người dùng đổi tài khoản trong MetaMask
    if (accounts.length === 0) {
      // Nếu không còn tài khoản nào được kết nối, ngắt kết nối
      disconnectWallet();
    } else {
      // Nếu đổi sang tài khoản khác, reload trang để cập nhật thông tin mới
      window.location.reload();
    }
  };

  const handleChainChanged = () => {
    // Khi đổi mạng blockchain, reload trang để cập nhật thông tin
    window.location.reload();
  };

  const formatAddress = (addr) =>
    // Rút gọn địa chỉ ví: hiển thị 6 ký tự đầu ... 4 ký tự cuối
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="wallet-connect">
      {!account ? (
        // Hiển thị nút kết nối khi chưa có tài khoản
        <button
          className="connect-btn"
          onClick={connectWallet}
          disabled={isConnecting} // Vô hiệu hóa nút khi đang kết nối
        >
          {isConnecting ? '🔄 Đang kết nối...' : '🔗 Kết nối Wallet'}
        </button>
      ) : (
        // Hiển thị thông tin ví khi đã kết nối
        <div className="wallet-info">
          <div className="wallet-details">
            {/* Hiển thị địa chỉ ví (dạng rút gọn) */}
            <div className="info-item">
              <span className="label">Địa chỉ:</span>
              <span className="value" title={account}>
                {formatAddress(account)}
              </span>
            </div>
            {/* Hiển thị số dư ETH */}
            <div className="info-item">
              <span className="label">Số dư:</span>
              <span className="value">{balance} ETH</span>
            </div>
            {/* Hiển thị tên mạng */}
            <div className="info-item">
              <span className="label">Mạng:</span>
              <span className="value network">{network}</span>
            </div>
          </div>
          {/* Nút ngắt kết nối */}
          <button className="disconnect-btn" onClick={disconnectWallet}>
            ❌ Ngắt kết nối
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;