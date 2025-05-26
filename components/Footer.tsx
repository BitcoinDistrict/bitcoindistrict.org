import React from 'react';
import { socialLinks } from '../data/socialLinks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIcon } from '../utils/iconService';
import { ThemeSwitcher } from '@/components/theme-switcher';

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Made with 🧡 by{' '}
        <a
          href="#"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Trey
        </a>
      </p>
      <ThemeSwitcher />
      <div className="flex gap-5">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-orange-300"
            aria-label={link.label}
          >
            <FontAwesomeIcon icon={getIcon(link.iconName)} />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer; 