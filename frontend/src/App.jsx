import React, { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { CatalogPage } from './pages/CatalogPage'
import { CartPage } from './pages/CartPage'
import { Header } from './components/Header'
import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const goToCatalog = (category) => {
    setSelectedCategory(category || null)
    setCurrentPage('catalog')
  }

  return (
    <CartProvider>
      <Header onCartClick={() => setCurrentPage('cart')} onLogoClick={() => setCurrentPage('landing')} />
      {currentPage === 'landing' && <LandingPage onShopNow={(cat) => goToCatalog(cat)} onAbout={() => setCurrentPage('about')} />}
      {currentPage === 'catalog' && <CatalogPage initialCategory={selectedCategory} />}
      {currentPage === 'cart' && <CartPage onBackClick={() => setCurrentPage('catalog')} />}
      {currentPage === 'about' && <AboutPage onBackClick={() => setCurrentPage('landing')} />}
    </CartProvider>
  )
}
