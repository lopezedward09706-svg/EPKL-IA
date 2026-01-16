
import React from 'react';

const LayerCardSkeleton: React.FC = () => {
  return (
    <div className="h-36 rounded-[1.5rem] bg-white/[0.02] border border-white/5 p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-12 h-2 bg-white/5 rounded"></div>
        <div className="w-4 h-4 bg-white/5 rounded-full"></div>
      </div>
      <div className="flex-1">
        <div className="w-24 h-3 bg-white/10 rounded mb-2"></div>
        <div className="w-full h-2 bg-white/5 rounded mb-1"></div>
        <div className="w-2/3 h-2 bg-white/5 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="w-16 h-1.5 bg-white/5 rounded"></div>
        <div className="w-8 h-1.5 bg-white/5 rounded"></div>
      </div>
    </div>
  );
};

export default LayerCardSkeleton;
