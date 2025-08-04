import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}


const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-green-50 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border-b bg-gradient-to-r from-green-500 to-green-700 text-black ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border-t border-green-200 bg-green-50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;