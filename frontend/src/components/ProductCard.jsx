import React from 'react';

export const ProductCard = ({ pet, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(pet);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
      {/* Product Image Placeholder */}
      <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300 h-56 flex items-center justify-center text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="text-center relative z-10">
          <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">
            {pet.type === 'Dog' && '🐕'}
            {pet.type === 'Cat' && '🐈'}
            {pet.type === 'Bird' && '🐦'}
            {pet.type === 'Fish' && '🐠'}
          </div>
          <p className="text-sm font-semibold text-white drop-shadow">{pet.type}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {pet.categoryName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>

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

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${pet.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!pet.available}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
              pet.available
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                : 'bg-gray-400 cursor-not-allowed opacity-60'
            }`}
          >
            {pet.available ? '🛒 Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};
