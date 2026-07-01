import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Categories from './pages/Categories.jsx'
import Sets from './pages/Sets.jsx'

function RequireAuth({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
  return admin ? children : <Navigate to="/admin/login" replace />
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="sets" element={<Sets />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
