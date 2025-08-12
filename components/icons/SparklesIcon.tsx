
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 3-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5z"/>
    <path d="M6 8.5l1.5-3 3-1.5-3-1.5-1.5-3-1.5 3-3 1.5 3 1.5z"/>
    <path d="M18 15.5l-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5z"/>
  </svg>
);

export default SparklesIcon;
