'use client';

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { siteConfig } from "@/data/config";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar";
import { Button } from "./ui/button";

// Client component that handles the auth UI
export function NavbarAuthClient({ user }: { user: any | null }) {
  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hey, {user.email}!</span>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}

// Client navbar component
export default function NavbarComponent({ user }: { user: any | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { name: "Features", href: "#" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];
  
  return (
    <Navbar 
      isBordered 
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={setIsMenuOpen}
      className="border-b border-b-foreground/10"
      maxWidth="xl"
    >
      {/* Mobile menu toggle (only shows on small screens) */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Logo - visible on mobile */}
      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-semibold">
            {siteConfig.title}
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop navbar */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <Link href="/" className="font-semibold">
            {siteConfig.title}
          </Link>
        </NavbarBrand>
        
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link href={item.href} className="text-foreground">
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Auth section (both mobile and desktop) */}
      <NavbarContent justify="end">
        <NavbarItem>
          <NavbarAuthClient user={user} />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu (shows when menu toggle is clicked) */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
} 