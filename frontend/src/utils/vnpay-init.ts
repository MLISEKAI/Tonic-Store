// Khởi tạo biến timer toàn cục cho VNPAY
declare global {
  interface Window {
    timer: any;
    updateTime: () => void;
  }
}

// Khởi tạo biến timer
window.timer = null;

// Hàm updateTime cho VNPAY
window.updateTime = function() {
  if (window.timer) {
    clearInterval(window.timer);
  }
  window.timer = setInterval(function() {
    // Logic cập nhật thời gian của VNPAY
  }, 1000);
};

export {}; 