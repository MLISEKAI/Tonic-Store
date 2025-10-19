// Sử dụng namespace để tránh xung đột với biến toàn cục
export const VNPayTimer = {
  timer: null as ReturnType<typeof setInterval> | null,
  startTime: null as number | null,

  startTimer(callback: () => void, interval: number = 1000) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(callback, interval);
    this.startTime = Date.now();
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.startTime = null;
  },

  updateTime() {
    if (!this.startTime) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    return elapsedTime;
  },

  getRemainingTime(timeoutMinutes: number = 15) {
    if (!this.startTime) return 0;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    const remainingTime = timeoutMinutes * 60 * 1000 - elapsedTime;
    return Math.max(0, remainingTime);
  }
}; 