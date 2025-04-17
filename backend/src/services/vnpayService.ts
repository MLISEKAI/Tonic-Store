import crypto from 'crypto';
import qs from 'qs';

const VNPAY_CONFIG = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE || '',
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET || '',
  vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/return',
  vnp_ApiUrl: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
};

export const createPaymentUrl = (orderId: number, amount: number, bankCode?: string) => {
  const date = new Date();
  const createDate = date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const ipAddr = '127.0.0.1';
  const txnRef = `TONIC-${orderId}-${Date.now()}`;
  const orderInfo = `Thanh toan don hang #${orderId}`;
  const orderType = 'other';
  const locale = 'vn';
  const currCode = 'VND';
  const vnp_Amount = amount * 100; // VNPay yêu cầu số tiền nhân 100

  let vnp_Params: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: vnp_Amount,
    vnp_ReturnUrl: VNPAY_CONFIG.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Sắp xếp các tham số theo thứ tự alphabet
  vnp_Params = sortObject(vnp_Params);

  // Tạo chuỗi hash
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  // Tạo URL thanh toán
  const paymentUrl = VNPAY_CONFIG.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });
  
  return paymentUrl;
};

const sortObject = (obj: any) => {
  const sorted: any = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

export const verifyPayment = (query: Record<string, string>): boolean => {
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
    .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
    .update(queryString)
    .digest('hex');

  return hash === secureHash;
}; 