import React, { useState, useCallback } from 'react';
import { Card, Collapse, Typography, Space, Tag, Button, Input, Row, Col, Alert, AutoComplete, Spin } from 'antd';
import { 
  GiftOutlined, 
  PhoneOutlined, 
  MailOutlined,
  SearchOutlined,
  StarOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  ShoppingOutlined,
  CrownOutlined
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

const XuHelpPage: React.FC = () => {
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
          const response = await fetch(`http://localhost:8085/api/help-center/xu/search?q=${encodeURIComponent(query)}&limit=5`);
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
      const response = await fetch(`http://localhost:8085/api/help-center/xu/search?q=${encodeURIComponent(value)}&limit=10`);
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
      label: 'Tonic Xu là gì?',
      children: (
        <div>
          <Paragraph>
            Tonic Xu là hệ thống điểm thưởng của Tonic Store, cho phép bạn tích lũy điểm 
            khi mua sắm và sử dụng để giảm giá cho các đơn hàng tiếp theo.
          </Paragraph>
          <div className="mt-4">
            <Text strong>Cách hoạt động:</Text>
            <ul className="mt-2">
              <li>Mua hàng → Nhận Xu (1 VND = 1 Xu)</li>
              <li>Tích lũy Xu trong tài khoản</li>
              <li>Sử dụng Xu để giảm giá đơn hàng</li>
              <li>Xu không có thời hạn sử dụng</li>
              <li>Xu không thể chuyển đổi thành tiền mặt</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Làm thế nào để tích lũy Tonic Xu?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể tích lũy Tonic Xu thông qua các hoạt động sau:
          </Paragraph>
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} sm={12}>
              <Card size="small" title="Mua sắm" className="h-full">
                <ul>
                  <li>Mua hàng: 1 VND = 1 Xu</li>
                  <li>Đánh giá sản phẩm: +10 Xu</li>
                  <li>Chia sẻ sản phẩm: +5 Xu</li>
                  <li>Mời bạn bè: +100 Xu</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" title="Hoạt động khác" className="h-full">
                <ul>
                  <li>Đăng nhập hàng ngày: +5 Xu</li>
                  <li>Hoàn thành hồ sơ: +50 Xu</li>
                  <li>Tham gia khảo sát: +20 Xu</li>
                  <li>Sự kiện đặc biệt: +100-1000 Xu</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Làm thế nào để sử dụng Tonic Xu?',
      children: (
        <div>
          <Paragraph>
            Để sử dụng Tonic Xu khi thanh toán:
          </Paragraph>
          <ol>
            <li>Thêm sản phẩm vào giỏ hàng</li>
            <li>Vào trang thanh toán</li>
            <li>Chọn "Sử dụng Tonic Xu"</li>
            <li>Nhập số Xu muốn sử dụng (tối đa 50% giá trị đơn hàng)</li>
            <li>Xác nhận và hoàn tất đơn hàng</li>
          </ol>
          <Alert
            message="Lưu ý quan trọng"
            description="Xu chỉ có thể sử dụng tối đa 50% giá trị đơn hàng. Phần còn lại phải thanh toán bằng tiền mặt hoặc ví điện tử."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Tonic Xu có thời hạn sử dụng không?',
      children: (
        <div>
          <Paragraph>
            Tonic Xu <Text strong>KHÔNG có thời hạn sử dụng</Text>, bạn có thể:
          </Paragraph>
          <ul>
            <li>Tích lũy Xu không giới hạn thời gian</li>
            <li>Sử dụng Xu bất kỳ lúc nào</li>
            <li>Xu không bị mất đi theo thời gian</li>
            <li>Có thể kiểm tra lịch sử Xu chi tiết</li>
          </ul>
          <div className="mt-4">
            <Text strong>Trường hợp Xu bị mất:</Text>
            <ul className="mt-2">
              <li>Vi phạm điều khoản sử dụng</li>
              <li>Gian lận trong việc tích lũy Xu</li>
              <li>Tài khoản bị khóa vĩnh viễn</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Làm sao để kiểm tra số dư Tonic Xu?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể kiểm tra số dư Tonic Xu bằng các cách sau:
          </Paragraph>
          <ol>
            <li><strong>Trang cá nhân:</strong> Đăng nhập → "Tài khoản của tôi" → "Tonic Xu"</li>
            <li><strong>App mobile:</strong> Mở app → "Tôi" → "Tonic Xu"</li>
            <li><strong>Khi thanh toán:</strong> Xuất hiện trong trang thanh toán</li>
            <li><strong>Email thông báo:</strong> Nhận email khi có Xu mới</li>
          </ol>
          <div className="mt-4">
            <Text strong>Thông tin hiển thị:</Text>
            <ul className="mt-2">
              <li>Số dư Xu hiện tại</li>
              <li>Lịch sử tích lũy Xu</li>
              <li>Lịch sử sử dụng Xu</li>
              <li>Xu sắp hết hạn (nếu có)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '6',
      label: 'Tonic Xu có thể chuyển đổi thành tiền mặt không?',
      children: (
        <div>
          <Paragraph>
            <Text strong>KHÔNG</Text>, Tonic Xu không thể chuyển đổi thành tiền mặt hoặc rút ra ngoài.
          </Paragraph>
          <Alert
            message="Chính sách Xu"
            description="Tonic Xu chỉ có thể sử dụng để giảm giá đơn hàng trên Tonic Store, không thể chuyển đổi thành tiền mặt, chuyển cho người khác hoặc rút ra ngoài."
            type="warning"
            showIcon
            className="mt-4"
          />
          <div className="mt-4">
            <Text strong>Xu có thể dùng để:</Text>
            <ul className="mt-2">
              <li>Giảm giá đơn hàng</li>
              <li>Mua sản phẩm (kết hợp với tiền mặt)</li>
              <li>Tham gia chương trình khuyến mãi đặc biệt</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '7',
      label: 'Làm thế nào để tăng cấp VIP với Tonic Xu?',
      children: (
        <div>
          <Paragraph>
            Tonic Xu giúp bạn tăng cấp VIP nhanh hơn:
          </Paragraph>
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} sm={8}>
              <Card size="small" title="Bronze" className="text-center">
                <CrownOutlined className="text-2xl text-orange-500 mb-2" />
                <div>0 - 10,000 Xu</div>
                <div className="text-sm text-gray-500">Giảm giá 2%</div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="Silver" className="text-center">
                <CrownOutlined className="text-2xl text-gray-400 mb-2" />
                <div>10,001 - 50,000 Xu</div>
                <div className="text-sm text-gray-500">Giảm giá 5%</div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="Gold" className="text-center">
                <CrownOutlined className="text-2xl text-yellow-500 mb-2" />
                <div>50,001+ Xu</div>
                <div className="text-sm text-gray-500">Giảm giá 10%</div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '8',
      label: 'Xu bị mất phải làm sao?',
      children: (
        <div>
          <Paragraph>
            Nếu Xu của bạn bị mất bất thường, hãy:
          </Paragraph>
          <ol>
            <li><strong>Kiểm tra lại:</strong> Xem lịch sử Xu có giao dịch nào không</li>
            <li><strong>Liên hệ hỗ trợ:</strong> Gọi hotline hoặc gửi email</li>
            <li><strong>Cung cấp thông tin:</strong> Số tài khoản, thời gian mất Xu</li>
            <li><strong>Chờ xử lý:</strong> Chúng tôi sẽ kiểm tra và phản hồi trong 24h</li>
          </ol>
          <Alert
            message="Lưu ý"
            description="Xu chỉ được hoàn lại trong trường hợp lỗi hệ thống. Xu sử dụng để mua hàng sẽ không được hoàn lại."
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
            <Tag color="purple">{result.category}</Tag>
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
            <GiftOutlined className="text-purple-600" />
            Hướng dẫn sử dụng Tonic Xu
          </Title>
          <Text className="text-lg text-gray-600">
            Tìm hiểu cách tích lũy và sử dụng điểm thưởng Tonic Xu hiệu quả
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
              placeholder="Tìm kiếm câu hỏi về Tonic Xu..."
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
              <StarOutlined className="text-3xl text-yellow-500 mb-3" />
              <Title level={4}>Tích lũy Xu</Title>
              <Text type="secondary">Cách kiếm Xu nhanh nhất</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <ShoppingOutlined className="text-3xl text-green-500 mb-3" />
              <Title level={4}>Sử dụng Xu</Title>
              <Text type="secondary">Cách dùng Xu giảm giá</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <TrophyOutlined className="text-3xl text-red-500 mb-3" />
              <Title level={4}>Cấp VIP</Title>
              <Text type="secondary">Tăng cấp với Xu</Text>
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
          <Card className="bg-purple-50 border-purple-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-purple-800">
                <ExclamationCircleOutlined className="mr-2" />
                Không tìm thấy câu trả lời?
              </Title>
              <Text className="text-purple-700">
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

export default XuHelpPage;
