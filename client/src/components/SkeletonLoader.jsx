import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 animate-pulse font-sans">
      <div className="aspect-[3/4] bg-stone-200" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-stone-200 w-1/3" />
        <div className="h-4 bg-stone-200 w-3/4" />
        <div className="h-3 bg-stone-200 w-1/4" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
      <div className="lg:col-span-7 flex space-x-4">
        <div className="hidden sm:flex flex-col space-y-3 w-20">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-stone-200" />)}
        </div>
        <div className="flex-1 aspect-[3/4] bg-stone-200" />
      </div>
      <div className="lg:col-span-5 space-y-6">
        <div className="h-4 bg-stone-200 w-1/4" />
        <div className="h-8 bg-stone-200 w-3/4" />
        <div className="h-6 bg-stone-200 w-1/3" />
        <div className="h-24 bg-stone-200 w-full" />
        <div className="h-12 bg-stone-200 w-full" />
      </div>
    </div>
  );
};
