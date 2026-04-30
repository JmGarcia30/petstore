import React from 'react';
import { useCart } from '../context/CartContext';

export const Header = ({ onCartClick, onLogoClick }) => {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={onLogoClick} className="text-2xl font-extrabold text-green-800 hover:opacity-90 transition-opacity">
            Petstore
          </button>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h-2l-1 2h2l3 9h8l3-6H9"/></svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};