import { HOME_CONTENT } from "@/lib/content/home";
import { LAYOUT, SPACING } from "@/lib/design/tokens";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/productos/ProductCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductoCompleto } from "@/lib/types";

interface FeaturedProductsSectionProps {
  productos: ProductoCompleto[];
}

export function FeaturedProductsSection({
  productos,
}: FeaturedProductsSectionProps) {
  // Map new featured structure to old featuredProducts structure for backward compatibility
  const title = HOME_CONTENT.featured.sectionTitle;
  const description = HOME_CONTENT.featured.sectionSubtitle;
  const viewAllCta = HOME_CONTENT.featured.cta.text;

  if (!productos || productos.length === 0) return null;

  return (
    <section className={cn(SPACING.sectionPadding.sm)}>
      <div className={LAYOUT.container.maxW7xl}>
        <SectionHeader title={title} description={description} />
        <div className={LAYOUT.grid.products}>
          {productos.map((producto) => {
            const imagenPrincipal =
              producto.imagenes?.find((img) => img.es_principal)?.url ||
              producto.imagenes?.[0]?.url;
            return (
              <div key={producto.id} className="shine-effect rounded-2xl">
                <ProductCard
                  producto={producto}
                  imagenPrincipal={imagenPrincipal}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Button href="/productos" variant="ghost" className="group">
            {viewAllCta}
            <ArrowRight className="h-5 w-5 transition-all group-hover:translate-x-1 group-hover:scale-110" />
          </Button>
        </div>
      </div>
    </section>
  );
}
