import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
}) => {
  return (
    <div className={`loading loading--${size}`}>
      <div className="loading-spinner"></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default Loading;
