import Link from "next/link";
import Image from "next/image";
import type { Producto } from "@/lib/types";
import { STORAGE } from "@/lib/constants";

interface ProductCardProps {
  producto: Producto;
  imagenPrincipal?: string;
}

export function ProductCard({ producto, imagenPrincipal }: ProductCardProps) {
  const imageSrc = imagenPrincipal || STORAGE.productPlaceholder;
  const precioFormateado = producto.precio_desde
    ? `Desde $${producto.precio_desde.toLocaleString("es-AR")}`
    : null;

  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-lg
        border border-border
        bg-background
        transition-shadow
        hover:shadow-lg
      "
    >
      {/* Badge Destacado */}
      {producto.destacado && (
        <div
          className="
            absolute
            top-3
            right-3
            z-10
            rounded-full
            bg-accent
            px-3
            py-1
            text-xs
            font-medium
            text-white
            shadow-md
          "
        >
          Destacado
        </div>
      )}

      {/* Imagen del Producto */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={`${producto.nombre} - Textil artesanal de Muma Estudio`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
          "
          loading="lazy"
        />
      </div>

      {/* Información del Producto */}
      <div className="p-4">
        <h3
          className="
            mb-1
            text-lg
            font-medium
            text-foreground
            transition-colors
            group-hover:text-accent
          "
        >
          {producto.nombre}
        </h3>

        {precioFormateado && (
          <p className="text-sm text-muted-foreground">{precioFormateado}</p>
        )}
      </div>
    </Link>
  );
}
