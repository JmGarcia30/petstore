import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const Header = ({ onCartClick }) => {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="text-3xl">🐾</div>
            <h1 className="text-2xl font-bold text-white">Petstore</h1>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-blue-100 transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors font-medium">
              About
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-white font-semibold"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
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
