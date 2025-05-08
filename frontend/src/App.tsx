import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/user/OrdersPage";
import OrderDetailPage from "./pages/user/OrderDetailPage";
import ProfilePage from "./pages/user/ProfilePage";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from './pages/ContactPage';
import ShipperOrders from './pages/shipper/OrdersPage';
import ShipperLayout from './layouts/ShipperLayout';
import ShipperProfilePage from './pages/shipper/ProfilePage';
import DefaultLayout from './layouts/DefaultLayout';

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
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
