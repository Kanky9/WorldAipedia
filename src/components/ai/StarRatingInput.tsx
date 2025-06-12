
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingInputProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

const StarRatingInput: FC<StarRatingInputProps> = ({
  count = 5,
  value,
  onChange,
  size = 24,
  className,
  disabled = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (newValue: number) => {
    if (!disabled) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue: number) => {
    if (!disabled) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((starValue) => {
        const isActive = (hoverValue || value) >= starValue;
        return (
          <Star
            key={starValue}
            size={size}
            className={cn(
              "cursor-pointer transition-colors",
              isActive ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50",
              disabled && "cursor-not-allowed opacity-70"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${starValue} out of ${count} stars`}
          />
        );
      })}
    </div>
  );
};

export default StarRatingInput;
