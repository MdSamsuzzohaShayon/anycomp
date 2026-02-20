'use client';

import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  isLoading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const baseClasses = 'flex items-center gap-2 px-3 md:px-4 py-2 bg-[#002F70] text-white rounded-sm hover:bg-blue-900 transition-colors text-sm font-medium';
  
  const variantClasses = {
    primary: 'bg-[#002F70] text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-[#002F70] hover:bg-gray-[#002F70] focus:ring-gray-500',
    outline: 'border border-[#002F70] text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}