import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * TextureDivider - Full-width grayscale texture divider
 *
 * Displays a panoramic texture image (linen, fabric) with grayscale filter
 * to create visual separation between sections while maintaining boutique aesthetic.
 */

interface TextureDividerProps {
  /**
   * Path to texture image (relative to public folder)
   * Default: /images/textures/linen-texture.jpg
   */
  imagePath?: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * Custom CSS classes
   */
  className?: string;
}

export function TextureDivider({
  imagePath = "/images/line-texture.webp", // Temporary: using existing image until linen-texture.jpg is added
  alt = "Textura de lino natural",
  className,
}: TextureDividerProps) {
  return (
    <div
      className={cn(
        "relative h-50 w-full overflow-hidden sm:h-62.5 lg:h-75",
        className,
      )}
    >
      <Image
        src={imagePath}
        alt={alt}
        fill
        className="object-cover  opacity-40 grayscale"
        priority={false}
        sizes="100vw"
      />
    </div>
  );
}
