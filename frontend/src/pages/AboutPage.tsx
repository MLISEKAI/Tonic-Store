import { FC } from 'react';

const AboutPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Về chúng tôi</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          Chào mừng bạn đến với Tonic Store - cửa hàng trực tuyến hàng đầu về các sản phẩm điện tử và phụ kiện.
        </p>
        <p className="mb-4">
          Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả cạnh tranh.
        </p>
        <h2 className="text-xl font-semibold mb-2">Tầm nhìn</h2>
        <p className="mb-4">
          Trở thành địa chỉ mua sắm trực tuyến đáng tin cậy nhất cho người tiêu dùng Việt Nam.
        </p>
        <h2 className="text-xl font-semibold mb-2">Sứ mệnh</h2>
        <p className="mb-4">
          Cung cấp trải nghiệm mua sắm trực tuyến tuyệt vời với dịch vụ khách hàng tận tâm và sản phẩm chất lượng.
        </p>
      </div>
    </div>
  );
};

export default AboutPage; 