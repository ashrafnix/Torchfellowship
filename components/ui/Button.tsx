'use client'


import React from 'react';
import Spinner from './Spinner';

// Base props for the Button. We define them separately to use in Omit later.
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Combine our custom props with the props of the underlying component.
// `C` is the generic type for the component, defaulting to 'button'.
type ButtonProps<C extends React.ElementType> = ButtonOwnProps & {
  as?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps>;


// The component must be generic to accept the `as` prop correctly.
const Button = <C extends React.ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  as,
  ...props
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantStyles = {
    primary: 'bg-brand-gold text-brand-dark hover:bg-brand-gold-dark focus:ring-brand-gold border border-amber-500/50 hover:shadow-[0_0_35px_-10px_theme(colors.brand-gold.dark)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]',
    secondary: 'bg-brand-surface text-brand-text hover:bg-brand-muted focus:ring-brand-text border border-brand-muted',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-red-700/50',
    ghost: 'bg-transparent text-brand-text hover:bg-brand-surface focus:ring-brand-gold shadow-none',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const componentProps = props as { disabled?: boolean };

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || componentProps.disabled}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </Component>
  );
};

export default Button;
