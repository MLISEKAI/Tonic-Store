import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Collapse, Typography, Space, Tag, Button, Input, Row, Col, List, Alert, AutoComplete, Spin } from 'antd';
import { 
  WalletOutlined, 
  PhoneOutlined, 
  MailOutlined,
  SearchOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  BankOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface FAQSearchResult {
  id: number;
  question: string;
  category: string;
  answer: string;
  relevanceScore: number;
}

const WalletHelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FAQSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FAQSearchResult[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search for suggestions
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setSuggestionsLoading(true);
        try {
          const response = await fetch(`http://localhost:8085/api/help-center/wallet/search?q=${encodeURIComponent(query)}&limit=5`);
          const data = await response.json();
          if (data.success) {
            setSuggestions(data.data || []);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSuggestionsLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle search submission
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(`http://localhost:8085/api/help-center/wallet/search?q=${encodeURIComponent(value)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching FAQs:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion select
  const handleSuggestionSelect = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    handleSearch(value);
  };

  const faqData = [
    {
      key: '1',
      label: 'Ví Tonic Store là gì?',
      children: (
        <div>
          <Paragraph>
            Ví Tonic Store là dịch vụ ví điện tử tích hợp trong nền tảng Tonic Store, 
            cho phép bạn thanh toán nhanh chóng, an toàn và tiện lợi cho các giao dịch mua sắm.
          </Paragraph>
          <div className="mt-4">
            <Text strong>Tính năng chính:</Text>
            <ul className="mt-2">
              <li>Thanh toán đơn hàng nhanh chóng</li>
              <li>Nạp tiền từ ngân hàng</li>
              <li>Rút tiền về tài khoản ngân hàng</li>
              <li>Chuyển tiền cho người dùng khác</li>
              <li>Xem lịch sử giao dịch chi tiết</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Làm thế nào để nạp tiền vào ví?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể nạp tiền vào ví Tonic Store bằng các cách sau:
          </Paragraph>
          <ol>
            <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển tiền từ tài khoản ngân hàng của bạn</li>
            <li><strong>Thẻ ATM/Credit:</strong> Sử dụng thẻ ATM hoặc thẻ tín dụng</li>
            <li><strong>Ví điện tử khác:</strong> Chuyển từ ví điện tử khác như MoMo, ZaloPay</li>
            <li><strong>Tiền mặt:</strong> Nạp tiền mặt tại các điểm giao dịch</li>
          </ol>
          <Alert
            message="Lưu ý"
            description="Phí nạp tiền có thể áp dụng tùy theo phương thức. Vui lòng kiểm tra trước khi thực hiện."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Làm thế nào để rút tiền từ ví?',
      children: (
        <div>
          <Paragraph>
            Để rút tiền từ ví về tài khoản ngân hàng:
          </Paragraph>
          <ol>
            <li>Đăng nhập vào tài khoản Tonic Store</li>
            <li>Vào mục "Ví" → "Rút tiền"</li>
            <li>Nhập số tiền muốn rút (tối thiểu 50,000 VND)</li>
            <li>Chọn tài khoản ngân hàng đã liên kết</li>
            <li>Xác nhận thông tin và hoàn tất</li>
          </ol>
          <div className="mt-4">
            <Text strong>Thời gian xử lý:</Text>
            <ul className="mt-2">
              <li>Trong giờ hành chính: 1-2 giờ</li>
              <li>Ngoài giờ hành chính: 24 giờ</li>
              <li>Cuối tuần và ngày lễ: 48 giờ</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '4',
      label: 'Phí sử dụng ví như thế nào?',
      children: (
        <div>
          <Paragraph>
            Ví Tonic Store áp dụng các mức phí như sau:
          </Paragraph>
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} sm={12}>
              <Card size="small" title="Nạp tiền">
                <ul>
                  <li>Chuyển khoản ngân hàng: <Text type="success">Miễn phí</Text></li>
                  <li>Thẻ ATM: 1.5% (tối thiểu 3,000 VND)</li>
                  <li>Thẻ Credit: 2.5% (tối thiểu 5,000 VND)</li>
                  <li>Ví điện tử khác: 1% (tối thiểu 2,000 VND)</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" title="Rút tiền">
                <ul>
                  <li>Rút về ngân hàng: 0.5% (tối thiểu 2,000 VND)</li>
                  <li>Chuyển tiền cho người dùng khác: <Text type="success">Miễn phí</Text></li>
                  <li>Thanh toán đơn hàng: <Text type="success">Miễn phí</Text></li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Làm sao để bảo mật ví?',
      children: (
        <div>
          <Paragraph>
            Để đảm bảo an toàn cho ví của bạn:
          </Paragraph>
          <List
            dataSource={[
              'Đặt mật khẩu mạnh và không chia sẻ với ai',
              'Bật xác thực 2 lớp (2FA)',
              'Không sử dụng mạng WiFi công cộng khi giao dịch',
              'Thường xuyên kiểm tra lịch sử giao dịch',
              'Đăng xuất khỏi tài khoản sau khi sử dụng',
              'Cập nhật ứng dụng thường xuyên',
              'Không click vào link lạ hoặc email đáng ngờ'
            ]}
            renderItem={(item) => (
              <List.Item>
                <SafetyOutlined className="text-green-600 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: '6',
      label: 'Ví bị khóa phải làm sao?',
      children: (
        <div>
          <Paragraph>
            Nếu ví của bạn bị khóa, có thể do các nguyên nhân sau:
          </Paragraph>
          <ul>
            <li>Nhập sai mật khẩu nhiều lần</li>
            <li>Giao dịch bất thường hoặc đáng ngờ</li>
            <li>Vi phạm điều khoản sử dụng</li>
            <li>Yêu cầu bảo mật từ hệ thống</li>
          </ul>
          <Alert
            message="Cách khắc phục"
            description="Liên hệ ngay với bộ phận hỗ trợ khách hàng qua hotline hoặc email để được hỗ trợ mở khóa tài khoản."
            type="warning"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      key: '7',
      label: 'Làm thế nào để liên kết ngân hàng?',
      children: (
        <div>
          <Paragraph>
            Để liên kết tài khoản ngân hàng với ví:
          </Paragraph>
          <ol>
            <li>Vào mục "Ví" → "Liên kết ngân hàng"</li>
            <li>Chọn ngân hàng của bạn từ danh sách</li>
            <li>Nhập thông tin tài khoản ngân hàng</li>
            <li>Xác thực qua SMS hoặc OTP</li>
            <li>Hoàn tất liên kết</li>
          </ol>
          <div className="mt-4">
            <Text strong>Ngân hàng được hỗ trợ:</Text>
            <div className="mt-2">
              <Tag color="blue">Vietcombank</Tag>
              <Tag color="green">BIDV</Tag>
              <Tag color="orange">VietinBank</Tag>
              <Tag color="purple">Techcombank</Tag>
              <Tag color="cyan">ACB</Tag>
              <Tag color="red">Sacombank</Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '8',
      label: 'Giao dịch bị lỗi phải làm sao?',
      children: (
        <div>
          <Paragraph>
            Nếu giao dịch bị lỗi, bạn có thể:
          </Paragraph>
          <ol>
            <li><strong>Kiểm tra lại:</strong> Xem lại thông tin giao dịch</li>
            <li><strong>Thử lại:</strong> Thực hiện lại giao dịch sau 5-10 phút</li>
            <li><strong>Kiểm tra số dư:</strong> Đảm bảo có đủ tiền trong ví</li>
            <li><strong>Liên hệ hỗ trợ:</strong> Nếu vấn đề vẫn tiếp diễn</li>
          </ol>
          <Alert
            message="Quan trọng"
            description="Nếu tiền đã bị trừ nhưng giao dịch không thành công, tiền sẽ được hoàn lại tự động trong vòng 24 giờ."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    }
  ];

  // Filter FAQs based on search results only
  const filteredFAQs = searchResults.length > 0 
    ? searchResults.map(result => ({
        key: result.id.toString(),
        label: result.question,
        children: (
          <div>
            <Paragraph>{result.answer}</Paragraph>
            <Tag color="blue">{result.category}</Tag>
          </div>
        ),
      }))
    : faqData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <WalletOutlined className="text-blue-600" />
            Hướng dẫn sử dụng Ví Tonic Store
          </Title>
          <Text className="text-lg text-gray-600">
            Tìm hiểu cách sử dụng ví điện tử một cách an toàn và hiệu quả
          </Text>
        </div>

        {/* Search with Autocomplete */}
        <div className="mb-8">
          <AutoComplete
            value={searchTerm}
            onChange={handleSearchChange}
            onSelect={handleSuggestionSelect}
            options={suggestions.map(suggestion => ({
              value: suggestion.question,
              label: (
                <div>
                  <div className="font-medium">{suggestion.question}</div>
                  <div className="text-sm text-gray-500">{suggestion.category}</div>
                </div>
              ),
            }))}
            open={showSuggestions && (suggestions.length > 0 || suggestionsLoading)}
            onDropdownVisibleChange={(open) => setShowSuggestions(open)}
            className="w-full"
            notFoundContent={suggestionsLoading ? <Spin size="small" /> : "Không tìm thấy gợi ý"}
          >
            <Search
              placeholder="Tìm kiếm câu hỏi về ví..."
              allowClear
              size="large"
              onSearch={handleSearch}
              loading={loading}
              prefix={<SearchOutlined />}
              className="w-full"
            />
          </AutoComplete>
        </div>

        {/* Quick Links */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CreditCardOutlined className="text-3xl text-blue-600 mb-3" />
              <Title level={4}>Nạp tiền</Title>
              <Text type="secondary">Hướng dẫn nạp tiền vào ví</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <BankOutlined className="text-3xl text-green-600 mb-3" />
              <Title level={4}>Rút tiền</Title>
              <Text type="secondary">Cách rút tiền về ngân hàng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <SafetyOutlined className="text-3xl text-red-600 mb-3" />
              <Title level={4}>Bảo mật</Title>
              <Text type="secondary">Bảo vệ ví an toàn</Text>
            </Card>
          </Col>
        </Row>

        {/* Search Results or FAQ Section */}
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4">Đang tìm kiếm...</div>
          </div>
        ) : (
          <div className="mb-8">
            <Title level={2} className="text-center mb-6">
              {searchResults.length > 0 ? (
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {searchResults.length} Kết quả tìm kiếm cho "{searchTerm}"
                  </div>
                </div>
              ) : (
                'Câu hỏi thường gặp'
              )}
            </Title>
            <Collapse
              items={filteredFAQs}
              className="bg-white"
              size="large"
            />
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Không tìm thấy câu trả lời?
              </Title>
              <Text className="text-blue-700">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </Text>
              <Space>
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  Gọi Hotline: 1900-xxxx
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  Email: support@tonicstore.com
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletHelpPage;
