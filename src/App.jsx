import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedCollection from './components/FeaturedCollection'
import Categories from './components/Categories'
import AllProducts from './components/AllProducts'
import BestSellers from './components/BestSellers'
import NewArrivals from './components/NewArrivals'
import RoomInspiration from './components/RoomInspiration'
import Reviews from './components/Reviews'
import BrandStory from './components/BrandStory'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import QuickViewModal from './components/QuickViewModal'
import ShopTheLookModal from './components/ShopTheLookModal'

function App() {
  return (
    <AppProvider>
      <Header />
      <main>
        <Hero />
        <FeaturedCollection />
        <Categories />
        <AllProducts />
        <BestSellers />
        <NewArrivals />
        <RoomInspiration />
        <Reviews />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
      <QuickViewModal />
      <ShopTheLookModal />
    </AppProvider>
  )
}

export default App
