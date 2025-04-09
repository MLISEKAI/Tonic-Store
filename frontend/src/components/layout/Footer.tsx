import { Link } from 'react-router-dom';
import { Button, Input } from 'antd';
import { MailOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined, ArrowRightOutlined } from '@ant-design/icons';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Cửa hàng',
      links: [
        { label: 'Tất cả sản phẩm', path: '/products' },
        { label: 'Nổi bật', path: '/products?featured=true' },
        { label: 'Hàng mới', path: '/products?new=true' },
        { label: 'Khuyến mãi', path: '/products?sale=true' },
      ],
    },
    {
      title: 'Về chúng tôi',
      links: [
        { label: 'Câu chuyện', path: '/about' },
        { label: 'Tuyển dụng', path: '/careers' },
        { label: 'Điều khoản', path: '/terms' },
        { label: 'Chính sách bảo mật', path: '/privacy' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Liên hệ', path: '/contact' },
        { label: 'Câu hỏi thường gặp', path: '/faq' },
        { label: 'Vận chuyển & Đổi trả', path: '/shipping' },
        { label: 'Theo dõi đơn hàng', path: '/track-order' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật tin tức</h3>
            <p className="text-gray-600 mb-4">
              Đăng ký nhận bản tin để cập nhật thông tin và ưu đãi mới nhất.
            </p>
            <div className="flex">
              <Input
                placeholder="Email của bạn"
                className="flex-grow rounded-l-full"
                prefix={<MailOutlined className="text-gray-400" />}
              />
              <Button
                type="primary"
                className="rounded-r-full"
                icon={<ArrowRightOutlined />}
              />
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FacebookOutlined className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <TwitterOutlined className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <InstagramOutlined className="text-xl" />
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Tonic Store. Bảo lưu mọi quyền.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 