import Image from "next/image";
import { HOME_CONTENT } from "@/lib/content/home";

/**
 * TextureDivider - Divider con imagen de textura
 * 
 * Muestra una imagen de textura en blanco y negro entre secciones.
 * En dark mode aplica filtro invert sutil.
 */
export function TextureDivider() {
  const { textureImage } = HOME_CONTENT;

  return (
    <section className="h-[300px] w-full overflow-hidden" aria-hidden="true">
      <Image
        src={textureImage.src}
        alt={textureImage.alt}
        width={1920}
        height={300}
        className="w-full h-full object-cover grayscale dark:invert-[0.1]"
        priority={false}
        sizes="100vw"
      />
    </section>
  );
}
