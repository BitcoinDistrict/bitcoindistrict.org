import { cn } from "@/lib/utils";

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContent({ children, className, ...props }: PageContentProps) {
  return (
    <div className={cn("container py-6", className)} {...props}>
      {children}
    </div>
  );
} 