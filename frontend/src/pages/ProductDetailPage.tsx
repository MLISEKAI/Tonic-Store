import { useParams } from 'react-router-dom';
import ProductDetail from '../components/product/ProductDetail';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return <ProductDetail productId={id} />;
};

export default ProductDetailPage; 