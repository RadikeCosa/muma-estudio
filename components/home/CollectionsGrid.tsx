import Image from "next/image";
import Link from "next/link";
import { HOME_CONTENT } from "@/lib/content/home";
import { TYPOGRAPHY, SPACING, COMPONENTS } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * CollectionsGrid - Grid de colecciones principales
 * 
 * Features:
 * - Grid 2 columnas
 * - Primera colección (manteles) ocupa 2 columnas (col-span-2)
 * - Overlay negro con opacidad sobre imágenes
 * - Hover effect: scale-105 en imagen
 * - Texto blanco con label "Ver más"
 */
export function CollectionsGrid() {
  const { collections } = HOME_CONTENT;

  return (
    <section
      className={cn(
        SPACING.section.lg,
        "bg-zinc-100 dark:bg-zinc-900/50"
      )}
    >
      <div className="max-w-lg mx-auto px-6">
        {/* Title */}
        <h2
          className={cn(
            TYPOGRAPHY.heading.page,
            "mb-12 text-center"
          )}
        >
          {collections.title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {collections.items.map((collection) => (
            <Link
              key={collection.slug}
              href={`/productos?categoria=${collection.slug}`}
              className={cn(
                "relative h-64 group overflow-hidden",
                collection.featured && "col-span-2" // Manteles full width
              )}
            >
              {/* Image */}
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className={cn(
                  "object-cover group-hover:scale-105",
                  COMPONENTS.card.imageOverlay
                )}
                sizes={
                  collection.featured
                    ? "(max-width: 768px) 100vw, 512px"
                    : "(max-width: 768px) 50vw, 256px"
                }
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                <span
                  className={cn(
                    "text-white font-display",
                    collection.featured ? "text-2xl" : "text-xl"
                  )}
                >
                  {collection.name}
                </span>
                <span className="text-white/70 text-xs tracking-widest uppercase mt-1">
                  Ver más
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
