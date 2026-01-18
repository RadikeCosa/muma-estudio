// Design tokens centralizados para estilos comunes (usables en className)
// Inspirados en los valores de Tailwind usados en la Home

export const SPACING = {
  sectionPadding: {
    sm: "px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28",
    md: "px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36",
    lg: "px-4 py-20 sm:px-6 sm:py-32 lg:px-8 lg:py-40",
  },
  containerPadding: {
    sm: "px-4 sm:px-6 lg:px-8",
    md: "px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28",
    lg: "px-4 sm:px-6 lg:px-8 py-28 lg:py-36",
  },
};

// COLORES centralizados usando variables CSS de Tailwind
export const COLORS = {
  foreground: "text-foreground",
  background: "bg-background",
  muted: "text-muted bg-muted",
  border: "border-border",
  accent: "text-accent bg-accent",
};

// SISTEMA DE TIPOGRAFÍA
export const TYPOGRAPHY = {
  heading: {
    page: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
    section: "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
    card: "text-xl font-bold sm:text-2xl",
    subsection: "text-2xl font-semibold sm:text-3xl",
  },
  body: {
    base: "text-base leading-relaxed",
    small: "text-sm leading-relaxed",
    muted: "text-base text-muted-foreground",
  },
};

// SPACING expandido
export const SPACING = {
  sectionPadding: {
    sm: "px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28",
    md: "px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36",
    lg: "px-4 py-20 sm:px-6 sm:py-32 lg:px-8 lg:py-40",
  },
  containerPadding: {
    sm: "px-4 sm:px-6 lg:px-8",
    md: "px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28",
    lg: "px-4 sm:px-6 lg:px-8 py-28 lg:py-36",
  },
  page: "px-4 py-12 sm:px-8 sm:py-20 lg:px-16 lg:py-28",
  pageNarrow: "px-4 py-12 max-w-5xl mx-auto sm:px-8 sm:py-20 lg:px-16 lg:py-28",
  section: "mb-20 sm:mb-28",
  sectionLarge: "mb-32 sm:mb-40",
};

// COMPONENTES comunes
export const COMPONENTS = {
  input: {
    base: "block w-full rounded-xl border border-border bg-background px-5 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200",
    placeholder: "placeholder:text-muted-foreground",
    focus: "focus:ring-2 focus:ring-accent focus:border-accent",
    hover: "hover:border-accent",
  },
  card: {
    base: "rounded-2xl border border-border bg-white shadow-card transition-all duration-300",
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    hover:
      "hover:shadow-card-hover hover:border-foreground/10 hover:-translate-y-2",
  },
  iconContainer: {
    base: "inline-flex items-center justify-center rounded-full bg-muted text-accent",
    hover: "hover:bg-accent hover:text-background",
  },
  button: {
    primary:
      "bg-foreground text-background shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-foreground",
    secondary:
      "border-2 border-border bg-white/50 backdrop-blur-sm text-foreground shadow-sm hover:bg-white hover:border-foreground/20 hover:shadow-md focus:ring-foreground",
    ghost: "text-foreground hover:bg-muted/50",
    sizes: {
      sm: "px-6 py-2.5 text-sm",
      md: "px-8 py-4 text-base sm:px-10 sm:py-4 sm:text-lg",
      lg: "px-10 py-5 text-lg sm:px-12 sm:py-5 sm:text-xl",
    },
  },
};

// LAYOUT expandido
export const LAYOUT = {
  container: {
    maxW7xl: "mx-auto max-w-7xl",
    maxW5xl: "mx-auto max-w-5xl",
    maxW4xl: "mx-auto max-w-4xl",
    maxW2xl: "mx-auto max-w-2xl",
  },
  grid: {
    products: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8",
    categories: "grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8",
    twoCol: "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12",
    features: "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-16",
  },
};

// Helper para combinar tokens
export const combine = (...tokens: (string | undefined)[]) =>
  tokens.filter(Boolean).join(" ");

export const ANIMATIONS = {
  fadeIn: "animate-in fade-in duration-700",
  fadeInDelayed: "animate-in fade-in duration-700 delay-150",
  shimmer: "shine-effect",
  hoverCard:
    "hover:shadow-card-hover hover:border-foreground/10 hover:-translate-y-2",
  hoverIcon: "transition-all group-hover:translate-x-1 group-hover:scale-110",
};

export const LAYOUT = {
  container: {
    maxW7xl: "mx-auto max-w-7xl",
    maxW4xl: "mx-auto max-w-4xl",
  },
  grid: {
    products: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8",
    categories: "grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8",
  },
};

export const GRADIENTS = {
  hero: "bg-gradient-to-b from-muted/50 via-background to-background",
  section: "bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30",
  card: "bg-gradient-to-br from-muted/50 to-muted",
};
