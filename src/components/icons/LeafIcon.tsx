import React from 'react';

export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.4 17C3.4 17 3 21 7 21C8.5 21 9.8 20.4 10.8 19.4C11.2 19.8 11.6 20 12 20C12.4 20 12.8 19.8 13.2 19.4C14.2 20.4 15.5 21 17 21C21 21 20.6 17 20.6 17C21.5 15.5 22 13.8 22 12C22 6.5 17.5 2 12 2Z" 
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path 
      d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20Z" 
      fill="currentColor"
    />
    <path 
      d="M17 8C17 8 13 8 12 12C11 8 7 8 7 8C7 8 10 12 12 16C14 12 17 8 17 8Z" 
      fill="currentColor"
    />
  </svg>
);
