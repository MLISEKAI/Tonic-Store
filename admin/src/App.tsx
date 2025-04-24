import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import ShippingAddressesPage from './pages/ShippingAddressesPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/shipping-addresses" element={<ShippingAddressesPage />} />
    </Routes>
  )
}

export default App 