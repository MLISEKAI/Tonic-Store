import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VNPayTimer } from '../utils/vnpay-timer';
import QRCode from 'qrcode';
import '../utils/vnpay-init';

interface VNPayQRCodeProps {
  paymentUrl: string;
  onTimeout: () => void;
}

const VNPayQRCode: React.FC<VNPayQRCodeProps> = ({ paymentUrl, onTimeout }) => {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number>(15 * 60 * 1000);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // Tạo QR code
    QRCode.toDataURL(paymentUrl, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
      });

    // Bắt đầu timer
    VNPayTimer.startTimer(() => {
      const timeLeft = VNPayTimer.getRemainingTime();
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        VNPayTimer.stopTimer();
        onTimeout();
        navigate('/checkout?error=payment_timeout');
      }
    }, 1000);

    return () => {
      VNPayTimer.stopTimer();
    };
  }, [paymentUrl, navigate, onTimeout]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">Quét mã QR để thanh toán</h2>

        <div className="mb-4 p-4 bg-white rounded-lg shadow-lg">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="w-64 h-64 mx-auto"
            />
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Thời gian còn lại: {formatTime(remainingTime)}</p>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>Hoặc mở ứng dụng ngân hàng và quét mã QR</p>
          <p>Mã QR sẽ hết hạn sau khi hết thời gian</p>
        </div>

        <button
          onClick={() => window.location.href = paymentUrl}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Mở trang thanh toán
        </button>
      </div>
    </div>
  );
};

export default VNPayQRCode; 