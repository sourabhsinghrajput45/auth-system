import React from 'react';

export default function Button({ children, disabled, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        mt-2 py-3 w-full text-base font-medium rounded-md transition-colors
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
