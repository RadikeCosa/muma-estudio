/**
 * Shared formatting utilities
 */
const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return "Consultar precio";
  return priceFormatter.format(amount);
}

export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string {
  if (min == null && max == null) return "Consultar precio";
  if (min != null && max != null && min === max) return formatPrice(min);

  const low = formatPrice(min ?? max ?? 0);
  const high = formatPrice(max ?? min ?? 0);

  if (min != null && max != null) {
    return `Desde ${low} - Hasta ${high}`;
  }

  return low;
}

export function formatStock(stock: number): string {
  if (stock === 0) return "A pedido";
  if (stock === 1) return "1 disponible";
  return `${stock} disponibles`;
}

export const formatters = {
  formatPrice,
  formatPriceRange,
  formatStock,
} as const;
