import React, { useState, useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { CatalogPage } from './pages/CatalogPage'
import { CartPage } from './pages/CartPage'
import { Header } from './components/Header'
import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { PetDetailsPage } from './pages/PetDetailsPage'
import { AdminPage } from './pages/AdminPage'
import { PageTransition } from './components/PageTransition'
import { Toast } from './components/Toast'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPet, setSelectedPet] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // If admin user, keep them on admin page after refresh
        if (parsedUser.role === 'admin' && currentPage === 'landing') {
          setCurrentPage('admin')
        }
      } catch (err) {
        console.error('Error parsing user:', err)
      }
    }
    setLoading(false)
  }, [])

  const showToast = (petName, message = 'Added to cart!') => {
    setToast({ petName, message })
  }

  const handleShopNow = (category) => {
    if (user) {
      // User is logged in, go to catalog
      setSelectedCategory(category || null)
      setCurrentPage('catalog')
    } else {
      // User is not logged in, go to login
      setCurrentPage('login')
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    // If admin, go to admin page; otherwise go to landing
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'landing')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('landing')
  }

  const handleViewDetails = (pet) => {
    setSelectedPet(pet)
    setCurrentPage('petdetails')
  }

  const goToCatalog = (category) => {
    setSelectedCategory(category || null)
    setCurrentPage('catalog')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <CartProvider>
      <Header 
        user={user}
        onCartClick={() => {
          if (user) setCurrentPage('cart')
          else setCurrentPage('login')
        }} 
        onLogoClick={() => setCurrentPage('landing')}
        onLoginClick={() => setCurrentPage('login')}
        onSignUpClick={() => setCurrentPage('signup')}
        onLogout={handleLogout}
        onAdminClick={() => setCurrentPage('admin')}
      />
      <PageTransition key={currentPage}>
        {currentPage === 'landing' && <LandingPage user={user} onShopNow={handleShopNow} onAbout={() => setCurrentPage('about')} />}
        {currentPage === 'catalog' && (user ? <CatalogPage initialCategory={selectedCategory} onViewDetails={handleViewDetails} onAddToCart={showToast} /> : (setCurrentPage('login'), null))}
        {currentPage === 'petdetails' && (user && selectedPet ? <PetDetailsPage pet={selectedPet} onBackClick={() => setCurrentPage('catalog')} onAddToCart={showToast} /> : (setCurrentPage('login'), null))}
        {currentPage === 'cart' && (user ? <CartPage onBackClick={() => setCurrentPage('catalog')} /> : (setCurrentPage('login'), null))}
        {currentPage === 'about' && <AboutPage onBackClick={() => setCurrentPage('landing')} />}
        {currentPage === 'admin' && (user?.role === 'admin' ? <AdminPage onBackClick={() => setCurrentPage('landing')} /> : (setCurrentPage('landing'), null))}
        {currentPage === 'login' && <LoginPage onBackClick={() => setCurrentPage('landing')} onSignUpClick={() => setCurrentPage('signup')} onLoginSuccess={handleLogin} />}
        {currentPage === 'signup' && <SignUpPage onBackClick={() => setCurrentPage('landing')} onLoginClick={() => setCurrentPage('login')} onSignUpSuccess={handleLogin} />}
      </PageTransition>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          petName={toast.petName}
          onClose={() => setToast(null)}
        />
      )}
    </CartProvider>
  )
}
