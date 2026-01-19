import Link from "next/link";
import { HOME_CONTENT } from "@/lib/content/home";
import { TYPOGRAPHY, SPACING } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * ContactSection - Sección de consulta personalizada
 * 
 * Features:
 * - Centrado con border superior e inferior
 * - Título + descripción + CTA button
 * - Botón con color accent (terracota)
 */
export function ContactSection() {
  const { contact } = HOME_CONTENT;

  return (
    <section
      className={cn(
        SPACING.section.lg,
        "text-center max-w-lg mx-auto border-y border-zinc-200 dark:border-zinc-800 my-10 px-6"
      )}
    >
      <h2 className={cn(TYPOGRAPHY.heading.section, "mb-6")}>
        {contact.title}
      </h2>

      <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-md mx-auto">
        {contact.description}
      </p>

      <Link
        href={contact.cta.href}
        className="bg-primary text-white py-4 px-12 text-sm font-semibold tracking-widest uppercase inline-block hover:bg-opacity-90 transition-all"
      >
        {contact.cta.text}
      </Link>
    </section>
  );
}
