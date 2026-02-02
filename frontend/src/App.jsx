import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import QRScanner from './components/QRScanner';
import ProductCard from './components/ProductCard';
import VerificationTimeline from './components/VerificationTimeline';
import QRCodeGenerator from './components/QRCodeGenerator';
import Loader from './components/Loader';
import contractAddress from './blockchain/contract-address.json';
import CosmeticAuthenticationABI from './blockchain/CosmeticAuthentication.json';
import './App.css';

/* ===== CRONOS TESTNET CONFIG ===== */
const CRONOS_TESTNET = {
  chainId: '0x152',
  chainName: 'Cronos Testnet',
  nativeCurrency: {
    name: 'TCRO',
    symbol: 'TCRO',
    decimals: 18,
  },
  rpcUrls: ['https://evm-t3.cronos.org'],
  blockExplorerUrls: ['https://testnet.cronoscan.com'],
};

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form đăng ký
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    brand: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    manufacturer: ''
  });

  // Xác thực
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [isExpired, setIsExpired] = useState(false);

  // QR
  const [generatedQR, setGeneratedQR] = useState({ id: '', name: '' });

  /* ================= WALLET ================= */

  const handleWalletConnect = async () => {
    try {
      if (!window.ethereum) {
        showMessage('Vui lòng cài đặt MetaMask để tiếp tục!', 'error');
        return;
      }

      // ===== Kiểm tra & chuyển chain =====
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (currentChainId !== '0x152') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x152' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [CRONOS_TESTNET],
            });
          } else {
            throw switchError;
          }
        }
      }

      // ===== Kết nối ví (ethers v5) =====
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(account);

      const contractInstance = new ethers.Contract(
        contractAddress.CosmeticAuthentication,
        CosmeticAuthenticationABI.abi,
        signer
      );

      setContract(contractInstance);
      showMessage('Kết nối ví thành công! 🎉', 'success');
    } catch (error) {
      console.error(error);
      showMessage('Không thể kết nối ví. Vui lòng thử lại!', 'error');
    }
  };

  const handleWalletDisconnect = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount('');
    setVerificationResult(null);
    setGeneratedQR({ id: '', name: '' });
    showMessage('Đã ngắt kết nối ví', 'info');
  };

  /* ================= UTIL ================= */

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= REGISTER ================= */

  const registerProduct = async (e) => {
    e.preventDefault();
    if (!contract) {
      showMessage('Vui lòng kết nối ví trước!', 'error');
      return;
    }

    setLoading(true);
    try {
      const mfgDate = Math.floor(new Date(formData.manufacturingDate).getTime() / 1000);
      const expDate = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

      const tx = await contract.registerProduct(
        formData.productId,
        formData.productName,
        formData.brand,
        formData.batchNumber,
        mfgDate,
        expDate,
        formData.manufacturer
      );

      await tx.wait();

      showMessage('✓ Đăng ký sản phẩm thành công!', 'success');
      setGeneratedQR({ id: formData.productId, name: formData.productName });
      
      // Chuyển sang tab QR sau 1 giây
      setTimeout(() => setActiveTab('qr'), 1000);

      setFormData({
        productId: '',
        productName: '',
        brand: '',
        batchNumber: '',
        manufacturingDate: '',
        expiryDate: '',
        manufacturer: ''
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes('Product already exists')) {
        showMessage('Mã sản phẩm đã tồn tại!', 'error');
      } else {
        showMessage('Lỗi khi đăng ký sản phẩm. Vui lòng thử lại!', 'error');
      }
    }
    setLoading(false);
  };

  /* ================= VERIFY ================= */

  const verifyProduct = async (productId) => {
    if (!contract) {
      showMessage('Vui lòng kết nối ví trước!', 'error');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.verifyProduct(productId, 'Web Application');
      await tx.wait();

      const product = await contract.getProduct(productId);
      const history = await contract.getVerificationHistory(productId);
      const expired = await contract.isProductExpired(productId);

      setVerificationResult({
        productName: product[0],
        brand: product[1],
        batchNumber: product[2],
        manufacturingDate: Number(product[3]),
        expiryDate: Number(product[4]),
        manufacturer: product[5],
        isAuthentic: product[6],
        verificationCount: Number(product[7])
      });

      setVerificationHistory(
        history.map(log => ({
          verifier: log.verifier,
          timestamp: Number(log.timestamp),
          location: log.location
        }))
      );

      setIsExpired(expired);
      showMessage('✓ Xác thực sản phẩm thành công!', 'success');
    } catch (error) {
      console.error(error);
      showMessage('Không tìm thấy sản phẩm với mã này!', 'error');
      setVerificationResult(null);
      setVerificationHistory([]);
    }
    setLoading(false);
  };

  const handleScanSuccess = (data) => {
    verifyProduct(data);
  };

  /* ================= UI ================= */

  return (
    <div className="app-container">
      {loading && <Loader message="Đang xử lý giao dịch..." fullScreen />}

      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">🧴 Hệ Thống Xác Thực Mỹ Phẩm</h1>
            <p className="app-subtitle">Blockchain Authentication System</p>
          </div>
          <WalletConnect
            account={account}
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </header>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
          disabled={!account}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-text">Đăng Ký Sản Phẩm</span>
          {!account && <span className="lock-icon">🔒</span>}
        </button>

        <button
          className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
          disabled={!account}
        >
          <span className="tab-icon">🔍</span>
          <span className="tab-text">Xác Thực</span>
          {!account && <span className="lock-icon">🔒</span>}
        </button>

        <button
          className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
          disabled={!account}
        >
          <span className="tab-icon">📱</span>
          <span className="tab-text">QR Code</span>
          {!account && <span className="lock-icon">🔒</span>}
        </button>
      </div>

      <main className="app-content">
        {!account && (
          <div className="welcome-screen">
            <div className="welcome-icon">👋</div>
            <h2>Chào mừng đến với Hệ Thống Xác Thực</h2>
            <p>Vui lòng kết nối ví MetaMask của bạn để bắt đầu sử dụng các tính năng</p>
          </div>
        )}

        {account && activeTab === 'register' && (
          <div>
            <div className="section-header">
              <h2>Đăng Ký Sản Phẩm Mới</h2>
              <div className="warning-badge">⚠️ Chỉ nhà sản xuất được phép đăng ký</div>
            </div>

            <form className="register-form" onSubmit={registerProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    🔖 Mã Sản Phẩm
                  </label>
                  <input
                    type="text"
                    name="productId"
                    placeholder="Ví dụ: PROD-001"
                    required
                    value={formData.productId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    🏷️ Tên Sản Phẩm
                  </label>
                  <input
                    type="text"
                    name="productName"
                    placeholder="Ví dụ: Kem Dưỡng Da Premium"
                    required
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    ⭐ Thương Hiệu
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Ví dụ: L'Oréal"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    📦 Số Lô Sản Xuất
                  </label>
                  <input
                    type="text"
                    name="batchNumber"
                    placeholder="Ví dụ: BATCH-2024-001"
                    required
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    📅 Ngày Sản Xuất
                  </label>
                  <input
                    type="date"
                    name="manufacturingDate"
                    required
                    value={formData.manufacturingDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    ⏰ Ngày Hết Hạn
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  🏭 Nhà Sản Xuất
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="Ví dụ: ABC Cosmetics Co., Ltd"
                  required
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : '✓ Đăng Ký Sản Phẩm'}
              </button>
            </form>
          </div>
        )}

        {account && activeTab === 'verify' && (
          <div>
            <div className="section-header">
              <h2>Xác Thực Sản Phẩm</h2>
            </div>

            <QRScanner onScanSuccess={handleScanSuccess} />

            {verificationResult && (
              <div className="verification-results">
                <ProductCard product={verificationResult} isExpired={isExpired} />
                <VerificationTimeline history={verificationHistory} />
              </div>
            )}

            {!verificationResult && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Chưa có kết quả xác thực</h3>
                <p>Quét mã QR trên sản phẩm để kiểm tra tính xác thực</p>
              </div>
            )}
          </div>
        )}

        {account && activeTab === 'qr' && (
          <div>
            <div className="section-header">
              <h2>Mã QR Sản Phẩm</h2>
            </div>

            {generatedQR.id ? (
              <QRCodeGenerator 
                productId={generatedQR.id} 
                productName={generatedQR.name} 
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📱</div>
                <h3>Chưa có mã QR</h3>
                <p>Đăng ký sản phẩm mới để tạo mã QR</p>
                <button 
                  className="nav-btn" 
                  onClick={() => setActiveTab('register')}
                >
                  Đăng Ký Sản Phẩm
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        © 2026 Vương - Hào - Kiệt
      </footer>
    </div>
  );
}

export default App;