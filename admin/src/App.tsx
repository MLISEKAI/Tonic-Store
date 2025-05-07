import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import ShippingAddressesPage from './components/ShippingAddressesPage'
import OrderList from './components/OrderList'
import OrderDetail from './pages/OrderDetail'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/shipping-addresses" element={<ShippingAddressesPage />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
    </Routes>
  )
}

export default App 