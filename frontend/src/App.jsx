import React, { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { CatalogPage } from './pages/CatalogPage'
import { CartPage } from './pages/CartPage'
import { Header } from './components/Header'

export default function App() {
  const [currentPage, setCurrentPage] = useState('catalog')

  return (
    <CartProvider>
      <Header onCartClick={() => setCurrentPage('cart')} />
      {currentPage === 'catalog' ? (
        <CatalogPage />
      ) : (
        <CartPage onBackClick={() => setCurrentPage('catalog')} />
      )}
    </CartProvider>
  )
}
