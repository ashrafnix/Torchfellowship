'use client'

import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, type = 'text', className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    return (
        <div className="relative">
            <input
                id={inputId}
                ref={ref}
                type={type}
                className={`peer w-full bg-brand-surface border border-brand-muted rounded-md pt-6 pb-2 px-4 text-brand-text placeholder-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-shadow duration-300 ${className}`}
                placeholder={label}
                {...props}
            />
            <label
                htmlFor={inputId}
                className="absolute left-4 top-2 text-brand-text-dark text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-brand-gold peer-focus:text-xs"
            >
                {label}
            </label>
        </div>
    );
});

Input.displayName = 'Input';
export default Input;