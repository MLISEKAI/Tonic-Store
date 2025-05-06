import { Card } from 'antd';
import { 
  SafetyCertificateOutlined, 
  RocketOutlined, 
  SyncOutlined, 
  LockOutlined 
} from '@ant-design/icons';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <SafetyCertificateOutlined className="text-4xl text-blue-500" />,
      title: 'Sản phẩm chính hãng',
      description: 'Cam kết 100% hàng chính hãng, có giấy tờ bảo hành đầy đủ'
    },
    {
      icon: <RocketOutlined className="text-4xl text-green-500" />,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng toàn quốc trong 24-48h, miễn phí cho đơn từ 300K'
    },
    {
      icon: <SyncOutlined className="text-4xl text-orange-500" />,
      title: 'Đổi trả dễ dàng',
      description: 'Chính sách đổi trả trong 7 ngày, hoàn tiền nhanh chóng'
    },
    {
      icon: <LockOutlined className="text-4xl text-purple-500" />,
      title: 'Bảo mật thông tin',
      description: 'Bảo mật thông tin khách hàng, thanh toán an toàn'
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-12">Tại sao chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs; 