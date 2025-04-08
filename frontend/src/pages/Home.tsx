import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';

const Home = () => {
  return (
    <div className="space-y-12">
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
    </div>
  );
};

export default Home; 