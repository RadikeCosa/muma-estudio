import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProductos } from "@/lib/supabase/queries";
import { ProductCard } from "@/components/productos/ProductCard";
import { SITE_CONFIG } from "@/lib/constants";

export default async function Home() {
  // Obtener productos destacados
  const todosLosProductos = await getProductos();
  const productosDestacados = todosLosProductos
    .filter((p) => p.destacado)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="
          relative
          bg-gradient-to-b from-muted/30 to-background
          px-4 py-20
          sm:px-6 sm:py-28
          lg:px-8 lg:py-32
        "
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="
              mb-6
              inline-flex items-center gap-2
              rounded-full
              border border-border
              bg-background
              px-4 py-2
              text-sm
              text-accent
            "
          >
            <Sparkles className="h-4 w-4" />
            <span>Textiles Artesanales Únicos</span>
          </div>

          {/* Título principal */}
          <h1
            className="
              mb-6
              text-5xl
              font-bold
              tracking-tight
              text-foreground
              sm:text-6xl
              lg:text-7xl
            "
          >
            {SITE_CONFIG.name}
          </h1>

          {/* Subtítulo */}
          <p
            className="
              mb-4
              text-xl
              text-accent
              sm:text-2xl
            "
          >
            {SITE_CONFIG.tagline}
          </p>

          {/* Descripción */}
          <p
            className="
              mx-auto
              mb-10
              max-w-2xl
              text-base
              leading-relaxed
              text-accent
              sm:text-lg
            "
          >
            Creamos manteles, servilletas y caminos de mesa con dedicación
            artesanal. Cada pieza es única y diseñada para transformar tus
            espacios en lugares especiales.
          </p>

          {/* CTA Buttons */}
          <div
            className="
              flex flex-col gap-4
              sm:flex-row sm:justify-center
            "
          >
            <Link
              href="/productos"
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg
                bg-foreground
                px-6 py-3
                text-base font-medium
                text-background
                transition-all
                duration-200
                hover:opacity-90
                hover:shadow-lg
                sm:px-8 sm:py-4
                sm:text-lg
              "
            >
              Ver Productos
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/sobre-nosotros"
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg
                border border-border
                bg-background
                px-6 py-3
                text-base font-medium
                text-foreground
                transition-all
                duration-200
                hover:bg-muted
                hover:shadow-lg
                sm:px-8 sm:py-4
                sm:text-lg
              "
            >
              Sobre Nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      {productosDestacados.length > 0 && (
        <section
          className="
            mx-auto max-w-7xl
            px-4 py-16
            sm:px-6 sm:py-20
            lg:px-8 lg:py-24
          "
        >
          {/* Encabezado de sección */}
          <div className="mb-12 text-center">
            <h2
              className="
                mb-4
                text-3xl
                font-bold
                text-foreground
                sm:text-4xl
                lg:text-5xl
              "
            >
              Productos Destacados
            </h2>
            <p
              className="
                mx-auto max-w-2xl
                text-base
                text-accent
                sm:text-lg
              "
            >
              Nuestras piezas más especiales, creadas con dedicación y amor por
              el detalle
            </p>
          </div>

          {/* Grid de productos */}
          <div
            className="
              grid grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-8
            "
          >
            {productosDestacados.map((producto) => {
              const imagenPrincipal =
                producto.imagenes?.find((img) => img.es_principal)?.url ||
                producto.imagenes?.[0]?.url;

              return (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  imagenPrincipal={imagenPrincipal}
                />
              );
            })}
          </div>

          {/* Link a todos los productos */}
          <div className="mt-12 text-center">
            <Link
              href="/productos"
              className="
                inline-flex items-center gap-2
                text-base font-medium
                text-foreground
                transition-colors
                hover:text-accent
                sm:text-lg
              "
            >
              Ver todos los productos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Categorías */}
      <section
        className="
          bg-muted/30
          px-4 py-16
          sm:px-6 sm:py-20
          lg:px-8 lg:py-24
        "
      >
        <div className="mx-auto max-w-7xl">
          {/* Encabezado de sección */}
          <div className="mb-12 text-center">
            <h2
              className="
                mb-4
                text-3xl
                font-bold
                text-foreground
                sm:text-4xl
                lg:text-5xl
              "
            >
              Nuestras Categorías
            </h2>
            <p
              className="
                mx-auto max-w-2xl
                text-base
                text-accent
                sm:text-lg
              "
            >
              Explora nuestra colección de textiles artesanales
            </p>
          </div>

          {/* Grid de categorías */}
          <div
            className="
              grid grid-cols-1
              gap-6
              sm:grid-cols-3
              lg:gap-8
            "
          >
            {/* Manteles */}
            <Link
              href="/productos"
              className="
                group
                overflow-hidden
                rounded-xl
                border border-border
                bg-background
                transition-all
                duration-300
                hover:shadow-xl
                hover:border-accent/20
              "
            >
              <div
                className="
                  aspect-[4/3]
                  overflow-hidden
                  bg-muted
                "
              >
                {/* Placeholder para imagen de categoría */}
                <div
                  className="
                    flex h-full w-full
                    items-center justify-center
                    bg-gradient-to-br from-muted to-muted/50
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <span
                    className="
                      text-4xl
                      font-bold
                      text-accent/30
                    "
                  >
                    Manteles
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3
                  className="
                    mb-2
                    text-xl
                    font-semibold
                    text-foreground
                    transition-colors
                    group-hover:text-accent
                  "
                >
                  Manteles
                </h3>
                <p className="text-sm text-accent">
                  Para darle un toque especial a tu mesa
                </p>
              </div>
            </Link>

            {/* Servilletas */}
            <Link
              href="/productos"
              className="
                group
                overflow-hidden
                rounded-xl
                border border-border
                bg-background
                transition-all
                duration-300
                hover:shadow-xl
                hover:border-accent/20
              "
            >
              <div
                className="
                  aspect-[4/3]
                  overflow-hidden
                  bg-muted
                "
              >
                <div
                  className="
                    flex h-full w-full
                    items-center justify-center
                    bg-gradient-to-br from-muted to-muted/50
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <span
                    className="
                      text-4xl
                      font-bold
                      text-accent/30
                    "
                  >
                    Servilletas
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3
                  className="
                    mb-2
                    text-xl
                    font-semibold
                    text-foreground
                    transition-colors
                    group-hover:text-accent
                  "
                >
                  Servilletas
                </h3>
                <p className="text-sm text-accent">
                  Detalles que marcan la diferencia
                </p>
              </div>
            </Link>

            {/* Caminos de Mesa */}
            <Link
              href="/productos"
              className="
                group
                overflow-hidden
                rounded-xl
                border border-border
                bg-background
                transition-all
                duration-300
                hover:shadow-xl
                hover:border-accent/20
              "
            >
              <div
                className="
                  aspect-[4/3]
                  overflow-hidden
                  bg-muted
                "
              >
                <div
                  className="
                    flex h-full w-full
                    items-center justify-center
                    bg-gradient-to-br from-muted to-muted/50
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <span
                    className="
                      text-4xl
                      font-bold
                      text-accent/30
                    "
                  >
                    Caminos
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3
                  className="
                    mb-2
                    text-xl
                    font-semibold
                    text-foreground
                    transition-colors
                    group-hover:text-accent
                  "
                >
                  Caminos de Mesa
                </h3>
                <p className="text-sm text-accent">Elegancia en cada detalle</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section
        className="
          mx-auto max-w-4xl
          px-4 py-16
          text-center
          sm:px-6 sm:py-20
          lg:px-8 lg:py-24
        "
      >
        <h2
          className="
            mb-6
            text-3xl
            font-bold
            text-foreground
            sm:text-4xl
          "
        >
          ¿Tenés alguna consulta?
        </h2>
        <p
          className="
            mb-8
            text-base
            text-accent
            sm:text-lg
          "
        >
          Estamos para ayudarte a encontrar el producto perfecto para tu hogar
        </p>
        <Link
          href="/contacto"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg
            bg-foreground
            px-6 py-3
            text-base font-medium
            text-background
            transition-all
            duration-200
            hover:opacity-90
            hover:shadow-lg
            sm:px-8 sm:py-4
            sm:text-lg
          "
        >
          Contactanos
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
