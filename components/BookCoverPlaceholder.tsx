interface BookCoverPlaceholderProps {
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

export default function BookCoverPlaceholder({ 
  width = 80, 
  height = 100, 
  className = "",
  title = "Book Cover"
}: BookCoverPlaceholderProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bg-muted border rounded ${className}`}
      role="img"
      aria-label={title}
    >
      {/* Book cover background */}
      <rect width="80" height="100" fill="hsl(var(--muted))" />
      
      {/* Book spine line */}
      <line x1="8" y1="0" x2="8" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
      
      {/* Book icon */}
      <g transform="translate(20, 25)">
        {/* Closed book shape */}
        <rect x="0" y="20" width="40" height="30" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        <rect x="2" y="18" width="36" height="30" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="4" y="16" width="32" height="30" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.2" />
        
        {/* Book lines */}
        <line x1="8" y1="26" x2="32" y2="26" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
        <line x1="8" y1="30" x2="28" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
        <line x1="8" y1="34" x2="30" y2="34" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
        <line x1="8" y1="38" x2="25" y2="38" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
      </g>
      
      {/* "No Image" text */}
      <text 
        x="40" 
        y="75" 
        textAnchor="middle" 
        fontSize="8" 
        fill="hsl(var(--muted-foreground))" 
        opacity="0.5"
        fontFamily="system-ui, sans-serif"
      >
        No Cover
      </text>
    </svg>
  );
} 