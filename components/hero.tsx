// components/ui/hero-section.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'split' | 'full-bleed';
  backgroundOverlay?: boolean;
}

// Export the component both as default and named export
export function HeroSection({
  title,
  description,
  image,
  imageAlt,
  children,
  className,
  variant = 'default',
  backgroundOverlay = false,
}: HeroSectionProps) {
  const variants = {
    default: 'grid grid-cols-1 gap-6 items-center py-16 md:py-24 px-4 md:px-8',
    centered: 'flex flex-col items-center text-center py-16 md:py-24 px-4 md:px-8',
    split: 'grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-16 md:py-24 px-4 md:px-8',
    'full-bleed': 'w-full flex flex-col items-center py-16 md:py-24',
  };

  return (
    <section 
      className={cn(
        'relative w-full',
        image && 'overflow-hidden min-h-[40vh]',
        variants[variant],
        className
      )}
    >
      {/* Background image */}
      {image && (
        <div className="absolute inset-0 -z-10">
          <img 
            src={image} 
            alt={imageAlt || 'Background'} 
            className="w-full h-full object-cover"
          />
          {backgroundOverlay && (
            <div className="absolute inset-0 bg-background/75" />
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        'flex flex-col gap-6 z-10',
        variant === 'split' ? 'md:col-span-1' : '',
        variant === 'full-bleed' ? 'container mx-auto px-4 md:px-8' : ''
      )}>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-lg md:text-xl text-foreground max-w-prose">
            {description}
          </p>
        )}
        {children}
      </div>
      
      {/* Split variant right side placeholder */}
      {variant === 'split' && !children && (
        <div className="md:col-span-1">
          {/* This space can be used for media or other content */}
        </div>
      )}
    </section>
  );
}

// Export as default as well
export default HeroSection;