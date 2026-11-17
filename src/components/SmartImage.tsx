import React, { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-neutral-950 text-white p-6 text-center select-none ${className}`}
      >
        <div className="w-8 h-8 border border-[#DC2626] flex items-center justify-center mb-2">
          <div className="w-3 h-3 bg-[#DC2626] rotate-45" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
          {fallbackLabel || alt || 'Naiem Arong'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
