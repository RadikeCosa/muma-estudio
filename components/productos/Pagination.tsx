/**
 * Pagination component for product listing
 */
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  categoriaSlug?: string;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  categoriaSlug,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const displayTotalPages = totalPages === 0 ? 1 : totalPages;

  const buildHref = (targetPage: number): string => {
    const params = new URLSearchParams();

    if (categoriaSlug) {
      params.set("categoria", categoriaSlug);
    }

    if (targetPage > 1) {
      params.set("page", targetPage.toString());
    }

    const queryString = params.toString();
    return queryString ? `/productos?${queryString}` : "/productos";
  };

  const previousHref = buildHref(Math.max(1, page - 1));
  const nextHref = buildHref(page + 1);

  return (
    <nav aria-label="Paginación" className="flex items-center gap-4">
      <Link
        href={previousHref}
        aria-disabled={!hasPreviousPage}
        className={`
          inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium
          transition-colors duration-150
          ${
            hasPreviousPage
              ? "bg-background text-foreground hover:bg-muted"
              : "pointer-events-none border-dashed text-muted-foreground/70"
          }
        `}
      >
        Anterior
      </Link>

      <span className="text-sm text-muted-foreground">
        Página {page} de {displayTotalPages}
      </span>

      <Link
        href={nextHref}
        aria-disabled={!hasNextPage}
        className={`
          inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium
          transition-colors duration-150
          ${
            hasNextPage
              ? "bg-background text-foreground hover:bg-muted"
              : "pointer-events-none border-dashed text-muted-foreground/70"
          }
        `}
      >
        Siguiente
      </Link>
    </nav>
  );
}
