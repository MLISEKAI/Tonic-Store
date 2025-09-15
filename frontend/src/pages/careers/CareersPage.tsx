import React, { useState } from 'react';
import { Card, Row, Col, Button, Input, Typography, Tag, Space, Select, List, Avatar } from 'antd';
import { SearchOutlined, EnvironmentOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  isUrgent?: boolean;
  isRemote?: boolean;
}

const CareersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = [
    { key: 'all', label: 'Tất Cả Phòng Ban' },
    { key: 'tech', label: 'Công Nghệ' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'sales', label: 'Kinh Doanh' },
    { key: 'design', label: 'Thiết Kế' },
    { key: 'hr', label: 'Nhân Sự' },
    { key: 'finance', label: 'Tài Chính' },
  ];

  const locations = [
    { key: 'all', label: 'Tất Cả Địa Điểm' },
    { key: 'hcm', label: 'TP. Hồ Chí Minh' },
    { key: 'hanoi', label: 'Hà Nội' },
    { key: 'danang', label: 'Đà Nẵng' },
    { key: 'remote', label: 'Làm Việc Từ Xa' },
  ];

  const jobPositions: JobPosition[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'tech',
      location: 'hcm',
      type: 'Full-time',
      experience: '3-5 năm',
      salary: '25-40 triệu',
      description: 'Phát triển giao diện người dùng cho các ứng dụng web và mobile của Tonic Store.',
      requirements: [
        'Thành thạo React, TypeScript, Next.js',
        'Kinh nghiệm với Ant Design, Tailwind CSS',
        'Hiểu biết về RESTful API và GraphQL',
        'Kinh nghiệm làm việc với Git và Agile',
        'Tiếng Anh giao tiếp tốt',
      ],
      benefits: [
        'Lương cạnh tranh + thưởng hiệu suất',
        'Bảo hiểm sức khỏe cao cấp',
        'Làm việc linh hoạt, work from home',
        'Đào tạo và phát triển kỹ năng',
        'Môi trường làm việc trẻ trung, năng động',
      ],
      postedDate: '2024-01-10',
      isUrgent: true,
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'design',
      location: 'hcm',
      type: 'Full-time',
      experience: '2-4 năm',
      salary: '18-30 triệu',
      description: 'Thiết kế giao diện người dùng và trải nghiệm cho các sản phẩm digital của công ty.',
      requirements: [
        'Thành thạo Figma, Adobe Creative Suite',
        'Kinh nghiệm thiết kế cho web và mobile',
        'Hiểu biết về Design System',
        'Portfolio thể hiện khả năng thiết kế',
        'Kỹ năng giao tiếp và teamwork tốt',
      ],
      benefits: [
        'Lương cạnh tranh + thưởng dự án',
        'Bảo hiểm sức khỏe và nha khoa',
        'Máy MacBook Pro để làm việc',
        'Tham gia các workshop thiết kế',
        'Cơ hội thăng tiến nhanh',
      ],
      postedDate: '2024-01-08',
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      department: 'marketing',
      location: 'hanoi',
      type: 'Full-time',
      experience: '4-6 năm',
      salary: '20-35 triệu',
      description: 'Quản lý và phát triển các chiến dịch marketing digital cho thương hiệu Tonic Store.',
      requirements: [
        'Kinh nghiệm quản lý team marketing',
        'Thành thạo Google Ads, Facebook Ads',
        'Hiểu biết về SEO, SEM, Content Marketing',
        'Kỹ năng phân tích dữ liệu và báo cáo',
        'Kinh nghiệm trong ngành e-commerce',
      ],
      benefits: [
        'Lương cạnh tranh + thưởng KPI',
        'Bảo hiểm sức khỏe toàn diện',
        'Làm việc linh hoạt, hybrid',
        'Budget cho các khóa học nâng cao',
        'Môi trường sáng tạo, thử thách',
      ],
      postedDate: '2024-01-05',
    },
    {
      id: 4,
      title: 'Backend Developer (Node.js)',
      department: 'tech',
      location: 'remote',
      type: 'Full-time',
      experience: '2-4 năm',
      salary: '20-35 triệu',
      description: 'Phát triển và duy trì các API và microservices cho hệ thống e-commerce.',
      requirements: [
        'Thành thạo Node.js, Express.js',
        'Kinh nghiệm với MongoDB, PostgreSQL',
        'Hiểu biết về Docker, Kubernetes',
        'Kinh nghiệm với AWS hoặc GCP',
        'Tiếng Anh giao tiếp tốt',
      ],
      benefits: [
        'Lương cạnh tranh + thưởng hiệu suất',
        'Làm việc 100% từ xa',
        'Bảo hiểm sức khỏe cao cấp',
        'Máy tính và thiết bị làm việc',
        'Thời gian làm việc linh hoạt',
      ],
      postedDate: '2024-01-03',
      isRemote: true,
    },
    {
      id: 5,
      title: 'Sales Executive',
      department: 'sales',
      location: 'hcm',
      type: 'Full-time',
      experience: '1-3 năm',
      salary: '12-20 triệu + hoa hồng',
      description: 'Tìm kiếm và phát triển khách hàng mới, duy trì mối quan hệ với khách hàng hiện tại.',
      requirements: [
        'Kỹ năng giao tiếp và thuyết phục tốt',
        'Kinh nghiệm bán hàng B2B hoặc B2C',
        'Hiểu biết về sản phẩm thời trang',
        'Kỹ năng sử dụng CRM',
        'Tinh thần làm việc nhóm cao',
      ],
      benefits: [
        'Lương cơ bản + hoa hồng hấp dẫn',
        'Bảo hiểm sức khỏe cơ bản',
        'Đào tạo kỹ năng bán hàng',
        'Cơ hội thăng tiến nhanh',
        'Môi trường làm việc năng động',
      ],
      postedDate: '2024-01-01',
    },
  ];

  const filteredJobs = jobPositions.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const companyValues = [
    {
      title: 'Đổi Mới',
      description: 'Luôn tìm kiếm những giải pháp sáng tạo và cải tiến',
      icon: '💡',
    },
    {
      title: 'Hợp Tác',
      description: 'Làm việc nhóm hiệu quả và hỗ trợ lẫn nhau',
      icon: '🤝',
    },
    {
      title: 'Phát Triển',
      description: 'Tạo cơ hội phát triển nghề nghiệp cho nhân viên',
      icon: '📈',
    },
    {
      title: 'Cân Bằng',
      description: 'Cân bằng giữa công việc và cuộc sống cá nhân',
      icon: '⚖️',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Cơ Hội Nghề Nghiệp
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Gia nhập đội ngũ Tonic Store và cùng chúng tôi xây dựng tương lai của thương mại điện tử
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm vị trí..."
                allowClear
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                size="large"
                className="w-full"
              >
                {departments.map(dept => (
                  <Option key={dept.key} value={dept.key}>
                    {dept.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={selectedLocation}
                onChange={setSelectedLocation}
                size="large"
                className="w-full"
              >
                {locations.map(location => (
                  <Option key={location.key} value={location.key}>
                    {location.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="text-center">
                <Text strong className="text-lg">
                  {filteredJobs.length} vị trí đang tuyển dụng
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Company Values */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Giá Trị Công Ty</Title>
          <Row gutter={[24, 24]}>
            {companyValues.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <Title level={4} className="mb-2">{value.title}</Title>
                  <Paragraph className="text-gray-600">{value.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Job Listings */}
        <div className="mb-8">
          <Title level={2} className="mb-6">Vị Trí Tuyển Dụng</Title>
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Title level={4} className="mb-0">{job.title}</Title>
                      {job.isUrgent && <Tag color="red">Khẩn cấp</Tag>}
                      {job.isRemote && <Tag color="blue">Remote</Tag>}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{job.location === 'hcm' ? 'TP. Hồ Chí Minh' : 
                               job.location === 'hanoi' ? 'Hà Nội' :
                               job.location === 'danang' ? 'Đà Nẵng' : 'Làm việc từ xa'}</Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{job.type}</Text>
                      </Space>
                      <Space>
                        <UserOutlined />
                        <Text>{job.experience}</Text>
                      </Space>
                    </div>
                    
                    <Paragraph className="text-gray-600 mb-4">
                      {job.description}
                    </Paragraph>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Tag color="green">Lương: {job.salary}</Tag>
                      <Tag color="blue">{job.department === 'tech' ? 'Công Nghệ' :
                                         job.department === 'marketing' ? 'Marketing' :
                                         job.department === 'sales' ? 'Kinh Doanh' :
                                         job.department === 'design' ? 'Thiết Kế' :
                                         job.department === 'hr' ? 'Nhân Sự' :
                                         job.department === 'finance' ? 'Tài Chính' : job.department}</Tag>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button type="primary" size="large">
                      Ứng Tuyển Ngay
                    </Button>
                    <Button size="large">
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Work With Us */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Tại Sao Chọn Tonic Store?</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">🚀</div>
                <Title level={4}>Môi Trường Năng Động</Title>
                <Paragraph>
                  Làm việc trong môi trường trẻ trung, sáng tạo với những dự án thú vị và thử thách.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">📚</div>
                <Title level={4}>Phát Triển Nghề Nghiệp</Title>
                <Paragraph>
                  Cơ hội học hỏi, phát triển kỹ năng và thăng tiến trong sự nghiệp.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">💼</div>
                <Title level={4}>Chế Độ Hấp Dẫn</Title>
                <Paragraph>
                  Lương cạnh tranh, bảo hiểm tốt, làm việc linh hoạt và nhiều phúc lợi khác.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Không Tìm Thấy Vị Trí Phù Hợp?
              </Title>
              <Paragraph className="text-blue-700">
                Gửi CV của bạn cho chúng tôi, chúng tôi sẽ liên hệ khi có vị trí phù hợp
              </Paragraph>
              <Button type="primary" size="large">
                Gửi CV Tự Do
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
