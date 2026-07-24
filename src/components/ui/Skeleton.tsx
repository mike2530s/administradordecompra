import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-4 space-y-3.5 shadow-xs">
      <div className="flex items-center space-x-3">
        {/* Shimmer Image Placeholder */}
        <div className="w-16 h-16 rounded-2xl animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          {/* Shimmer Title */}
          <div className="h-4 w-3/4 animate-shimmer rounded-md" />
          {/* Shimmer Category Pill */}
          <div className="h-3 w-1/2 animate-shimmer rounded-md" />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
        <div className="h-6 w-20 animate-shimmer rounded-lg" />
        <div className="h-9 w-28 animate-shimmer rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowsSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-800/40 rounded-2xl">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 rounded-xl animate-shimmer shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-1/3 animate-shimmer rounded-md" />
              <div className="h-3 w-1/4 animate-shimmer rounded-md" />
            </div>
            <div className="h-5 w-20 animate-shimmer rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 space-y-2 shadow-xs">
      <div className="h-3 w-1/3 animate-shimmer rounded-md" />
      <div className="h-8 w-2/3 animate-shimmer rounded-lg" />
    </div>
  );
};
