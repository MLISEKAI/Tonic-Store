import React from 'react';
import { Card, Typography, List, Alert } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const PrivacyPage: React.FC = () => {
  const sections = [
    {
      title: '1. Thông Tin Chúng Tôi Thu Thập',
      content: (
        <div>
          <Paragraph>
            Chúng tôi thu thập các loại thông tin sau để cung cấp và cải thiện dịch vụ:
          </Paragraph>
          <List
            dataSource={[
              'Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ',
              'Thông tin thanh toán: Số thẻ, tài khoản ngân hàng (được mã hóa)',
              'Thông tin giao dịch: Lịch sử mua hàng, sở thích',
              'Thông tin kỹ thuật: IP, trình duyệt, thiết bị truy cập',
              'Cookies và công nghệ tương tự để cải thiện trải nghiệm',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-blue-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '2. Mục Đích Sử Dụng Thông Tin',
      content: (
        <div>
          <Paragraph>
            Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
          </Paragraph>
          <List
            dataSource={[
              'Xử lý đơn hàng và giao dịch',
              'Cung cấp dịch vụ khách hàng',
              'Gửi thông báo về đơn hàng và sản phẩm',
              'Cải thiện website và dịch vụ',
              'Phân tích xu hướng và hành vi mua sắm',
              'Tuân thủ nghĩa vụ pháp lý',
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
      title: '3. Chia Sẻ Thông Tin',
      content: (
        <div>
          <Paragraph>
            Chúng tôi cam kết không bán thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong các trường hợp:
          </Paragraph>
          <List
            dataSource={[
              'Với nhà cung cấp dịch vụ đáng tin cậy (vận chuyển, thanh toán)',
              'Khi có yêu cầu từ cơ quan pháp luật',
              'Để bảo vệ quyền lợi và an toàn của chúng tôi',
              'Với sự đồng ý rõ ràng của bạn',
              'Trong trường hợp sáp nhập hoặc chuyển nhượng công ty',
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
      title: '4. Bảo Mật Thông Tin',
      content: (
        <div>
          <Paragraph>
            Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
          </Paragraph>
          <List
            dataSource={[
              'Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải',
              'Mã hóa cơ sở dữ liệu với AES-256',
              'Kiểm soát truy cập nghiêm ngặt',
              'Giám sát bảo mật 24/7',
              'Đào tạo nhân viên về bảo mật thông tin',
              'Cập nhật thường xuyên các biện pháp bảo mật',
            ]}
            renderItem={(item) => (
              <List.Item>
                <SafetyOutlined className="text-blue-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: '5. Quyền Của Bạn',
      content: (
        <div>
          <Paragraph>
            Bạn có các quyền sau đối với thông tin cá nhân của mình:
          </Paragraph>
          <List
            dataSource={[
              'Quyền truy cập: Xem thông tin chúng tôi lưu trữ về bạn',
              'Quyền chỉnh sửa: Cập nhật thông tin không chính xác',
              'Quyền xóa: Yêu cầu xóa thông tin cá nhân',
              'Quyền hạn chế: Hạn chế xử lý thông tin của bạn',
              'Quyền di chuyển: Nhận dữ liệu dưới dạng có thể đọc được',
              'Quyền phản đối: Phản đối việc xử lý thông tin',
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
      title: '6. Cookies và Công Nghệ Theo Dõi',
      content: (
        <div>
          <Paragraph>
            Chúng tôi sử dụng cookies và các công nghệ tương tự để:
          </Paragraph>
          <List
            dataSource={[
              'Ghi nhớ tùy chọn của bạn',
              'Cải thiện hiệu suất website',
              'Phân tích lưu lượng truy cập',
              'Cá nhân hóa nội dung và quảng cáo',
              'Đảm bảo bảo mật',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-blue-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
          <Alert
            message="Quản lý Cookies"
            description="Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến trải nghiệm sử dụng."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      title: '7. Lưu Trữ Thông Tin',
      content: (
        <div>
          <Paragraph>
            Chúng tôi lưu trữ thông tin của bạn trong thời gian cần thiết:
          </Paragraph>
          <List
            dataSource={[
              'Thông tin tài khoản: Cho đến khi bạn xóa tài khoản',
              'Thông tin giao dịch: 7 năm theo quy định pháp luật',
              'Thông tin marketing: Cho đến khi bạn hủy đăng ký',
              'Cookies: Theo thời gian quy định của từng loại',
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
      title: '8. Thay Đổi Chính Sách',
      content: (
        <div>
          <Paragraph>
            Chúng tôi có thể cập nhật chính sách này theo thời gian:
          </Paragraph>
          <List
            dataSource={[
              'Thông báo trước 30 ngày về những thay đổi quan trọng',
              'Cập nhật ngày hiệu lực ở đầu trang',
              'Gửi email thông báo cho người dùng đã đăng ký',
              'Đăng thông báo nổi bật trên website',
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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Chính Sách Bảo Mật
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn
          </Paragraph>
          <Text className="text-sm text-gray-500">
            Cập nhật lần cuối: 15/01/2024
          </Text>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <Alert
            message="Cam kết bảo mật"
            description="Tonic Store cam kết bảo vệ thông tin cá nhân của bạn và tuân thủ nghiêm ngặt các quy định về bảo mật thông tin."
            type="success"
            showIcon
            className="mb-4"
          />
          <Paragraph>
            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân 
            của bạn khi sử dụng website và dịch vụ của Tonic Store. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn 
            và tuân thủ Luật An toàn thông tin mạng Việt Nam.
          </Paragraph>
        </Card>

        {/* Privacy Sections */}
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
        <Card className="mt-12 bg-blue-50">
          <Title level={3} className="text-center mb-4">
            Liên Hệ Về Bảo Mật
          </Title>
          <div className="text-center">
            <Paragraph>
              Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
            </Paragraph>
            <div className="space-y-2">
              <Text strong>Email: privacy@tonicstore.com</Text><br />
              <Text strong>Hotline: 1900 1234</Text><br />
              <Text strong>Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM</Text>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <Text className="text-gray-500">
            Bằng việc sử dụng website này, bạn xác nhận rằng bạn đã đọc và hiểu chính sách bảo mật của chúng tôi.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
