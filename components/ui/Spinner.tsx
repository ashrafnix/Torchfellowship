'use client'

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-brand-gold' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid ${color} border-t-transparent`}
    ></div>
  );
};

export default Spinner;