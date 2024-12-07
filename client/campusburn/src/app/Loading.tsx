import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute top-1 left-1 w-14 h-14 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <div className="mt-4 text-center text-blue-200 font-semibold">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
