import React from 'react'

export const AboutPage = ({ onBackClick }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button onClick={onBackClick} className="mb-8 text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
          ← Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">About Our Petstore</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Welcome to Petstore — your trusted destination for finding your new best friend. We believe every home deserves the joy of an animal companion, and our mission is to make the process of bringing a new pet into your family safe, ethical, and seamless.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded with a deep love for animals, Petstore started as a small initiative to connect responsible, ethical breeders with caring families. Over the years, we've grown into a trusted platform, helping thousands of happy homes find their perfect dog, cat, bird, or small pet. Our commitment remains unchanged: ensuring the health, safety, and happiness of every animal that comes through our doors.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthy & Happy Pets</h3>
              <p className="text-gray-600 leading-relaxed">
                We work exclusively with certified, ethical breeders and trusted partners. Every pet is thoroughly vet-checked, vaccinated, and socialized before they ever meet their new family.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe Pet Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                We ensure your new companion arrives home safely. With specialized, climate-controlled transport and trained animal handlers, we prioritize your pet's comfort and well-being during travel.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team is passionate about animal welfare. We're here to help you choose the right breed or species that perfectly fits your lifestyle, experience level, and home environment.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of animal lovers who found their best friend through Petstore. Share your milestones, connect with other pet parents, and celebrate the joy of bringing a new life into your home.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Promise</h2>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="text-gray-600">Ethically raised, healthy, and happy pets</p>
            </li>
            <li className="flex gap-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="text-gray-600">Safe, stress-free transport for your new companion</p>
            </li>
            <li className="flex gap-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="text-gray-600">Comprehensive health guarantees and vet records provided</p>
            </li>
            <li className="flex gap-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="text-gray-600">Secure checkout and customer data protection</p>
            </li>
            <li className="flex gap-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="text-gray-600">Lifetime support and guidance for you and your new pet</p>
            </li>
          </ul>
        </section>

        <section className="bg-green-50 rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Meet Your New Best Friend?</h2>
          <p className="text-gray-600 mb-6">Explore our available pets and find the perfect addition to your family at Petstore.</p>
          <button onClick={onBackClick} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold transition-colors shadow-sm">
            View Available Pets
          </button>
        </section>
      </main>
    </div>
  )
}

export default AboutPage