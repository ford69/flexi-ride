import React from 'react';

const Loader: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
    <div className="flex flex-col items-center">
      <svg
        className="animate-bounce"
        width="80"
        height="40"
        viewBox="0 0 80 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car body */}
        <rect x="10" y="20" width="60" height="12" rx="6" fill="#059669" />
        {/* Car roof */}
        <path d="M20 20 Q30 10 60 20" stroke="#059669" strokeWidth="4" fill="none" />
        {/* Wheels */}
        <circle cx="22" cy="34" r="4" fill="#222" />
        <circle cx="58" cy="34" r="4" fill="#222" />
      </svg>
      <span className="mt-6 text-white text-lg font-semibold tracking-wide animate-pulse">Loading...</span>
    </div>
  </div>
);

export default Loader; 