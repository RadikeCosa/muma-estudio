import { LAYOUT, SPACING, ANIMATIONS } from "@/lib/design/tokens";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getCategorias } from "@/lib/supabase/queries";
import type { Categoria } from "@/lib/types";
import { HOME_CONTENT } from "@/lib/content/home";

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
// BlurDataURL base64 para el placeholder (puedes reemplazarlo por uno generado real si tienes)
const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...";

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
        {collection.imagen ? (
          <Image
            src={collection.imagen}
            alt={
              collection.nombre
                ? `Imagen de la colección ${collection.nombre}`
                : "Imagen de colección"
            }
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={
              featured
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
            priority={featured}
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <Image
            src={PLACEHOLDER_IMAGE}
            alt={
              collection.nombre
                ? `Imagen de la colección ${collection.nombre}`
                : "Imagen de colección"
            }
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={
              featured
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
            priority={featured}
            placeholder="blur"
            blurDataURL={PLACEHOLDER_BLUR}
            loading={featured ? "eager" : "lazy"}
          />
        )}
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
  let categorias: Categoria[] | null = null;
  try {
    categorias = await getCategorias();
  } catch (error) {
    // Opcional: console.error('Error al cargar categorías', error);
    return null;
  }
  if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
    return null;
  }
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
          {HOME_CONTENT.categories.title}
        </h2>
        <SectionHeader
          title={HOME_CONTENT.categories.title}
          description={HOME_CONTENT.categories.description}
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
