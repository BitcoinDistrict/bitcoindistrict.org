import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
    default: 'grid grid-cols-1 gap-6 items-center py-8 md:py-12 px-4 min-h-[30vh] md:min-h-[40vh] lg:min-h-[30vh]',
    centered: 'flex flex-col items-center text-center py-8 md:py-12 px-4 min-h-[30vh] md:min-h-[40vh] lg:min-h-[30vh]',
    split: 'grid grid-cols-1 gap-6 items-center py-8 md:py-12 px-4 min-h-[30vh] md:min-h-[40vh] lg:min-h-[30vh]',
    'full-bleed': 'w-full flex flex-col items-center py-8 md:py-12 min-h-[40vh] md:min-h-[50vh] lg:min-h-[30vh]',
  };

  return (
    <section 
      className={cn(
        'relative w-full',
        image && 'overflow-hidden',
        variants[variant],
        className
      )}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background image */}
      {image && (
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={imageAlt || 'Hero background'} 
            fill
            priority={variant === 'full-bleed'}
            loading={variant === 'full-bleed' ? 'eager' : 'lazy'}
            className="object-cover"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {backgroundOverlay && (
            <div className="absolute inset-0 bg-background/60" />
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        'flex flex-col gap-6 relative z-10',
        variant === 'split' ? 'lg:col-span-1' : '',
        variant === 'full-bleed' ? 'container mx-auto px-4' : ''
      )}>
        <h1 
          id="hero-title" 
          className="text-2xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
        >
          {title}
        </h1>
        {description && (
          <p 
            className="text-base text-foreground max-w-prose md:text-lg lg:text-xl"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
          >
            {description}
          </p>
        )}
        <div className="flex flex-col gap-4 md:gap-6">
          {children}
        </div>
      </div>
      
      {/* Split variant right side placeholder */}
      {variant === 'split' && !children && (
        <div className="lg:col-span-1 hidden lg:block">
          {/* Placeholder for media or content */}
        </div>
      )}
    </section>
  );
}

export default HeroSection;