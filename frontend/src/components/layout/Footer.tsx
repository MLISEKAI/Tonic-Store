import { Link } from "react-router-dom";
import type { FC } from "react";
import { paymentIcons } from "../../constants/paymentIcons";
import { socialIcon } from "../../constants/socialIcons";

type FooterCategory = {
  name: string;
  children: string[];
};

type FooterProps = {
  variant?: "default" | "home";
  categoryColumns?: FooterCategory[][];
};

const Footer: FC<FooterProps> = ({
  variant = "default",
  categoryColumns = [] as FooterCategory[][],
}) => {
  // Danh mục sản phẩm mặc định
  const defaultCategories: FooterCategory[][] = [
    [
      {
        name: "Thời Trang Nam",
        children: [
          "Áo Khoác",
          "Áo Vest và Blazer", 
          "Áo Hoodie, Áo Len & Áo Nỉ",
          "Quần Jeans",
          "Quần Dài/Quần Âu",
          "Quần Short",
          "Áo",
          "Áo Ba Lỗ",
          "Đồ Lót",
          "Đồ Ngủ",
          "Đồ Bộ",
          "Vớ/Tất",
          "Trang Phục Truyền Thống",
          "Đồ Hóa Trang",
          "Trang Phục Ngành Nghề",
          "Khác"
        ]
      },
      {
        name: "Nhà Cửa & Đời Sống",
        children: [
          "Chăn, Ga, Gối & Nệm",
          "Đồ nội thất",
          "Trang trí nhà cửa",
          "Dụng cụ & Thiết bị tiện ích",
          "Đồ dùng nhà bếp và hộp đựng thực phẩm",
          "Đèn",
          "Ngoài trời & Sân vườn",
          "Đồ dùng phòng tắm",
          "Vật phẩm thờ cúng",
          "Đồ trang trí tiệc",
          "Chăm sóc nhà cửa và giặt ủi",
          "Sắp xếp nhà cửa",
          "Dụng cụ pha chế",
          "Tinh dầu thơm phòng",
          "Đồ dùng phòng ăn"
        ]
      },
      {
        name: "Đồng Hồ",
        children: [
          "Đồng Hồ Nam",
          "Đồng Hồ Nữ",
          "Bộ Đồng Hồ & Đồng Hồ Cặp",
          "Đồng Hồ Trẻ Em",
          "Phụ Kiện Đồng Hồ",
          "Khác"
        ]
      }
    ],
    [
      {
        name: "Phụ Kiện & Trang Sức Nữ",
        children: [
          "Nhẫn",
          "Bông tai",
          "Khăn choàng",
          "Găng tay",
          "Phụ kiện tóc",
          "Vòng tay & Lắc tay",
          "Lắc chân",
          "Mũ",
          "Dây chuyền",
          "Kính mắt",
          "Kim loại quý",
          "Thắt lưng",
          "Cà vạt & Nơ cổ",
          "Phụ kiện thêm",
          "Bộ phụ kiện",
          "Khác",
          "Vớ/ Tất",
          "Ô/Dù"
        ]
      },
      {
        name: "Balo & Túi Ví Nam",
        children: [
          "Ba Lô Nam",
          "Ba Lô Laptop Nam",
          "Túi & Cặp Đựng Laptop",
          "Túi Chống Sốc Laptop Nam",
          "Túi Tote Nam",
          "Cặp Xách Công Sở Nam",
          "Ví Cầm Tay Nam",
          "Túi Đeo Hông & Túi Đeo Ngực Nam",
          "Túi Đeo Chéo Nam",
          "Bóp/Ví Nam",
          "Khác"
        ]
      },
      {
        name: "Voucher & Dịch Vụ",
        children: [
          "Nhà hàng & Ăn uống",
          "Sự kiện & Giải trí",
          "Nạp tiền tài khoản",
          "Sức khỏe & Làm đẹp",
          "Gọi xe",
          "Khóa học",
          "Du lịch & Khách sạn",
          "Mua sắm",
          "Mã quà tặng Shopee",
          "Thanh toán hóa đơn",
          "Dịch vụ khác"
        ]
      }
    ],
    [
      {
        name: "Thời Trang Nữ",
        children: [
          "Quần",
          "Quần đùi",
          "Chân váy",
          "Quần jeans",
          "Đầm/Váy",
          "Váy cưới",
          "Đồ liền thân",
          "Áo khoác, Áo choàng & Vest",
          "Áo len & Cardigan",
          "Hoodie và Áo nỉ",
          "Bộ",
          "Đồ lót",
          "Đồ ngủ",
          "Áo",
          "Đồ tập",
          "Đồ Bầu",
          "Đồ truyền thống",
          "Đồ hóa trang",
          "Vải",
          "Vớ/ Tất",
          "Khác"
        ]
      },
      {
        name: "Máy Tính & Laptop",
        children: [
          "Máy Tính Bàn",
          "Màn Hình",
          "Linh Kiện Máy Tính",
          "Thiết Bị Lưu Trữ",
          "Thiết Bị Mạng",
          "Máy In, Máy Scan & Máy Chiếu",
          "Phụ Kiện Máy Tính",
          "Laptop",
          "Khác",
          "Gaming"
        ]
      },
      {
        name: "Giày Dép Nữ",
        children: [
          "Bốt",
          "Giày Thể Thao/ Sneaker",
          "Giày Đế Bằng",
          "Giày Cao Gót",
          "Giày Đế Xuồng",
          "Xăng-đan Và Dép",
          "Phụ Kiện Giày",
          "Giày Khác"
        ]
      }
    ],
    [
      {
        name: "Thể Thao & Du Lịch",
        children: [
          "Vali",
          "Túi du lịch",
          "Phụ kiện du lịch",
          "Dụng Cụ Thể Thao & Dã Ngoại",
          "Giày Thể Thao",
          "Thời Trang Thể Thao & Dã Ngoại",
          "Phụ Kiện Thể Thao & Dã Ngoại",
          "Khác"
        ]
      },
      {
        name: "Thời Trang Trẻ Em",
        children: [
          "Trang phục bé trai",
          "Trang phục bé gái",
          "Giày dép bé trai",
          "Giày dép bé gái",
          "Khác",
          "Quần áo em bé",
          "Giày tập đi & Tất sơ sinh",
          "Phụ kiện trẻ em"
        ]
      },
      {
        name: "Điện Thoại & Phụ Kiện",
        children: [
          "Điện thoại",
          "Máy tính bảng",
          "Pin Dự Phòng",
          "Pin Gắn Trong, Cáp và Bộ Sạc",
          "Ốp lưng, bao da, Miếng dán điện thoại",
          "Bảo vệ màn hình",
          "Đế giữ điện thoại",
          "Thẻ nhớ",
          "Sim",
          "Phụ kiện khác",
          "Thiết bị khác"
        ]
      }
    ],
    [
      {
        name: "Sắc Đẹp",
        children: [
          "Chăm sóc da mặt",
          "Tắm & chăm sóc cơ thể",
          "Trang điểm",
          "Chăm sóc tóc",
          "Dụng cụ & Phụ kiện Làm đẹp",
          "Vệ sinh răng miệng",
          "Nước hoa",
          "Chăm sóc nam giới",
          "Khác",
          "Chăm sóc phụ nữ",
          "Bộ sản phẩm làm đẹp"
        ]
      },
      {
        name: "Giày Dép Nam",
        children: [
          "Bốt",
          "Giày Thể Thao/ Sneakers",
          "Giày Sục",
          "Giày Tây Lười",
          "Giày Oxfords & Giày Buộc Dây",
          "Xăng-đan và Dép",
          "Phụ kiện giày dép",
          "Khác"
        ]
      },
      {
        name: "Bách Hóa Online",
        children: [
          "Đồ ăn vặt",
          "Đồ chế biến sẵn",
          "Nhu yếu phẩm",
          "Nguyên liệu nấu ăn",
          "Đồ làm bánh",
          "Sữa - trứng",
          "Đồ uống",
          "Ngũ cốc & mứt",
          "Các loại bánh",
          "Đồ uống có cồn",
          "Bộ quà tặng",
          "Thực phẩm tươi sống và thực phẩm đông lạnh",
          "Khác"
        ]
      }
    ]
  ];

  // Sử dụng danh mục mặc định nếu không có categoryColumns được truyền vào
  const categoriesToShow = categoryColumns.length > 0 ? categoryColumns : defaultCategories;
  
  // Dịch vụ khách hàng
  const customerServiceLinks = [
    { label: "Trung Tâm Trợ Giúp", path: "/help-center" },
    { label: "Blog Tonic", path: "/blog" },
    { label: "Tonic Mall", path: "/mall" },
    { label: "Hướng Dẫn Mua Hàng", path: "/how-to-buy" },
    { label: "Hướng Dẫn Bán Hàng", path: "/how-to-sell" },
    { label: "Ví TonicPay", path: "/wallet" },
    { label: "Tonic Xu", path: "/xu" },
    { label: "Hướng Dẫn Đơn Hàng", path: "/help-center/orders" },
    { label: "Trả Hàng/Hoàn Tiền", path: "/return-refund" },
    { label: "Liên Hệ", path: "/contact" },
    { label: "Chính Sách Bảo Hành", path: "/warranty" },
  ];

  // Tonic Store Việt Nam
  const aboutLinks = [
    { label: "Về Tonic Store", path: "/about" },
    { label: "Tuyển Dụng", path: "/careers" },
    { label: "Điều Khoản", path: "/terms" },
    { label: "Chính Sách Bảo Mật", path: "/privacy" },
    { label: "Tonic Mall", path: "/mall" },
    { label: "Kênh Người Bán", path: "/seller" },
    { label: "Khuyến Mãi", path: "/flash-sale" },
    { label: "Tiếp Thị Liên Kết", path: "/affiliate" },
    { label: "Liên Hệ Truyền Thông", path: "/media-contact" },
  ];


  return (
    <footer
      className={
        variant === "home"
          ? "bg-white p-6 rounded-lg shadow-sm relative"
          : "bg-gray-50"
      }
    >
      {/* Nếu là home thì hiển thị Danh Mục Sản Phẩm */}
      {variant === "home" && (
        <>
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Danh Mục Sản Phẩm
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-xs text-gray-600">
              {categoriesToShow.map((col: FooterCategory[], colIdx: number) => (
                <div key={colIdx} className="space-y-4">
                  {col.map((cat: FooterCategory) => (
                    <div key={cat.name}>
                      <p className="font-semibold text-gray-800 mb-1">
                        {cat.name}
                      </p>
                      <div className="flex flex-wrap gap-y-1">
                        {cat.children.map((child: string, idx: number) => (
                          <span
                            key={child}
                            className="flex items-center break-keep max-w-full"
                          >
                            <Link
                              to={`/products?category=${encodeURIComponent(
                                cat.name
                              )}&sub=${encodeURIComponent(child)}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {child}
                            </Link>
                            {idx !== cat.children.length - 1 && (
                              <span className="mx-1 text-gray-400">|</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
          <div className="w-full h-px bg-gray-300 my-4" />
        </>
      )}

      {/* Footer chính */}
      <div
        className={
          variant === "home"
            ? "max-w-full mx-auto"
            : "max-w-7xl mx-auto p-8"
        }
      >
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm text-gray-600">
          {/* Dịch Vụ Khách Hàng */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Dịch Vụ Khách Hàng
            </h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Giới Thiệu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Tonic Store Việt Nam
            </h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thanh Toán & Vận Chuyển */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                Thanh Toán
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
              {paymentIcons.map(({ name, svg: Icon }) => (
                <div key={name}>
                  <Icon width={32} height={32} />
                </div>
              ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                Đơn Vị Vận Chuyển
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                <a
                  href="https://www.vnpost.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/vi/2/2f/Vietnam_Post_logo.png"
                    alt="Vietnam Post" 
                    className="h-12"
                  />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                Chứng nhận bởi
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.moit.gov.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://quocluat.vn/photos/blog_post/truong-hop-nao-can-thong-bao-va-dang-ky-website-voi-bo-cong-thuong-3.png"
                    alt="Bộ Công Thương"
                    className="h-10 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Theo Dõi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Theo Dõi Chúng Tôi
            </h3>
            <div className="flex flex-col space-y-2">
            {socialIcon.map(({ name, svg: Icon, link }) => (
              <a
                key={name}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Icon width={32} height={32} />
                <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">{name}</span>
              </a>
            ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Tải Ứng Dụng Trên Điện Thoại
            </h3>

            <div className="flex flex-col items-start space-y-4">
              {/* QR Code */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://google.com"
                alt="QR App"
                className="w-24 h-24 object-cover border"
              />

              {/* App Store & Google Play */}
              <div className="flex flex-col space-y-2 w-full items-start">
                <a
                  href="https://apps.apple.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
                    alt="App Store"
                    className="h-9"
                  />
                </a>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
                    alt="Google Play"
                    className="h-9"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />

        {/* Bản Quyền */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Tonic Store. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
