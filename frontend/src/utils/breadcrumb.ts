export function getBreadcrumbFromPath(pathname: string, search: string) {
  const items = [{ path: '/', label: 'Trang chủ' }];

  if (pathname.startsWith('/flash-sale')) {
    items.push({ path: '/flash-sale', label: 'Khuyến mãi' });
  } else if (pathname.startsWith('/new-arrivals')) {
    items.push({ path: '/new-arrivals', label: 'Hàng mới về' });
  } else if (pathname.startsWith('/featured-products')) {
    items.push({ path: '/featured-products', label: 'Sản phẩm nổi bật' });
  } else if (pathname.startsWith('/best-sellers')) {
    items.push({ path: '/best-sellers', label: 'Sản phẩm bán chạy' });
  } else if (pathname.startsWith('/products')) {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    items.push({ path: '/products', label: 'Sản phẩm' });
    if (category) {
      items.push({ path: `/products?category=${category}`, label: decodeURIComponent(category) });
    }
  } else if (pathname.startsWith('/categories')) {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    items.push({ path: '/categories', label: 'Danh mục' });
    if (category) {
      items.push({ path: `/categories?category=${category}`, label: decodeURIComponent(category) });
    }
  }

   // Footer: Trung Tâm Trợ Giúp và các trang con
   if (pathname.startsWith('/help-center/orders')) {
    items.push({ path: '/help-center', label: 'Trung Tâm Trợ Giúp' });
    items.push({ path: '/help-center/orders', label: 'Đơn Hàng' });
  } else if (pathname.startsWith('/help-center')) {
    items.push({ path: '/help-center', label: 'Trung Tâm Trợ Giúp' });
  } else if (pathname.startsWith('/blog')) {
    items.push({ path: '/blog', label: 'Blog Tonic' });
  } else if (pathname.startsWith('/mall')) {
    items.push({ path: '/mall', label: 'Tonic Mall' });
  } else if (pathname.startsWith('/how-to-buy')) {
    items.push({ path: '/how-to-buy', label: 'Hướng Dẫn Mua Hàng' });
  } else if (pathname.startsWith('/how-to-sell')) {
    items.push({ path: '/how-to-sell', label: 'Hướng Dẫn Bán Hàng' });
  } else if (pathname.startsWith('/wallet')) {
    items.push({ path: '/wallet', label: 'Ví TonicPay' });
  } else if (pathname.startsWith('/xu')) {
    items.push({ path: '/xu', label: 'Tonic Xu' });
  } else if (pathname.startsWith('/return-refund')) {
    items.push({ path: '/return-refund', label: 'Trả Hàng/Hoàn Tiền' });
  } else if (pathname.startsWith('/contact')) {
    items.push({ path: '/contact', label: 'Liên Hệ' });
  } else if (pathname.startsWith('/warranty')) {
    items.push({ path: '/warranty', label: 'Chính Sách Bảo Hành' });
  } else if (pathname.startsWith('/about')) {
    items.push({ path: '/about', label: 'Về Tonic Store' });
  } else if (pathname.startsWith('/careers')) {
    items.push({ path: '/careers', label: 'Tuyển Dụng' });
  } else if (pathname.startsWith('/terms')) {
    items.push({ path: '/terms', label: 'Điều Khoản' });
  } else if (pathname.startsWith('/privacy')) {
    items.push({ path: '/privacy', label: 'Chính Sách Bảo Mật' });
  } else if (pathname.startsWith('/seller')) {
    items.push({ path: '/seller', label: 'Kênh Người Bán' });
  } else if (pathname.startsWith('/affiliate')) {
    items.push({ path: '/affiliate', label: 'Tiếp Thị Liên Kết' });
  } else if (pathname.startsWith('/media-contact')) {
    items.push({ path: '/media-contact', label: 'Liên Hệ Truyền Thông' });
  }

  return items;
}