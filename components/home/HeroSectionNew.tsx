import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DecorativeBadge } from "@/components/ui/DecorativeBadge";
import { HOME_CONTENT } from "@/lib/content/home";
import { TYPOGRAPHY, SPACING } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * HeroSection - Sección principal de la home
 * 
 * Features:
 * - Badge decorativo superior
 * - Título grande con palabra destacada en italic
 * - Descripción con tipografía grande
 * - Dos CTAs (primario y secundario)
 * - Texto decorativo de fondo "Muma"
 */
export function HeroSectionNew() {
  const { hero } = HOME_CONTENT;

  return (
    <header
      className={cn(
        "relative pt-24 pb-16 overflow-hidden",
        SPACING.section.md
      )}
    >
      <div className="max-w-lg mx-auto relative px-6">
        {/* Decorative background text */}
        <div
          className="absolute -top-10 -right-10 opacity-10 dark:opacity-20 select-none pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-display text-[120px] leading-none text-foreground">
            Muma
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-12">
          {/* Badge */}
          <DecorativeBadge variant="outline" className="mb-6">
            {hero.badge}
          </DecorativeBadge>

          {/* Title */}
          <h1 className={cn(TYPOGRAPHY.heading.hero, "mb-6")}>
            {hero.subtitle}{" "}
            <span className="italic text-primary">
              {hero.subtitleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p
            className={cn(
              TYPOGRAPHY.body.large,
              "text-muted-foreground mb-10 max-w-[85%]"
            )}
          >
            {hero.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4">
            {/* Primary CTA */}
            <Link
              href={hero.cta.primaryHref}
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 px-8 text-center text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 group transition-all hover:opacity-90"
            >
              {hero.cta.primary}
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>

            {/* Secondary CTA */}
            <Link
              href={hero.cta.secondaryHref}
              className="border border-zinc-300 dark:border-zinc-700 py-4 px-8 text-center text-sm font-semibold tracking-widest uppercase transition-colors hover:border-zinc-900 dark:hover:border-zinc-100"
            >
              {hero.cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
