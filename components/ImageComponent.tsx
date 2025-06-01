import Image from 'next/image';
import { FC } from 'react';

// Define the props interface
interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  border?: 'none' | 'thin' | 'thick';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'lg' | 'full';
  className?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  margin?: 'auto' | 'none' | 'sm' | 'md' | 'lg';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  sizes?: string;
}

const ImageComponent: FC<ImageComponentProps> = ({
  src,
  alt,
  width = 600,
  height = 400,
  border = 'none',
  shadow = 'none',
  rounded = 'none',
  className = '',
  position = 'relative',
  margin = 'auto',
  objectFit = 'cover',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) => {
  // Map prop values to Tailwind classes
  const borderStyles: Record<string, string> = {
    none: 'border-none',
    thin: 'border border-border dark:border-border',
    thick: 'border-4 border-border dark:border-border',
  };

  const shadowStyles: Record<string, string> = {
    none: '',
    sm: 'shadow-sm dark:shadow-sm',
    md: 'shadow-md dark:shadow-md',
    lg: 'shadow-lg dark:shadow-lg',
  };

  const roundedStyles: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-md',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  const marginStyles: Record<string, string> = {
    auto: 'mx-auto',
    none: '',
    sm: 'm-2 md:m-3 lg:m-4',
    md: 'm-4 md:m-6 lg:m-8',
    lg: 'm-8 md:m-10 lg:m-12',
  };

  return (
    <div
      className={`relative w-full bg-background ${marginStyles[margin]} ${className}`}
      style={{ position }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={`
          w-full h-auto
          ${borderStyles[border]}
          ${shadowStyles[shadow]}
          ${roundedStyles[rounded]}
          object-${objectFit}
          transition-colors duration-200
        `}
        priority={priority}
      />
    </div>
  );
};

export default ImageComponent;