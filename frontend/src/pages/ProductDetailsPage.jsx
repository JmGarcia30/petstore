import React from 'react'
import { useCart } from '../context/CartContext'

const getHighlights = (pet) => {
  const baseHighlights = [
    'Carefully listed with clear details and pricing',
    'Simple, secure checkout at Petstore',
    'Trusted by families looking for the right companion'
  ]

  if (pet?.categoryName === 'Dogs') {
    return ['A great fit for active families and daily life', ...baseHighlights]
  }

  if (pet?.categoryName === 'Cats') {
    return ['A great fit for calm, playful, and cozy homes', ...baseHighlights]
  }

  if (pet?.categoryName === 'Birds') {
    return ['A great fit for light, cheerful, and engaging homes', ...baseHighlights]
  }

  return ['A great fit for everyday companionship', ...baseHighlights]
}

export const ProductDetailsPage = ({ pet, onBackClick, onShopNow }) => {
  const { addToCart } = useCart()

  if (!pet) {
    return null
  }

  const highlights = getHighlights(pet)

  const handleAddToCart = () => {
    addToCart(pet)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBackClick}
          className="mb-8 inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-colors"
        >
          ← Back to catalog
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <section className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-100 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
            <div className="relative h-[420px] md:h-[560px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_45%)]"></div>
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-green-800 shadow-sm">
                {pet.categoryName}
              </div>
              <div className="absolute right-6 top-6 rounded-full bg-gray-900/90 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                {pet.available ? 'Available now' : 'Currently sold out'}
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-3xl bg-white/90 backdrop-blur p-5 shadow-lg">
                <p className="text-sm uppercase tracking-[0.25em] text-green-700 font-semibold">Featured pet</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900">{pet.name}</h1>
                <p className="mt-3 text-gray-600">{pet.description}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_50px_rgba(17,24,39,0.08)]">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-800">{pet.type}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-700">#{pet.id}</span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900">${pet.price.toFixed(2)}</h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{pet.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${pet.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${pet.available ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {pet.available ? 'In stock' : 'Out of stock'}
              </span>
              <span className="rounded-full bg-[#FDFBF7] px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                Clear listing and secure checkout
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl border border-gray-100 bg-[#FDFBF7] p-4 text-sm text-gray-700 shadow-sm">
                  {highlight}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!pet.available}
                className={`rounded-xl px-6 py-3 font-semibold text-white transition-colors ${pet.available ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {pet.available ? 'Add to cart' : 'Unavailable'}
              </button>
              <button
                onClick={() => onShopNow(pet.categoryName)}
                className="rounded-xl border border-green-200 px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50"
              >
                Shop more {pet.categoryName}
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800 mb-2">Why this works</p>
              <p className="text-gray-700 leading-relaxed">
                This pet detail page helps families review the listing quickly, then move straight into cart or browse more pets without friction.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ProductDetailsPage
