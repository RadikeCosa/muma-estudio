/**
 * Home Page Content
 * Contenido centralizado para la página principal
 */

export const HOME_CONTENT = {
  hero: {
    badge: "Textiles Artesanales Únicos",
    title: "Muma Estudio",
    subtitle: "La belleza de lo hecho",
    subtitleHighlight: "a mano.",
    description:
      "Piezas únicas diseñadas para transformar tus espacios cotidianos en lugares especiales.",
    cta: {
      primary: "Ver Productos",
      primaryHref: "/productos",
      secondary: "Sobre Nosotros",
      secondaryHref: "/sobre-nosotros",
    },
  },

  featured: {
    sectionTitle: "Destacados",
    sectionSubtitle: "Selección de temporada",
    cta: {
      text: "Explorar Colección Completa",
      href: "/productos",
    },
  },

  collections: {
    title: "Colecciones",
    items: [
      {
        name: "Manteles",
        slug: "manteles",
        image: "/images/colecciones/manteles.jpg",
        featured: true, // Ocupa 2 columnas en grid
      },
      {
        name: "Servilletas",
        slug: "servilletas",
        image: "/images/colecciones/servilletas.jpg",
        featured: false,
      },
      {
        name: "Caminos",
        slug: "caminos-de-mesa",
        image: "/images/colecciones/caminos.jpg",
        featured: false,
      },
    ],
  },

  contact: {
    title: "¿Tenés alguna consulta?",
    description:
      "Personalizamos medidas y diseños para eventos especiales. Escribinos y creamos algo único juntos.",
    cta: {
      text: "Contactanos",
      href: "/contacto",
    },
  },

  textureImage: {
    src: "/images/textures/linen-texture.jpg",
    alt: "Textura de lino artesanal",
  },
} as const;
