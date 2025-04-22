import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderDetailPage from './pages/OrderDetailPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
