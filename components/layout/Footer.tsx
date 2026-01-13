import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

const quickLinks: FooterLink[] = [
  { label: "Productos", href: "/productos" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
];

export function Footer(): React.ReactElement {
  return (
    <footer
      className="
        bg-muted
        border-t border-border
        text-foreground
        text-sm
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-4 py-10
          sm:px-6
          md:px-8 md:py-12
        "
      >
        <div
          className="
            grid gap-10
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Sobre Muma Estudio
            </h2>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Enlaces Rápidos
            </h2>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-sm
                      text-foreground
                      hover:text-accent
                      transition-colors
                      duration-200
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Contacto
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Mail className="h-4 w-4 text-accent" aria-hidden />
                <span>contacto@mumaestudio.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Phone className="h-4 w-4 text-accent" aria-hidden />
                <span>+54 9 299 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Instagram className="h-4 w-4 text-accent" aria-hidden />
                <span>@mumaestudio</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="
            mt-12
            border-t border-border
            pt-6
            flex flex-col gap-3
            sm:flex-row sm:items-center sm:justify-between
            text-xs sm:text-sm
            text-foreground
          "
        >
          <span>© 2026 Muma Estudio. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4 text-foreground">
            <span className="hover:text-accent transition-colors duration-200">
              Términos y Condiciones
            </span>
            <span className="text-border">|</span>
            <span className="hover:text-accent transition-colors duration-200">
              Política de Privacidad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
