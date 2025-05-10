import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Ghar Karcha</h2>
      <p className="text-sm text-gray-500">Loading your financial dashboard...</p>
    </div>
  );
};

export default LoadingScreen;