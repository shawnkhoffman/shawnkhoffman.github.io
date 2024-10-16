import React from 'react';

interface FeatureButtonProps {
  onClick: () => void;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      Error Handling
    </button>
  );
};

export default FeatureButton;