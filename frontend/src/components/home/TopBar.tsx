import { Alert } from 'antd';
import { ShoppingOutlined, GiftOutlined, CarOutlined } from '@ant-design/icons';

const TopBar = () => {
  return (
    <div className="bg-blue-600 text-white py-2">
      <div className="container mx-auto px-4">
        <Alert
          message={
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span className="flex items-center">
                <CarOutlined className="mr-1" /> Miễn phí vận chuyển đơn từ 300K
              </span>
              <span className="flex items-center">
                <GiftOutlined className="mr-1" /> Đổi trả trong 7 ngày
              </span>
              <span className="flex items-center">
                <ShoppingOutlined className="mr-1" /> Thanh toán an toàn
              </span>
            </div>
          }
          type="info"
          showIcon={false}
          className="bg-transparent border-none text-white"
        />
      </div>
    </div>
  );
};

export default TopBar; 