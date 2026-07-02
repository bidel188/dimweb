import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import Categories from '../components/Categories'
import AllProducts from '../components/AllProducts'
import BestSellers from '../components/BestSellers'
import NewArrivals from '../components/NewArrivals'
import RoomInspiration from '../components/RoomInspiration'
import Reviews from '../components/Reviews'
import BrandStory from '../components/BrandStory'
import Newsletter from '../components/Newsletter'

export default function HomePage() {
  return (
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
  )
}
