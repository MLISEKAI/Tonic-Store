export function getBreadcrumbFromPath(pathname: string, search: string) {
  if (pathname.startsWith('/flash-sale')) {
    return { path: '/flash-sale', label: 'Khuyến mãi' };
  }
  if (pathname.startsWith('/new-arrivals')) {
    return { path: '/new-arrivals', label: 'Hàng mới về' };
  }
  if (pathname.startsWith('/featured-products')) {
    return { path: '/featured-products', label: 'Sản phẩm nổi bật' };
  }
  if (pathname.startsWith('/best-sellers')) {
    return { path: '/best-sellers', label: 'Sản phẩm bán chạy' };
  }
  if (pathname.startsWith('/products')) {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    if (category) {
      return { path: `/products?category=${category}`, label: decodeURIComponent(category) };
    }
    return { path: '/products', label: 'Sản phẩm' };
  }
  if (pathname.startsWith('/categories')) {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    if (category) {
      return { path: `/categories?category=${category}`, label: decodeURIComponent(category) };
    }
    return { path: '/categories', label: 'Danh mục' };
  }
  return { path: '/', label: 'Trang chủ' };
} 