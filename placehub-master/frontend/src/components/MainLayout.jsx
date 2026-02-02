import Navbar from './Navbar'
import Footer from './Footer'

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F1F6F5]">
      <Navbar />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
