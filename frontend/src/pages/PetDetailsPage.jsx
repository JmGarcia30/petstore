import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const PetDetailsPage = ({ pet, onBackClick, onAddToCart }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(pet);
    if (onAddToCart) {
      onAddToCart(pet.name, 'Added to cart!');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={onBackClick}
          className="mb-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
        >
          ← Back to Catalog
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="flex items-center justify-center">
            <div className="relative w-full bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden shadow-2xl h-96">
              {pet.image && !imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  )}
                  <img
                    src={pet.image}
                    alt={pet.name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <p className="text-gray-600">{pet.type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            {/* Pet Name and Type */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">{pet.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{pet.type}</p>
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                {pet.categoryName}
              </span>
            </div>

            {/* Price and Availability */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${pet.price.toFixed(2)}
                </span>
                {pet.available ? (
                  <span className="inline-flex items-center space-x-2 bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full">
                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                    <span>In Stock</span>
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 text-sm font-bold px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">About {pet.name}</h2>
              <p className="text-gray-700 text-lg">{pet.description}</p>
            </div>

            {/* Pet Information Details */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Breed</p>
                <p className="text-lg text-gray-900 font-semibold">{pet.breed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Age</p>
                <p className="text-lg text-gray-900 font-semibold">{pet.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Weight</p>
                <p className="text-lg text-gray-900 font-semibold">{pet.weight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Temperament</p>
                <p className="text-lg text-gray-900 font-semibold">{pet.temperament}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Health Information</p>
                <p className="text-gray-900">{pet.healthInfo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Recommended Diet</p>
                <p className="text-gray-900">{pet.diet}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!pet.available}
              className={`w-full px-8 py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 ${
                pet.available
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {pet.available ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
