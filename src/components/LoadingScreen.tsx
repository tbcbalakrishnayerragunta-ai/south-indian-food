import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Simple animated bowl/steam SVG */}
        <svg
          className="w-24 h-24 text-primary animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14a8 8 0 0 0 16 0" />
          <path d="M4 14h16" />
          <path d="M8 4c0 1.5-1.5 1.5-1.5 3s1.5 1.5 1.5 3" className="animate-pulse" />
          <path d="M12 3c0 1.5-1.5 1.5-1.5 3s1.5 1.5 1.5 3" className="animate-pulse delay-75" />
          <path d="M16 4c0 1.5-1.5 1.5-1.5 3s1.5 1.5 1.5 3" className="animate-pulse delay-150" />
        </svg>
        <h1 className="mt-6 text-3xl font-black text-primary tracking-tight font-['Poppins']">
          Tiffin House
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium uppercase tracking-widest animate-pulse">
          Fresh. Hot. Authentic.
        </p>
      </div>
    </div>
  );
};
