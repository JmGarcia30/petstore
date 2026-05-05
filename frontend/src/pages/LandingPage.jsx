import React from 'react'

export const LandingPage = ({ user, onShopNow, onAbout }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-0">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                  Premium Pet Care,
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600 leading-tight">
                  Delivered to You
                </h2>
              </div>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover everything your furry, feathered, or aquatic friends need. From premium nutrition to toys and accessories, Petstore brings quality pet care straight to your doorstep.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={onShopNow}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 text-white px-8 md:px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 duration-300"
                >
                  Start Shopping
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 md:pt-12 border-t border-gray-200">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-green-600">500+</div>
                  <p className="text-sm md:text-base text-gray-600 mt-2">Products</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-green-600">10K+</div>
                  <p className="text-sm md:text-base text-gray-600 mt-2">Happy Pets</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-green-600">4.9★</div>
                  <p className="text-sm md:text-base text-gray-600 mt-2">Trusted</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center order-first lg:order-last">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-transparent to-orange-100 rounded-3xl blur-3xl opacity-60"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                <img 
                  src="https://education.health.ufl.edu/files/2014/05/pet-sitting-pg.jpg"
                  alt="Happy pets" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Petstore?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We're committed to providing the best products and services for your beloved companions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-all">
                <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Free Shipping</h4>
              <p className="text-gray-600 leading-relaxed">On all orders over $49. Fast and reliable delivery to your doorstep.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Easy Returns</h4>
              <p className="text-gray-600 leading-relaxed">30-day hassle-free return policy. Your satisfaction is guaranteed.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-all">
                <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Payment</h4>
              <p className="text-gray-600 leading-relaxed">Encrypted transactions and trusted payment methods for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-lg text-gray-600">Find everything you need for your pets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dogs', image: 'https://yumove.co.uk/cdn/shop/files/BerneseMountainDog.webp?v=1761662019&width=550', color: 'from-amber-400 to-orange-400' },
              { name: 'Cats', image: 'https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg', color: 'from-orange-400 to-red-400' },
              { name: 'Birds', image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/15BDC/production/_108325098_bluetit.jpg', color: 'from-yellow-400 to-amber-400' },
              { name: 'Fishes', image: 'https://aquaforest.eu/wp-content/uploads/2025/06/blazenek-scaled.jpg', color: 'from-blue-400 to-cyan-400' },
            ].map((category, index) => (
              <button
                key={index}
                onClick={onShopNow}
                className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>

                {/* Category Name Overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                    <h4 className="text-2xl md:text-3xl font-bold text-white">{category.name}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl md:text-5xl font-bold text-white">Ready to Pamper Your Pet?</h3>
          <p className="text-xl text-green-100 leading-relaxed">Explore our complete range of products and give your furry friend the best care they deserve.</p>
          <button
            onClick={onShopNow}
            className="inline-block bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Shopping Now
          </button>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-bold text-lg mb-2">Support</h4>
              <p className="text-gray-400">Available 24/7 for your queries and concerns</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Quality Assured</h4>
              <p className="text-gray-400">All products verified and tested for safety</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
              <p className="text-gray-400">Quick and reliable shipping nationwide</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Petstore. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage