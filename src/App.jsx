import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Footer from './components/Footer'
import QuickViewModal from './components/QuickViewModal'
import ShopTheLookModal from './components/ShopTheLookModal'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <AppProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
      <Footer />
      <QuickViewModal />
      <ShopTheLookModal />
    </AppProvider>
  )
}

export default App
