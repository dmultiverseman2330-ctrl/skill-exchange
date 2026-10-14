import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-stone-50">
      {/* Soft gradient ambient fields */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-emerald-100/40 blur-3xl animate-glow"
        style={{ animationDuration: '14s' }}
      />
      <div 
        className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-amber-100/40 blur-3xl animate-glow"
        style={{ animationDuration: '18s', animationDelay: '2s' }}
      />
      <div 
        className="absolute -bottom-[20%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-teal-100/30 blur-3xl animate-glow"
        style={{ animationDuration: '16s', animationDelay: '4s' }}
      />

      {/* Subtle geometric pattern overlay for local communal depth */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="skillloop-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skillloop-grid)" />
      </svg>
    </div>
  );
};
