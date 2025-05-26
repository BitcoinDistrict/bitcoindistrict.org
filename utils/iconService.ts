import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faXTwitter, faGithub, faMeetup } from '@fortawesome/free-brands-svg-icons';
import { faKiwiBird } from '@fortawesome/free-solid-svg-icons';

// Map of all icons used in the application
export const icons: Record<string, IconDefinition> = {
  twitter: faXTwitter,
  github: faGithub,
  meetup: faMeetup,
  kiwiBird: faKiwiBird,
  // Add other icons as needed
};

// Helper to get an icon
export const getIcon = (name: keyof typeof icons): IconDefinition => icons[name];

// Type for icon names to enable type checking
export type IconName = keyof typeof icons; 