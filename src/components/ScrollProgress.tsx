import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[1000] bg-transparent">
      <div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
