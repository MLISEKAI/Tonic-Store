import { useLiveChat } from '../../hooks';

const TAWK_TO_ID = 'YOUR_TAWK_TO_ID'; // Thay thế bằng ID thực của bạn

const LiveChat = () => {
  useLiveChat(TAWK_TO_ID);
  return null; // Component này không render gì cả
};

export default LiveChat; 