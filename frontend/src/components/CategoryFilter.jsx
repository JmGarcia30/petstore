import React from 'react';

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Categories</h3>
      
      <div className="space-y-2">
        {/* All Products Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
            selectedCategory === null
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-[#FDFBF7] text-gray-800 hover:bg-green-50'
          }`}
        >
          All Products
        </button>

        {/* Category Buttons */}
        {categories && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
              selectedCategory === category.name
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-[#FDFBF7] text-gray-800 hover:bg-green-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {selectedCategory && typeof selectedCategory === 'string' && (
        <div className="mt-6 p-4 bg-[#FDFBF7] rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            Explore our selection of {selectedCategory.toLowerCase()} pets.
          </p>
        </div>
      )}
    </div>
  );
};