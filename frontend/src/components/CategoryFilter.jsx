import React from 'react';

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">🏷️</span>
        Categories
      </h3>
      
      <div className="space-y-2">
        {/* All Products Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          ✨ All Products
        </button>

        {/* Category Buttons */}
        {categories && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
              selectedCategory === category.name
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">
              {category.name === 'Dogs' && '🐕'}
              {category.name === 'Cats' && '🐈'}
              {category.name === 'Birds' && '🐦'}
              {category.name === 'Fishes' && '🐠'}
            </span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            {selectedCategory === 'Dogs' && '🐕 Loyal and friendly companions!'}
            {selectedCategory === 'Cats' && '🐈 Independent and affectionate friends!'}
            {selectedCategory === 'Birds' && '🐦 Colorful and musical pets!'}
            {selectedCategory === 'Fishes' && '🐠 Peaceful aquatic animals!'}
          </p>
        </div>
      )}
    </div>
  );
};
