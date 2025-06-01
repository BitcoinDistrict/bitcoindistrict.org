'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Define types for section content
interface SectionProps {
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
  };
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  useCard?: boolean;  // New prop to toggle Card usage
}

// Define props for MainSection
interface MainSectionProps {
  layout?: "single" | "two" | "three";
  sections: SectionProps[];
  className?: string;
  animate?: boolean;
}

/**
 * MainSection Component
 *
 * A flexible section component for displaying content in a grid layout.
 * It supports responsive layouts, animations, and theme-aware styling.
 *
 * Props:
 * - layout: 'single' | 'two' | 'three' - Determines the grid layout (e.g., 'single' for one column, 'two' for two columns on larger screens).
 * - sections: Array of SectionProps - An array of objects, each representing a section with properties like image, title, subtitle, description, onClick, and useCard.
 * - className: string - Optional additional CSS classes for the main container.
 * - animate: boolean - Optional, defaults to true; enables entrance animations.
 *
 * Each section object in the sections array can include:
 * - image: { src: string, alt: string, priority?: boolean } - For adding an image.
 * - title: string - The main title of the section.
 * - subtitle: string - A subtitle for the section.
 * - description: string - Descriptive text.
 * - onClick: () => void - Optional click handler for interactivity.
 * - useCard: boolean - Optional, defaults to true; if false, uses a softer, less blocky custom style instead of the Card component.
 *
 * Example usage:
 * <MainSection
 *   layout="two"
 *   sections={[
 *     {
 *       title: "Section 1",
 *       description: "This is a softer style section",
 *       useCard: false,  // Uses custom div for a less blocky look
 *     },
 *     {
 *       title: "Section 2",
 *       description: "This uses the standard Card",
 *       useCard: true,
 *     },
 *   ]}
 *   animate={true}
 * />
 */

// Section component for each column
const Section = ({ image, title, subtitle, description, className, onClick, useCard = true }: SectionProps) => {
  const { theme } = useTheme();
  
  if (useCard) {
    // Use Card for blocky style if requested
    return (
      <Card 
        className={cn(
          "flex flex-col items-center p-4 sm:p-6 transition-all duration-200",
          "hover:shadow-lg dark:hover:shadow-gray-800/50",
          onClick && "cursor-pointer hover:translate-y-[-2px]",
          className
        )}
        onClick={onClick}
      >
        {image && (
          <div className="relative w-full aspect-video mb-4 sm:mb-6 overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={image.priority}
              className={cn(
                "object-cover transition-transform duration-300",
                "hover:scale-105",
                theme === 'dark' ? 'brightness-90' : 'brightness-100'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
            />
          </div>
        )}
        <CardHeader className="text-center space-y-1.5 sm:space-y-2 p-4 sm:p-6">
          {title && <CardTitle className="text-3xl font-bold">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-base sm:text-lg text-muted-foreground">{subtitle}</CardDescription>}
        </CardHeader>
        {description && (
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
          </CardContent>
        )}
      </Card>
    );
  }

  // Custom non-blocky style: Softer div-based design with no background
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-4 sm:p-6 rounded-xl transition-all duration-200",
        "hover:shadow-sm dark:hover:shadow-gray-700/30",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {image && (
        <div className="relative w-full aspect-video mb-4 sm:mb-6 overflow-hidden rounded-lg">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={image.priority}
            className={cn(
              "object-cover transition-transform duration-300",
              "hover:scale-105",
              theme === 'dark' ? 'brightness-90' : 'brightness-100'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
          />
        </div>
      )}
      <div className="text-center space-y-1.5 sm:space-y-2 p-4 sm:p-6">
        {title && <h2 className="text-3xl font-bold text-foreground">{title}</h2>}
        {subtitle && <p className="text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      {description && (
        <div className="p-4 sm:p-6 pt-0">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
};

// MainSection component
const MainSection = ({ layout = "single", sections, className, animate = true }: MainSectionProps) => {
  const gridClasses = {
    single: "grid-cols-1 w-full max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700",
    two: "grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700",
    three: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700",
  }[layout];

  const MotionSection = motion.section;
  const Container = animate ? MotionSection : "section";
  const containerProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <Container
      className={cn(
        "w-full py-2 sm:py-4 px-4 text-foreground",
        className
      )}
      {...containerProps}
    >
      <div className={cn("grid", gridClasses)}>
        {sections.map((section, index) => (
          <Section
            key={index}
            image={section.image}
            title={section.title}
            subtitle={section.subtitle}
            description={section.description}
            className={section.className}
            onClick={section.onClick}
            useCard={section.useCard}
          />
        ))}
      </div>
    </Container>
  );
};

export default MainSection;