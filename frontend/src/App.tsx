import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/products/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/user/OrdersPage";
import OrderDetailPage from "./pages/user/OrderDetailPage";
import ProfilePage from "./pages/user/ProfilePage";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ContactPage from './pages/ContactPage';
import ShipperOrders from './pages/shipper/OrdersPage';
import ShipperLayout from './layouts/ShipperLayout';
import ShipperProfilePage from './pages/shipper/ProfilePage';
import DefaultLayout from './layouts/DefaultLayout';
import WishlistPage from './pages/WishlistPage';
import FlashSalePage from './pages/FlashSalePage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
import BrandsPage from './pages/BrandsPage';
import BlogPage from "./pages/BlogPage";
import FeaturedProductsPage from "./pages/FeaturedProductsPage";
import NotificationsPage from './pages/NotificationsPage';
import PromotionCode from "./components/discount-codes/DiscountCode";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";


// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={
              <DefaultLayout>
                <ProductsPage />
              </DefaultLayout>
            } />
            <Route path="/products/:id" element={
              <DefaultLayout>
                <ProductDetailPage />
              </DefaultLayout>
            } />
            <Route path="/cart" element={
              <DefaultLayout>
                <CartPage />
              </DefaultLayout>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <CheckoutPage />
                </DefaultLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <DefaultLayout>
                <CategoriesPage />
              </DefaultLayout>
            } />
            <Route path="/about" element={
              <DefaultLayout>
                <AboutPage />
              </DefaultLayout>
            } />
            <Route path="/search" element={
              <DefaultLayout>
                <SearchPage />
              </DefaultLayout>
            } />
            <Route path="/contact" element={
              <DefaultLayout>
                <ContactPage />
              </DefaultLayout>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <WishlistPage />
                </DefaultLayout>
              </ProtectedRoute>
            } />
            <Route path="/flash-sale" element={
              <DefaultLayout>
                <FlashSalePage />
              </DefaultLayout>
            } />
            <Route path="/promotion-codes" element={
              <DefaultLayout>
                <PromotionCode />
              </DefaultLayout>
            } />
            <Route path="/new-arrivals" element={
              <DefaultLayout>
                <NewArrivalsPage />
              </DefaultLayout>
            } />
            <Route path="/best-sellers" element={
              <DefaultLayout>
                <BestSellersPage />
              </DefaultLayout>
            } />
            <Route path="/brands" element={
              <DefaultLayout>
                <BrandsPage />
              </DefaultLayout>
            } />
            <Route path="/featured-products" element={
              <DefaultLayout>
                <FeaturedProductsPage />
              </DefaultLayout>
            } />
            <Route path="/blog" element={
              <DefaultLayout>
                <BlogPage />
              </DefaultLayout>
            } />
            <Route path="/blog/:id" element={
              <DefaultLayout>
                <BlogPage />
              </DefaultLayout>
            } />

            {/* User routes */}
            <Route path="/user/orders" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <OrdersPage />
                </DefaultLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/orders/:id" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <OrderDetailPage />
                </DefaultLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <ProfilePage />
                </DefaultLayout>
              </ProtectedRoute>
            } />

            {/* Shipper routes */}
            <Route path="/shipper" element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <ShipperLayout>
                  <Navigate to="/shipper/orders" replace />
                </ShipperLayout>
              </ProtectedRoute>
            } />
            <Route path="/shipper/orders" element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <ShipperLayout>
                  <ShipperOrders />
                </ShipperLayout>
              </ProtectedRoute>
            } />
            <Route path="/shipper/profile" element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <ShipperLayout>
                  <ShipperProfilePage />
                </ShipperLayout>
              </ProtectedRoute>
            } />

            {/* Notifications route */}
            <Route path="/notifications" element={
              <ProtectedRoute>
                <DefaultLayout>
                  <NotificationsPage />
                </DefaultLayout>
              </ProtectedRoute>
            } />

            {/* Reset and forgot Password route */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
