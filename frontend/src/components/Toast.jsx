import React, { useEffect } from 'react';

export const Toast = ({ message, petName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slideInRight">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-80">
        {/* Success Icon */}
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <p className="font-bold">{petName}</p>
          <p className="text-sm text-green-100">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-green-200 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
