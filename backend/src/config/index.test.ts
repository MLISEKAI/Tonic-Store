import config from "./index";

describe("Config", () => {
  it("should have vnpay, jwt và database cấu hình", () => {
    expect(config).toHaveProperty('vnpay');
    expect(config).toHaveProperty('jwt');
    expect(config).toHaveProperty('database');
  });
});
