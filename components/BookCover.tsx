'use client';

import { useState } from 'react';
import Image from 'next/image';
import BookCoverPlaceholder from './BookCoverPlaceholder';
import { supabase } from '@/lib/bookClub';

interface BookCoverProps {
  coverImagePath?: string | null;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function BookCover({ 
  coverImagePath, 
  title, 
  width = 80, 
  height = 100, 
  className = "" 
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  // If no cover path or image failed to load, show placeholder
  if (!coverImagePath || imageError) {
    return (
      <BookCoverPlaceholder 
        width={width} 
        height={height} 
        className={className}
        title={`${title} cover`}
      />
    );
  }

  // Get the public URL from Supabase Storage
  const { data } = supabase.storage
    .from('book-covers')
    .getPublicUrl(coverImagePath);

  if (!data?.publicUrl) {
    return (
      <BookCoverPlaceholder 
        width={width} 
        height={height} 
        className={className}
        title={`${title} cover`}
      />
    );
  }

  return (
    <Image
      src={data.publicUrl}
      alt={`${title} cover`}
      width={width}
      height={height}
      className={`rounded shadow-sm ${className}`}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
} 