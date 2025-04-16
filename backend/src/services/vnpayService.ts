import crypto from 'crypto';
import { config } from '../config';

export const createPaymentUrl = (orderId: number, amount: number, ipAddr: string): string => {
  const tmnCode = config.vnpay.tmnCode;
  const secretKey = config.vnpay.secretKey;
  const vnpUrl = config.vnpay.url;
  const returnUrl = config.vnpay.returnUrl;
  
  const date = new Date();
  const createDate = date.toISOString().replace(/-/g, '').replace('T', '').replace(/:/g, '').split('.')[0];
  
  const orderIdStr = orderId.toString().padStart(6, '0');
  const amountStr = (amount * 100).toString();
  
  const vnpParams: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: amountStr,
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: ipAddr,
    vnp_Locale: 'vn',
    vnp_OrderInfo: `Thanh toan don hang #${orderIdStr}`,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: orderIdStr,
  };

  // Sort params by key
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((acc: Record<string, string>, key: string) => {
      acc[key] = vnpParams[key];
      return acc;
    }, {});

  // Create query string
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  // Create secure hash
  const secureHash = crypto
    .createHmac('sha512', secretKey)
    .update(queryString)
    .digest('hex');

  return `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;
};

export const verifyPayment = (query: Record<string, string>): boolean => {
  const secretKey = config.vnpay.secretKey;
  const secureHash = query.vnp_SecureHash;
  
  // Remove secure hash from query
  delete query.vnp_SecureHash;
  delete query.vnp_SecureHashType;

  // Sort params by key
  const sortedParams = Object.keys(query)
    .sort()
    .reduce((acc: Record<string, string>, key: string) => {
      acc[key] = query[key];
      return acc;
    }, {});

  // Create query string
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  // Create secure hash
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(queryString)
    .digest('hex');

  return hash === secureHash;
}; 