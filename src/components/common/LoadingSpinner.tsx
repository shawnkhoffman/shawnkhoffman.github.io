import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <span className="loading loading-spinner loading-md"></span>
    </div>
  );
};

export default LoadingSpinner;