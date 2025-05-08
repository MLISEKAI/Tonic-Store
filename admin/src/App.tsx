import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminDashboard />} />
        <Route path="shipping" element={<AdminDashboard />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default App 