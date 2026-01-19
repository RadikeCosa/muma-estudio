import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DecorativeBadge } from "@/components/ui/DecorativeBadge";
import { getProductosDestacados } from "@/lib/supabase/queries";
import { HOME_CONTENT, FEATURED_PRODUCTS_LIMIT } from "@/lib/content/home";
import { TYPOGRAPHY, SPACING, COMPONENTS } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * FeaturedProducts - Productos destacados de la temporada
 * 
 * Features:
 * - Header con línea divisoria decorativa
 * - Grid con offset alternado (pl-8 cada 2do item)
 * - Hover effect en imágenes (scale-105)
 * - Badge "Pieza Única" si producto.destacado
 * - Botón "+" para ver detalle
 * - Link final para ver colección completa
 */
export async function FeaturedProducts() {
  const { featured } = HOME_CONTENT;
  
  // Fetch productos destacados desde Supabase
  const productos = await getProductosDestacados(FEATURED_PRODUCTS_LIMIT);

  if (productos.length === 0) {
    return null;
  }

  return (
    <section className={cn(SPACING.section.lg, "max-w-lg mx-auto px-6")}>
      {/* Section Header */}
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <h2 className={TYPOGRAPHY.heading.section}>
            {featured.sectionTitle}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {featured.sectionSubtitle}
          </p>
        </div>
        <div
          className="h-[1px] flex-grow mx-8 bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        />
      </div>

      {/* Products Grid */}
      <div className="space-y-16">
        {productos.map((producto, index) => {
          const imagenPrincipal = producto.imagenes.find(
            (img) => img.es_principal
          );
          const precioMin = Math.min(
            ...producto.variaciones.map((v) => v.precio)
          );

          return (
            <article
              key={producto.id}
              className={cn(
                COMPONENTS.card.product,
                index % 2 === 1 && "pl-8" // Offset alternado
              )}
            >
              {/* Image */}
              <Link
                href={`/productos/${producto.slug}`}
                className={COMPONENTS.card.image}
              >
                {imagenPrincipal && (
                  <Image
                    src={imagenPrincipal.url}
                    alt={imagenPrincipal.alt_text || producto.nombre}
                    width={600}
                    height={750}
                    className={cn(
                      "w-full h-full object-cover",
                      COMPONENTS.card.imageHover
                    )}
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                )}

                {/* Badge si es destacado */}
                {producto.destacado && (
                  <div className="absolute top-4 left-4">
                    <DecorativeBadge variant="filled">
                      Pieza Única
                    </DecorativeBadge>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex justify-between items-start mt-6">
                <div>
                  <h3 className={TYPOGRAPHY.heading.card}>
                    <Link
                      href={`/productos/${producto.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {producto.nombre}
                    </Link>
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-widest mt-1">
                    Desde ${precioMin.toLocaleString("es-AR")}
                  </p>
                </div>

                {/* View button */}
                <Link
                  href={`/productos/${producto.slug}`}
                  className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label={`Ver ${producto.nombre}`}
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA - Ver colección completa */}
      <div className="mt-16 text-center">
        <Link
          href={featured.cta.href}
          className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors"
        >
          {featured.cta.text}
        </Link>
      </div>
    </section>
  );
}
