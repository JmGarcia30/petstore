import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (pet) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === pet.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === pet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...pet, quantity: 1 }];
    });
  };

  const removeFromCart = (petId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== petId));
  };

  const updateQuantity = (petId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(petId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === petId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
