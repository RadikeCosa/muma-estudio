import { cn } from "@/lib/utils";

interface DecorativeBadgeProps {
  children?: React.ReactNode;
  variant?: "outline" | "filled";
  className?: string;
}

/**
 * DecorativeBadge - Badge decorativo para destacar texto
 * 
 * @param variant - Estilo del badge (outline con borde, filled con fondo)
 * @param children - Contenido del badge (texto)
 * @param className - Clases adicionales
 */
export function DecorativeBadge({ 
  children, 
  variant = "outline", 
  className = "" 
}: DecorativeBadgeProps) {
  // Si no hay children, renderizar la línea decorativa original
  if (!children) {
    return (
      <div className={cn("mb-4 inline-block", className)}>
        <div className="inline-flex h-1 w-16 rounded-full bg-gradient-to-r from-foreground/20 via-foreground to-foreground/20" />
      </div>
    );
  }

  const baseStyles = "inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase";
  
  const variantStyles = {
    outline: "border border-zinc-300 dark:border-zinc-700 text-foreground bg-transparent",
    filled: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-none",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
}
