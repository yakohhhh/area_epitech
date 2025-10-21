import React from 'react';

interface FloatingShapeProps {
  className?: string;
  style?: React.CSSProperties;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`floating-shape ${className}`}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        background:
          'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        animation: 'float 6s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
    >
      {/* Shapes flottantes d'arrière-plan */}
      <FloatingShape
        style={{
          width: '120px',
          height: '120px',
          top: '10%',
          left: '10%',
          animationDelay: '0s',
        }}
      />
      <FloatingShape
        style={{
          width: '80px',
          height: '80px',
          top: '20%',
          right: '15%',
          animationDelay: '2s',
        }}
      />
      <FloatingShape
        style={{
          width: '100px',
          height: '100px',
          bottom: '15%',
          left: '20%',
          animationDelay: '4s',
        }}
      />
      <FloatingShape
        style={{
          width: '60px',
          height: '60px',
          bottom: '25%',
          right: '10%',
          animationDelay: '1s',
        }}
      />

      {children}
    </div>
  );
};

export default AuthBackground;
