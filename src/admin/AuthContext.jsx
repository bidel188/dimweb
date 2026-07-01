import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('dim_admin_token')
    if (!token) { setLoading(false); return }
    api.me()
      .then(setAdmin)
      .catch(() => localStorage.removeItem('dim_admin_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { token, admin } = await api.login(email, password)
    localStorage.setItem('dim_admin_token', token)
    setAdmin(admin)
  }

  function logout() {
    localStorage.removeItem('dim_admin_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
