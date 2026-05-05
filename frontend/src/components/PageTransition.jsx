import React from 'react';

export const PageTransition = ({ children, key }) => {
  return (
    <div
      key={key}
      className="animate-fadeIn"
    >
      {children}
    </div>
  );
};
