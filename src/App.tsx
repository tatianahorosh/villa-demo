import './index.css'
import Navbar from './components/Navbar'
import Scrollymation from './components/Scrollymation'
import Story from './components/Story'
import Gallery from './components/Gallery'
import Amenities from './components/Amenities'
import Closing from './components/Closing'
import Footer from './components/Footer'

function App() {
  return (
    <main className="relative bg-[#0a0a08]">
      <Navbar />
      <Scrollymation />
      <Story />
      <Gallery />
      <Amenities />
      <Closing />
      <Footer />
    </main>
  )
}

export default App
