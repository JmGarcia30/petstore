import React, { useState } from 'react';

export const ProductCard = ({ pet, onAddToCart, onSeeDetails }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(pet);
    }
  };

  const handleSeeDetails = () => {
    if (onSeeDetails) {
      onSeeDetails(pet);
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
      {/* Product Image */}
      <div className="relative bg-gradient-to-br from-green-50 to-white h-56 flex items-center justify-center overflow-hidden group">
        {pet.image && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 text-sm">Loading...</span>
              </div>
            )}
            <img
              src={pet.image}
              alt={pet.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">🐾</div>
            <div className="text-sm font-semibold text-gray-600">{pet.type}</div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {pet.categoryName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{pet.name}</h3>

        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{pet.description}</p>

        {/* Availability Status */}
        <div className="mb-4">
          {pet.available ? (
            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              <span>In Stock</span>
            </span>
          ) : (
            <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Price and Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            ${pet.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSeeDetails}
              className="px-3 py-2 rounded-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-all"
            >
              Details
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!pet.available}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                pet.available
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {pet.available ? 'Cart' : 'N/A'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};