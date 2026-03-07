import React from 'react';
import Skeleton from '../common/Skeleton';

const PriceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 mb-4">
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      <div className="flex justify-between items-end mt-auto pt-2">
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default PriceCardSkeleton;
