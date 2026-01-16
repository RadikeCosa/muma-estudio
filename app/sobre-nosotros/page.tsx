import { Metadata } from "next";
import Image from "next/image";
import { Heart, Sparkles, Leaf, Users } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: `Conocé la historia de ${SITE_CONFIG.name}, nuestro proceso artesanal y los valores que nos inspiran.`,
};

export default function SobreNosotrosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      {/* Encabezado */}
      <div className="mb-16 text-center">
        <h1
          className="
            mb-6
            text-4xl
            font-bold
            tracking-tight
            text-foreground
            sm:text-5xl
            lg:text-6xl
          "
        >
          Sobre Nosotros
        </h1>
        <p
          className="
            mx-auto max-w-2xl
            text-lg
            text-accent
            sm:text-xl
          "
        >
          Creamos textiles únicos con dedicación y amor por el detalle
        </p>
      </div>

      {/* Imagen del taller */}
      <div
        className="
          mb-20
          overflow-hidden
          rounded-xl
          border border-border
          shadow-lg
        "
      >
        <Image
          src="/images/about.webp"
          alt="Taller de Muma Estudio"
          width={1200}
          height={600}
          className="
            h-auto w-full
            object-cover
          "
          priority
        />
      </div>

      {/* Contenido principal */}
      <div className="space-y-20">
        {/* Sección 1: Nuestra Historia */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-muted
                text-foreground
              "
            >
              <Heart className="h-6 w-6" />
            </div>
            <h2
              className="
                text-3xl
                font-bold
                text-foreground
                sm:text-4xl
              "
            >
              Nuestra Historia
            </h2>
          </div>
          <div
            className="
              space-y-6
              text-base
              leading-relaxed
              text-accent
              sm:text-lg
            "
          >
            <p>
              Muma Estudio nació de la pasión por crear piezas textiles únicas
              que transformen los espacios cotidianos en lugares especiales.
              Cada producto es el resultado de un cuidadoso proceso artesanal
              que combina técnicas tradicionales con diseños contemporáneos.
            </p>
            <p>
              Desde nuestros inicios, nos hemos dedicado a trabajar con
              materiales de primera calidad, buscando siempre la excelencia en
              cada detalle. Creemos que los textiles para el hogar no son solo
              elementos decorativos, sino piezas que acompañan momentos
              importantes y crean memorias.
            </p>
            <p>
              Nuestro taller es un espacio donde la creatividad y la artesanía
              se encuentran, dando vida a manteles, servilletas y caminos de
              mesa que cuentan historias y reflejan la personalidad de cada
              hogar.
            </p>
          </div>
        </section>

        {/* Sección 2: Proceso Artesanal */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-muted
                text-foreground
              "
            >
              <Sparkles className="h-6 w-6" />
            </div>
            <h2
              className="
                text-3xl
                font-bold
                text-foreground
                sm:text-4xl
              "
            >
              Proceso Artesanal
            </h2>
          </div>
          <div
            className="
              space-y-6
              text-base
              leading-relaxed
              text-accent
              sm:text-lg
            "
          >
            <p>
              Cada pieza que creamos pasa por un meticuloso proceso de
              elaboración que garantiza su calidad y durabilidad. Seleccionamos
              cuidadosamente los materiales, priorizando fibras naturales y
              telas de alta calidad que ofrecen tanto belleza como
              funcionalidad.
            </p>
            <p>
              El diseño de cada producto es pensado para complementar diferentes
              estilos de decoración, desde lo más clásico hasta lo más
              contemporáneo. Trabajamos con atención al detalle en cada costura,
              cada terminación, asegurándonos de que cada pieza sea perfecta
              antes de llegar a tu hogar.
            </p>
            <p>
              Nuestro compromiso es mantener viva la tradición artesanal,
              adaptándola a las necesidades y gustos actuales, creando productos
              que perduren en el tiempo tanto en calidad como en estilo.
            </p>
          </div>
        </section>

        {/* Sección 3: Nuestros Valores */}
        <section>
          <div className="mb-12 text-center">
            <h2
              className="
                mb-4
                text-3xl
                font-bold
                text-foreground
                sm:text-4xl
              "
            >
              Nuestros Valores
            </h2>
            <p
              className="
                mx-auto max-w-2xl
                text-base
                text-accent
                sm:text-lg
              "
            >
              Los pilares que guían nuestro trabajo diario
            </p>
          </div>

          <div
            className="
              grid grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:gap-8
            "
          >
            {/* Valor 1 */}
            <div
              className="
                group
                rounded-xl
                border border-border
                bg-muted/50
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-accent/20
                sm:p-8
              "
            >
              <div
                className="
                  mb-4
                  flex h-12 w-12
                  items-center justify-center
                  rounded-full
                  bg-background
                  text-foreground
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Sparkles className="h-6 w-6" />
              </div>
              <h3
                className="
                  mb-3
                  text-xl
                  font-semibold
                  text-foreground
                "
              >
                Calidad Artesanal
              </h3>
              <p
                className="
                  text-base
                  leading-relaxed
                  text-accent
                "
              >
                Nos comprometemos con la excelencia en cada pieza que creamos.
                Cada producto es elaborado con dedicación y cuidado, asegurando
                que cumpla con los más altos estándares de calidad.
              </p>
            </div>

            {/* Valor 2 */}
            <div
              className="
                group
                rounded-xl
                border border-border
                bg-muted/50
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-accent/20
                sm:p-8
              "
            >
              <div
                className="
                  mb-4
                  flex h-12 w-12
                  items-center justify-center
                  rounded-full
                  bg-background
                  text-foreground
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Heart className="h-6 w-6" />
              </div>
              <h3
                className="
                  mb-3
                  text-xl
                  font-semibold
                  text-foreground
                "
              >
                Diseño Consciente
              </h3>
              <p
                className="
                  text-base
                  leading-relaxed
                  text-accent
                "
              >
                Creemos en el diseño con propósito. Cada elemento de nuestros
                productos está pensado para ser funcional, bello y duradero,
                evitando tendencias pasajeras y apostando por lo atemporal.
              </p>
            </div>

            {/* Valor 3 */}
            <div
              className="
                group
                rounded-xl
                border border-border
                bg-muted/50
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-accent/20
                sm:p-8
              "
            >
              <div
                className="
                  mb-4
                  flex h-12 w-12
                  items-center justify-center
                  rounded-full
                  bg-background
                  text-foreground
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Leaf className="h-6 w-6" />
              </div>
              <h3
                className="
                  mb-3
                  text-xl
                  font-semibold
                  text-foreground
                "
              >
                Producción Responsable
              </h3>
              <p
                className="
                  text-base
                  leading-relaxed
                  text-accent
                "
              >
                Trabajamos de manera consciente y responsable, optimizando
                recursos y minimizando desperdicios. Valoramos el trabajo
                artesanal y el tiempo que requiere crear productos de calidad.
              </p>
            </div>

            {/* Valor 4 */}
            <div
              className="
                group
                rounded-xl
                border border-border
                bg-muted/50
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-accent/20
                sm:p-8
              "
            >
              <div
                className="
                  mb-4
                  flex h-12 w-12
                  items-center justify-center
                  rounded-full
                  bg-background
                  text-foreground
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Users className="h-6 w-6" />
              </div>
              <h3
                className="
                  mb-3
                  text-xl
                  font-semibold
                  text-foreground
                "
              >
                Atención Personalizada
              </h3>
              <p
                className="
                  text-base
                  leading-relaxed
                  text-accent
                "
              >
                Cada cliente es importante para nosotros. Ofrecemos atención
                personalizada, asesoramiento en la elección de productos y
                estamos siempre disponibles para responder consultas y
                acompañarte en tu compra.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
