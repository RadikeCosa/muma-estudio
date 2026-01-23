/**
 * Navigation constants for the application
 * Centralized navigation links and social media links
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  ariaLabel: string;
}

/**
 * Main navigation links displayed in Header and Footer
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Social media and contact links
 * Uses environment variables for URLs to allow easy configuration
 */
export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    ariaLabel: "Instagram",
  },
  email: {
    label: "Email",
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    ariaLabel: "Email",
  },
} as const;
