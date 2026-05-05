import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export const Header = ({ user, onCartClick, onLogoClick, onLoginClick, onSignUpClick, onLogout, onAdminClick }) => {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={onLogoClick} className="text-2xl font-extrabold text-green-800 hover:opacity-90 transition-opacity">
            Petstore
          </button>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons or User Info */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome,</span>
                  <span className="font-semibold text-gray-900">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Admin</span>
                  )}
                </div>

                {/* Admin Panel - Only shown when admin */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={onAdminClick}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-all font-semibold"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-all font-semibold"
                >
                  Logout
                </button>

                {/* Cart Icon - Only shown when logged in and not admin */}
                {currentUser.role !== 'admin' && (
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
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-md transition-all font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};