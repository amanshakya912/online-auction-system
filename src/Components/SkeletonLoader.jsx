import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="bg-black text-white overflow-hidden shadow-lg border border-[#A27B5C] border-opacity-30 rounded-lg animate-pulse h-[350px] flex flex-col justify-between p-4">
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-gray-800 rounded-lg mb-4"></div>
      
      <div className="space-y-3">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-800 rounded w-3/4"></div>
        {/* Subtitle/Text Placeholder */}
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        
        {/* Price Placeholder */}
        <div className="flex justify-between mt-2 pt-2 border-t border-[#A27B5C] border-opacity-20">
          <div className="h-4 bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonsGrid = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-8">
      {Array(count).fill(0).map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
