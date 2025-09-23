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

  return items;
}