import React from 'react';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'body1';
  children: React.ReactNode;
  className?: string;
}

export function Typography({ variant, children, className }: TypographyProps) {
  switch (variant) {
    case 'h1':
      return <h1 className={`text-4xl font-bold ${className}`}>{children}</h1>;
    case 'h2':
      return <h2 className={`text-3xl font-semibold ${className}`}>{children}</h2>;
    case 'h3':
      return <h3 className={`text-2xl font-medium ${className}`}>{children}</h3>;
    case 'body1':
      return <p className={`text-base ${className}`}>{children}</p>;
    default:
      return <p>{children}</p>;
  }
}
