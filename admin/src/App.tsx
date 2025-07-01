import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './pages/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import ProductManagement from './components/ProductManagement'
import ProductCategories from './components/ProductCategories'
import OrderList from './components/OrderList'
import DeliveryAddress from './components/DeliveryAddress'
import Reviews from './components/Reviews'
import UserManagement from './components/UserManagement'
import ShipperList from './components/ShipperList'
import Promotions from './components/DiscountCode'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="product-list" element={<ProductManagement />} />
        <Route path="product-categories" element={<ProductCategories />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="shipping" element={<DeliveryAddress />} />
        <Route path="user-list" element={<UserManagement />} />
        <Route path="shippers" element={<ShipperList />} />
        <Route path="discount-codes" element={<Promotions />} />
        <Route path="reviews" element={<Reviews />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default App