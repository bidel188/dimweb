import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { AuthProvider } from './admin/AuthContext.jsx'

const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {isAdmin ? (
        <AuthProvider>
          <AdminApp />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      ) : (
        <App />
      )}
    </BrowserRouter>
  </StrictMode>,
)
