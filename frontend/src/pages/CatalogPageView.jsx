import React from 'react';
import { CatalogPage } from './CatalogPage';
import { Header } from '../components/Header';

export const CatalogPageView = ({ onGoToCart }) => {
  return (
    <div>
      <Header onCartClick={onGoToCart} />
      <CatalogPage />
    </div>
  );
};
