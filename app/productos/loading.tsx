/**
 * Loading state para página de productos
 * Muestra skeletons mientras se cargan los datos
 */
export default function ProductosLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Breadcrumbs skeleton */}
      <div className="mb-8">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>

      {/* Page header skeleton */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 h-12 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto h-6 w-[600px] max-w-full animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Category filter skeleton */}
      <div className="mb-12 flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 flex-shrink-0 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      {/* Skeleton grid de productos */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-lg
              border border-border
              bg-background
            "
          >
            {/* Skeleton imagen */}
            <div className="aspect-square w-full animate-pulse bg-muted" />

            {/* Skeleton contenido */}
            <div className="p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-12 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
