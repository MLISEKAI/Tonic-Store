import React from 'react';
import { Card, Typography, List, Alert } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TermsPage: React.FC = () => {
  const sections = [
    {
      title: '1. Điều Khoản Chung',
      content: (
        <div>
          <Paragraph>
            Bằng việc sử dụng website và dịch vụ của Tonic Store, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. 
            Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
          </Paragraph>
          <List
            dataSource={[
              'Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ',
              'Thông tin bạn cung cấp phải chính xác và cập nhật',
              'Bạn chịu trách nhiệm bảo mật tài khoản của mình',
              'Không được sử dụng dịch vụ cho mục đích bất hợp pháp',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '2. Đăng Ký Tài Khoản',
      content: (
        <div>
          <Paragraph>
            Để sử dụng đầy đủ các tính năng của website, bạn cần tạo tài khoản. Quá trình đăng ký bao gồm:
          </Paragraph>
          <List
            dataSource={[
              'Cung cấp thông tin cá nhân chính xác',
              'Tạo mật khẩu mạnh và bảo mật',
              'Xác nhận email để kích hoạt tài khoản',
              'Cập nhật thông tin khi có thay đổi',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
          <Alert
            message="Lưu ý quan trọng"
            description="Chúng tôi có quyền từ chối hoặc chấm dứt tài khoản nếu phát hiện thông tin giả mạo hoặc vi phạm điều khoản."
            type="warning"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      title: '3. Đặt Hàng và Thanh Toán',
      content: (
        <div>
          <Paragraph>
            Khi đặt hàng trên website, bạn cần tuân thủ các quy định sau:
          </Paragraph>
          <List
            dataSource={[
              'Đơn hàng chỉ có hiệu lực sau khi được xác nhận',
              'Giá sản phẩm có thể thay đổi mà không báo trước',
              'Phí vận chuyển được tính theo quy định hiện hành',
              'Thanh toán phải được thực hiện đúng hạn',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '4. Giao Hàng và Nhận Hàng',
      content: (
        <div>
          <Paragraph>
            Chúng tôi cam kết giao hàng đúng thời gian và chất lượng:
          </Paragraph>
          <List
            dataSource={[
              'Thời gian giao hàng: 1-7 ngày tùy địa điểm',
              'Kiểm tra hàng hóa trước khi thanh toán (COD)',
              'Báo cáo ngay nếu có vấn đề với đơn hàng',
              'Chúng tôi không chịu trách nhiệm nếu không liên hệ được',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '5. Đổi Trả và Hoàn Tiền',
      content: (
        <div>
          <Paragraph>
            Chính sách đổi trả và hoàn tiền của chúng tôi:
          </Paragraph>
          <List
            dataSource={[
              'Thời gian đổi trả: 7 ngày kể từ khi nhận hàng',
              'Sản phẩm phải còn nguyên vẹn, có hóa đơn',
              'Phí vận chuyển đổi trả do khách hàng chịu',
              'Hoàn tiền trong vòng 3-5 ngày làm việc',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
          <Alert
            message="Điều kiện đổi trả"
            description="Một số sản phẩm không được đổi trả: đồ lót, sản phẩm đã sử dụng, sản phẩm có dấu hiệu hư hỏng do người dùng."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      title: '6. Bảo Mật Thông Tin',
      content: (
        <div>
          <Paragraph>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
          </Paragraph>
          <List
            dataSource={[
              'Mã hóa thông tin nhạy cảm',
              'Không chia sẻ thông tin với bên thứ ba',
              'Tuân thủ Luật An toàn thông tin mạng',
              'Bạn có quyền yêu cầu xóa thông tin cá nhân',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '7. Trách Nhiệm và Giới Hạn',
      content: (
        <div>
          <Paragraph>
            Trách nhiệm của các bên trong việc sử dụng dịch vụ:
          </Paragraph>
          <List
            dataSource={[
              'Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp',
              'Khách hàng chịu trách nhiệm về việc sử dụng sản phẩm',
              'Chúng tôi có quyền thay đổi điều khoản mà không báo trước',
              'Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền',
            ]}
            renderItem={(item) => (
              <List.Item>
                <ExclamationCircleOutlined className="text-orange-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '8. Quyền Sở Hữu Trí Tuệ',
      content: (
        <div>
          <Paragraph>
            Tất cả nội dung trên website đều thuộc quyền sở hữu của Tonic Store:
          </Paragraph>
          <List
            dataSource={[
              'Logo, hình ảnh, văn bản thuộc bản quyền của chúng tôi',
              'Không được sao chép, phân phối mà không có sự đồng ý',
              'Vi phạm bản quyền sẽ bị xử lý theo pháp luật',
              'Khách hàng có quyền sử dụng cho mục đích cá nhân',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Điều Khoản Sử Dụng
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Các điều khoản và điều kiện sử dụng dịch vụ của Tonic Store
          </Paragraph>
          <Text className="text-sm text-gray-500">
            Cập nhật lần cuối: 15/01/2024
          </Text>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <Alert
            message="Thông báo quan trọng"
            description="Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ. Việc sử dụng website đồng nghĩa với việc bạn đồng ý tuân thủ các điều khoản này."
            type="warning"
            showIcon
            className="mb-4"
          />
          <Paragraph>
            Chào mừng bạn đến với Tonic Store! Các điều khoản sử dụng này ("Điều khoản") điều chỉnh việc sử dụng 
            website và dịch vụ của chúng tôi. Bằng việc truy cập hoặc sử dụng website, bạn đồng ý bị ràng buộc bởi 
            các điều khoản này.
          </Paragraph>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <Title level={2} className="text-blue-600 mb-4">
                {section.title}
              </Title>
              {section.content}
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-12 bg-gray-50">
          <Title level={3} className="text-center mb-4">
            Liên Hệ Về Điều Khoản
          </Title>
          <div className="text-center">
            <Paragraph>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:
            </Paragraph>
            <div className="space-y-2">
              <Text strong>Email: legal@tonicstore.com</Text><br />
              <Text strong>Hotline: 1900 1234</Text><br />
              <Text strong>Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM</Text>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <Text className="text-gray-500">
            Bằng việc sử dụng website này, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các điều khoản sử dụng.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
