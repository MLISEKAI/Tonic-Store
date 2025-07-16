import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/products/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/user/UserOrdersPage";
import OrderDetailPage from "./pages/user/UserOrderDetailPage";
import ProfilePage from "./pages/user/UserProfilePage";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ContactPage from './pages/ContactPage';
import ShipperOrders from './pages/shipper/ShipperOrdersPage';
import ShipperLayout from './layouts/ShipperLayout';
import ShipperProfilePage from './pages/shipper/ShipperProfilePage';
import WishlistPage from './pages/WishlistPage';
import FlashSalePage from './pages/FlashSalePage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
import BrandsPage from './pages/BrandsPage';
import BlogPage from "./pages/BlogPage";
import FeaturedProductsPage from "./pages/FeaturedProductsPage";
import NotificationsPage from './pages/NotificationsPage';
import PromotionCode from "./pages/DiscountCodePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ScrollToTop from './components/layout/ScrollToTop';
import { WishlistProvider } from "./contexts/WishlistContext";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthLayout from "./layouts/AuthLayout";


// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Auth routes - no layout */}
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                }
              />

              {/* Shipper routes - tách riêng */}
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

              {/* Main layout routes */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow bg-gray-100">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/wishlist" element={
                          <ProtectedRoute>
                            <WishlistPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/flash-sale" element={<FlashSalePage />} />
                        <Route path="/promotion-codes" element={<PromotionCode />} />
                        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                        <Route path="/best-sellers" element={<BestSellersPage />} />
                        <Route path="/brands" element={<BrandsPage />} />
                        <Route path="/featured-products" element={<FeaturedProductsPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<BlogPage />} />

                        {/* User routes */}
                        <Route path="/user/orders" element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/user/orders/:id" element={
                          <ProtectedRoute>
                            <OrderDetailPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/user/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />

                        {/* Notifications */}
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <NotificationsPage />
                          </ProtectedRoute>
                        } />

                        {/* Password */}
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                      </Routes>
                    </main>
                    {location.pathname !== "/" && <Footer />}
                  </div>
                }
              />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
