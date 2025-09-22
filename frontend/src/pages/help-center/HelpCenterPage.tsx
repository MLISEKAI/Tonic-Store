import React, { useState, useCallback, useEffect } from 'react';
import { Card, Collapse, Input, Button, Typography, Space, Tag, AutoComplete, Spin, Breadcrumb } from 'antd';
import { SearchOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { HelpCenterService, FAQSuggestion, FAQSearchResult } from '../../services/helpCenter/helpCenterService';
import { useSearchParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Debounce function - moved outside component
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

const HelpCenterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<FAQSuggestion[]>([]);
  const [searchResults, setSearchResults] = useState<FAQSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Load search term from URL on component mount
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword && keyword !== searchTerm) {
      setSearchTerm(keyword);
      handleSearch(keyword);
    }
  }, [searchParams]);

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
      setTotalResults(0);
      setSearchParams({});
      return;
    }
    
    setLoading(true);
    setShowSuggestions(false);
    
    // Update URL with search parameter
    setSearchParams({ keyword: value });
    
    try {
      const response = await HelpCenterService.searchFAQs(value, 20);
      if (response.success) {
        setSearchResults(response.data || []);
        setTotalResults(response.total || 0);
      } else {
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Error searching FAQs:', error);
      setSearchResults([]);
      setTotalResults(0);
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
          <ol>
            <li>Đăng nhập vào tài khoản của bạn</li>
            <li>Chọn sản phẩm muốn mua và thêm vào giỏ hàng</li>
            <li>Kiểm tra giỏ hàng và nhấn "Thanh toán"</li>
            <li>Điền thông tin giao hàng và chọn phương thức thanh toán</li>
            <li>Xác nhận đơn hàng</li>
          </ol>
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
          <ul>
            <li>Thanh toán khi nhận hàng (COD)</li>
            <li>VNPay</li>
            <li>Chuyển khoản ngân hàng</li>
            <li>Ví điện tử</li>
          </ul>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Thời gian giao hàng là bao lâu?',
      children: (
        <div>
          <Paragraph>
            Thời gian giao hàng phụ thuộc vào địa điểm:
          </Paragraph>
          <ul>
            <li>TP. Hồ Chí Minh: 1-2 ngày làm việc</li>
            <li>Hà Nội: 2-3 ngày làm việc</li>
            <li>Các tỉnh thành khác: 3-5 ngày làm việc</li>
            <li>Vùng sâu vùng xa: 5-7 ngày làm việc</li>
          </ul>
        </div>
      ),
    },
    {
      key: '4',
      label: 'Làm thế nào để trả hàng/hoàn tiền?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể trả hàng trong vòng 7 ngày kể từ khi nhận hàng:
          </Paragraph>
          <ol>
            <li>Liên hệ hotline hoặc email để yêu cầu trả hàng</li>
            <li>Điền form trả hàng và gửi kèm hóa đơn</li>
            <li>Đóng gói sản phẩm nguyên vẹn</li>
            <li>Gửi hàng về địa chỉ của chúng tôi</li>
            <li>Chúng tôi sẽ hoàn tiền sau khi kiểm tra hàng</li>
          </ol>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Làm thế nào để theo dõi đơn hàng?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể theo dõi đơn hàng bằng cách:
          </Paragraph>
          <ul>
            <li>Đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi"</li>
            <li>Sử dụng mã đơn hàng để tra cứu</li>
            <li>Liên hệ hotline để được hỗ trợ</li>
          </ul>
        </div>
      ),
    },
  ];

  // Filter FAQs based on search results or search term
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
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Trung Tâm Trợ Giúp Tonic Store 
          </Title>
          <Text className="text-lg text-gray-600">
            Xin chào, Tonic Store có thể giúp gì cho bạn?
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
              placeholder="Tìm kiếm câu hỏi..."
              allowClear
              size="large"
              onSearch={handleSearch}
              loading={loading}
              prefix={<SearchOutlined />}
              className="w-full mx-auto"
            />
          </AutoComplete>
        </div>

        {/* Search Results or FAQ Section */}
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4">Đang tìm kiếm...</div>
          </div>
        ) : (
          <div>
            <Title level={2} className="text-center mb-6">
              {searchResults.length > 0 ? (
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalResults} Kết quả tìm kiếm cho "{searchTerm}"
                  </div>
                </div>
              ) : (
                'Câu Hỏi Thường Gặp'
              )}
            </Title>
            <Collapse
              items={filteredFAQs}
              className="bg-white"
              size="large"
            />
          </div>
        )}

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Không Tìm Thấy Câu Trả Lời?
              </Title>
              <Text className="text-blue-700">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </Text>
              <Space>
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  Gọi Hotline
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  Gửi Email
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
