import React from 'react';
import VNPayQRCode from './VNPayQRCode';

interface VNPayPaymentProps {
  paymentUrl: string;
  onTimeout: () => void;
}

const VNPayPayment: React.FC<VNPayPaymentProps> = (props) => {
  return <VNPayQRCode {...props} />;
};

export default VNPayPayment; 