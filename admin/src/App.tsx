import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App 