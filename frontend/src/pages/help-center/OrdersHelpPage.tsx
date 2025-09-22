import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Collapse, Typography, Space, Tag, Button, Input, Row, Col, Alert, AutoComplete, Spin, Timeline, Steps, Breadcrumb } from 'antd';
import { 
  ShoppingOutlined, 
  PhoneOutlined, 
  MailOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { HelpCenterService, FAQSuggestion, FAQSearchResult } from '../../services/helpCenter/helpCenterService';
import { getBreadcrumbFromPath } from '../../utils/breadcrumb';

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

const OrdersHelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FAQSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FAQSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname, location.search);

  // Debounced search for suggestions
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setSuggestionsLoading(true);
        try {
          const response = await HelpCenterService.getSuggestions(query);
          if (response.success) {
            setSuggestions(response.data || []);
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
      const response = await HelpCenterService.searchFAQs(value, 10);
      if (response.success) {
        setSearchResults(response.data || []);
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
      label: 'Làm thế nào để đặt hàng?',
      children: (
        <div>
          <Paragraph>
            Để đặt hàng trên Tonic Store, bạn có thể làm theo các bước sau:
          </Paragraph>
          <Steps
            direction="vertical"
            size="small"
            items={[
              {
                title: 'Đăng nhập tài khoản',
                description: 'Đăng nhập vào tài khoản Tonic Store của bạn',
                icon: <CheckCircleOutlined />
              },
              {
                title: 'Chọn sản phẩm',
                description: 'Tìm kiếm và chọn sản phẩm muốn mua, thêm vào giỏ hàng',
                icon: <ShoppingOutlined />
              },
              {
                title: 'Kiểm tra giỏ hàng',
                description: 'Xem lại sản phẩm, số lượng và giá cả trong giỏ hàng',
                icon: <FileTextOutlined />
              },
              {
                title: 'Thanh toán',
                description: 'Chọn phương thức thanh toán và điền thông tin giao hàng',
                icon: <CreditCardOutlined />
              },
              {
                title: 'Xác nhận đơn hàng',
                description: 'Kiểm tra lại thông tin và xác nhận đặt hàng',
                icon: <CheckCircleOutlined />
              }
            ]}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Các phương thức thanh toán nào được hỗ trợ?',
      children: (
        <div>
          <Paragraph>
            Tonic Store hỗ trợ các phương thức thanh toán sau:
          </Paragraph>
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} sm={12}>
              <Card size="small" title="Thanh toán trực tuyến">
                <ul>
                  <li>VNPay</li>
                  <li>Ví điện tử (MoMo, ZaloPay)</li>
                  <li>Thẻ ATM/Credit</li>
                  <li>Chuyển khoản ngân hàng</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" title="Thanh toán khác">
                <ul>
                  <li>Thanh toán khi nhận hàng (COD)</li>
                  <li>Ví Tonic Store</li>
                  <li>Tonic Xu (điểm thưởng)</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Thời gian giao hàng là bao lâu?',
      children: (
        <div>
          <Paragraph>
            Thời gian giao hàng phụ thuộc vào địa điểm và phương thức vận chuyển:
          </Paragraph>
          <Timeline
            items={[
              {
                children: (
                  <div>
                    <Text strong>TP. Hồ Chí Minh:</Text> 1-2 ngày làm việc
                  </div>
                ),
                color: 'green'
              },
              {
                children: (
                  <div>
                    <Text strong>Hà Nội:</Text> 2-3 ngày làm việc
                  </div>
                ),
                color: 'blue'
              },
              {
                children: (
                  <div>
                    <Text strong>Các tỉnh thành khác:</Text> 3-5 ngày làm việc
                  </div>
                ),
                color: 'orange'
              },
              {
                children: (
                  <div>
                    <Text strong>Vùng sâu vùng xa:</Text> 5-7 ngày làm việc
                  </div>
                ),
                color: 'red'
              }
            ]}
          />
          <Alert
            message="Lưu ý"
            description="Thời gian giao hàng có thể thay đổi trong các dịp lễ tết hoặc thời tiết xấu. Chúng tôi sẽ thông báo trước nếu có thay đổi."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Làm thế nào để theo dõi đơn hàng?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể theo dõi đơn hàng bằng các cách sau:
          </Paragraph>
          <ol>
            <li><strong>Trong tài khoản:</strong> Đăng nhập → "Đơn hàng của tôi" → Chọn đơn hàng cần theo dõi</li>
            <li><strong>Tra cứu bằng mã đơn hàng:</strong> Sử dụng mã đơn hàng để tra cứu trạng thái</li>
            <li><strong>Email thông báo:</strong> Nhận email cập nhật trạng thái đơn hàng</li>
            <li><strong>SMS:</strong> Nhận tin nhắn SMS khi đơn hàng có thay đổi</li>
            <li><strong>Hotline:</strong> Gọi hotline để được hỗ trợ tra cứu</li>
          </ol>
          <div className="mt-4">
            <Text strong>Thông tin hiển thị:</Text>
            <ul className="mt-2">
              <li>Trạng thái đơn hàng hiện tại</li>
              <li>Thời gian cập nhật cuối</li>
              <li>Thông tin vận chuyển</li>
              <li>Dự kiến giao hàng</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Các trạng thái đơn hàng có ý nghĩa gì?',
      children: (
        <div>
          <Paragraph>
            Dưới đây là ý nghĩa của các trạng thái đơn hàng:
          </Paragraph>
          <Timeline
            items={[
              {
                children: (
                  <div>
                    <Text strong className="text-green-600">Đã đặt hàng:</Text> Đơn hàng đã được tạo và chờ xử lý
                  </div>
                ),
                color: 'green'
              },
              {
                children: (
                  <div>
                    <Text strong className="text-blue-600">Đang xử lý:</Text> Đơn hàng đang được chuẩn bị
                  </div>
                ),
                color: 'blue'
              },
              {
                children: (
                  <div>
                    <Text strong className="text-orange-600">Đang giao:</Text> Đơn hàng đang được vận chuyển
                  </div>
                ),
                color: 'orange'
              },
              {
                children: (
                  <div>
                    <Text strong className="text-purple-600">Đã giao:</Text> Đơn hàng đã được giao thành công
                  </div>
                ),
                color: 'purple'
              },
              {
                children: (
                  <div>
                    <Text strong className="text-red-600">Đã hủy:</Text> Đơn hàng đã bị hủy
                  </div>
                ),
                color: 'red'
              }
            ]}
          />
        </div>
      ),
    },
    {
      key: '6',
      label: 'Làm thế nào để hủy đơn hàng?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể hủy đơn hàng trong các trường hợp sau:
          </Paragraph>
          <Alert
            message="Thời gian hủy đơn hàng"
            description="Chỉ có thể hủy đơn hàng khi trạng thái là 'Đã đặt hàng' hoặc 'Đang xử lý'. Không thể hủy khi đơn hàng đã 'Đang giao'."
            type="warning"
            showIcon
            className="mb-4"
          />
          <ol>
            <li><strong>Hủy online:</strong> Vào "Đơn hàng của tôi" → Chọn đơn hàng → "Hủy đơn hàng"</li>
            <li><strong>Gọi hotline:</strong> Liên hệ hotline để được hỗ trợ hủy đơn hàng</li>
            <li><strong>Email:</strong> Gửi email yêu cầu hủy đơn hàng</li>
          </ol>
          <div className="mt-4">
            <Text strong>Lưu ý khi hủy đơn hàng:</Text>
            <ul className="mt-2">
              <li>Tiền sẽ được hoàn lại trong 3-5 ngày làm việc</li>
              <li>Nếu đã thanh toán bằng COD, không cần hoàn tiền</li>
              <li>Đơn hàng đã giao không thể hủy, chỉ có thể trả hàng</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '7',
      label: 'Làm thế nào để thay đổi địa chỉ giao hàng?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể thay đổi địa chỉ giao hàng trong các trường hợp sau:
          </Paragraph>
          <Alert
            message="Điều kiện thay đổi địa chỉ"
            description="Chỉ có thể thay đổi địa chỉ khi đơn hàng chưa được giao cho đơn vị vận chuyển (trạng thái 'Đã đặt hàng' hoặc 'Đang xử lý')."
            type="info"
            showIcon
            className="mb-4"
          />
          <ol>
            <li><strong>Thay đổi online:</strong> Vào "Đơn hàng của tôi" → Chọn đơn hàng → "Thay đổi địa chỉ"</li>
            <li><strong>Gọi hotline:</strong> Liên hệ hotline để được hỗ trợ</li>
            <li><strong>Email:</strong> Gửi email yêu cầu thay đổi địa chỉ</li>
          </ol>
          <div className="mt-4">
            <Text strong>Lưu ý:</Text>
            <ul className="mt-2">
              <li>Phí vận chuyển có thể thay đổi tùy theo địa chỉ mới</li>
              <li>Thời gian giao hàng có thể thay đổi</li>
              <li>Không thể thay đổi khi đơn hàng đã "Đang giao"</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '8',
      label: 'Đơn hàng bị lỗi phải làm sao?',
      children: (
        <div>
          <Paragraph>
            Nếu đơn hàng gặp sự cố, bạn có thể:
          </Paragraph>
          <ol>
            <li><strong>Kiểm tra lại:</strong> Xem lại thông tin đơn hàng và trạng thái</li>
            <li><strong>Liên hệ hỗ trợ:</strong> Gọi hotline hoặc gửi email</li>
            <li><strong>Báo cáo sự cố:</strong> Sử dụng tính năng "Báo cáo sự cố" trong đơn hàng</li>
            <li><strong>Chờ xử lý:</strong> Chúng tôi sẽ kiểm tra và phản hồi trong 24h</li>
          </ol>
          <Alert
            message="Các sự cố thường gặp"
            description="Đơn hàng không cập nhật trạng thái, thông tin giao hàng sai, sản phẩm không đúng mô tả, giao hàng chậm."
            type="warning"
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
            <Tag color="green">{result.category}</Tag>
          </div>
        ),
      }))
    : faqData;

  return (
    <div className="container mx-auto px-4 py-8">
       <Breadcrumb className="mb-4 text-sm text-gray-600">
        {breadcrumb.map((item, idx) => (
          <Breadcrumb.Item key={idx}>
            <Link to={item.path}>{item.label}</Link>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <ShoppingOutlined className="text-green-600" />
            Hướng dẫn đơn hàng
          </Title>
          <Text className="text-lg text-gray-600">
            Tìm hiểu cách đặt hàng, theo dõi và quản lý đơn hàng của bạn
          </Text>
        </div>

        {/* Search with Autocomplete */}
        <div className="mb-8">
          <AutoComplete
            value={searchTerm}
            onChange={handleSearchChange}
            onSelect={handleSuggestionSelect}
            options={suggestions.map(suggestion => ({
              value: suggestion.text,
              label: (
                <div>
                  <div className="font-medium">{suggestion.text}</div>
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
              placeholder="Tìm kiếm câu hỏi về đơn hàng..."
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
              <ShoppingOutlined className="text-3xl text-green-600 mb-3" />
              <Title level={4}>Đặt hàng</Title>
              <Text type="secondary">Cách đặt hàng nhanh chóng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <TruckOutlined className="text-3xl text-blue-600 mb-3" />
              <Title level={4}>Theo dõi</Title>
              <Text type="secondary">Kiểm tra trạng thái đơn hàng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <ExclamationCircleOutlined className="text-3xl text-red-600 mb-3" />
              <Title level={4}>Hỗ trợ</Title>
              <Text type="secondary">Giải quyết sự cố đơn hàng</Text>
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

export default OrdersHelpPage;
