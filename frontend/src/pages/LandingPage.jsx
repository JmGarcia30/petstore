import React from 'react'

export const LandingPage = ({ onShopNow, onAbout }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* Back to a standard 50/50 split so the image isn't huge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">Everything for your pets,</h1>
              <p className="text-5xl lg:text-6xl font-bold text-green-600 leading-tight mb-8">delivered with care.</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={onShopNow} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold transition-colors">Shop Now</button>
                <button onClick={onAbout} className="text-green-600 hover:text-green-700 px-8 py-3 rounded-md border-2 border-green-600 font-semibold transition-colors">Learn More</button>
              </div>
            </div>

            {/* Normal sized image container */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100 relative h-96 lg:h-[450px]">
              <img 
                src="https://education.health.ufl.edu/files/2014/05/pet-sitting-pg.jpg" 
                alt="Happy pets" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            
          </div>

         {/* Features section with the larger text you requested */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Free Shipping</h4>
            <p className="text-base text-gray-600">On orders over $49</p>
          </div>
          <div className="p-6 text-center border-t border-gray-200 md:border-t-0 md:border-l md:border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Easy Returns</h4>
            <p className="text-base text-gray-600">30-day return policy</p>
          </div>
          <div className="p-6 text-center border-t border-gray-200 md:border-t-0 md:border-l">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h4>
            <p className="text-base text-gray-600">100% secure checkout</p>
          </div>
          <div className="p-6 text-center border-t border-gray-200 md:border-t-0 md:border-l">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Support 24/7</h4>
            <p className="text-base text-gray-600">We are here to help</p>
          </div>
        </div>
      </div>
          
        </div>
      </header>
    </div>
  )
}

export default LandingPage