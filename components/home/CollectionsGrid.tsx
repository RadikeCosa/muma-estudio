import { LAYOUT, SPACING, ANIMATIONS } from "@/lib/design/tokens";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getCategorias } from "@/lib/supabase/queries";
import type { Categoria } from "@/lib/types";

/**
 * CollectionsGrid - Grid 2x2 de colecciones con manteles full-width
 *
 * Layout:
 * ┌─────────────────────┐
 * │     Manteles        │  (full-width)
 * └─────────────────────┘
 * ┌──────────┬──────────┐
 * │Servilleta│ Caminos  │  (2 columns)
 * └──────────┴──────────┘
 */

const PLACEHOLDER_IMAGE = "/images/placeholders/placeholder-image.jpeg";

interface CollectionCardProps {
  collection: Categoria;
  featured?: boolean;
}

function CollectionCard({ collection, featured = false }: CollectionCardProps) {
  return (
    <Link
      href={`/productos?categoria=${collection.slug}`}
      className={cn(
        "group shine-effect overflow-hidden rounded-2xl border border-border/50 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-foreground/10 hover:-translate-y-2",
        featured && "sm:col-span-2",
      )}
      aria-label={`Explorar colección ${collection.nombre}`}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden bg-linear-to-br from-muted/50 to-muted",
          featured ? "aspect-21/9" : "aspect-2/3",
        )}
      >
        <Image
          src={collection.imagen || PLACEHOLDER_IMAGE}
          alt={
            collection.nombre
              ? `Imagen de la colección ${collection.nombre}`
              : "Imagen de colección"
          }
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes={
            featured
              ? "(max-width: 640px) 100vw, 80vw"
              : "(max-width: 640px) 100vw, 40vw"
          }
          priority={featured}
        />
        {/* Gradient Overlay: asegurar contraste */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <h3
            className={cn(
              "mb-2 font-bold text-white transition-all duration-300 group-hover:-translate-y-1",
              featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            )}
            id={`collection-title-${collection.slug}`}
          >
            {collection.nombre}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-white/90 sm:text-base">
            {collection.descripcion}
          </p>
          {/* Arrow Icon */}
          <div
            className="inline-flex items-center gap-2 text-sm font-medium text-white"
            aria-label="Explorar colección"
            role="button"
          >
            <span>Explorar colección</span>
            <ArrowRight
              className={cn(
                "h-5 w-5 transition-all",
                ANIMATIONS.hoverIcon,
                "group-hover:text-white",
              )}
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export async function CollectionsGrid() {
  const categorias = await getCategorias();
  return (
    <section
      className={cn(SPACING.sectionPadding.sm, "bg-muted/30")}
      role="region"
      aria-labelledby="collections-section-title"
    >
      <div className={LAYOUT.container.maxW7xl}>
        {/* Section Header */}

        {/* Heading oculto para aria-labelledby */}
        <h2 id="collections-section-title" className="sr-only">
          Nuestras Colecciones
        </h2>
        <SectionHeader
          title="Nuestras Colecciones"
          description="Explora nuestra colección de textiles artesanales"
        />

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {categorias.map((collection) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              featured={!!collection.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
