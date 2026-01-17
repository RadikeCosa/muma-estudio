/**
 * Google Analytics tracking utilities
 * Custom event tracking for user interactions
 */

import type { Producto, Variacion } from "@/lib/types";
import { ANALYTICS_EVENTS } from "./events";

// Extend window object to include gtag
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set",
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

/**
 * Check if Google Analytics is available and should track
 */
function canTrack(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    process.env.NODE_ENV === "production"
  );
}

/**
 * Track WhatsApp button click with product information
 * @param producto - Product being consulted
 * @param variacion - Selected variation (optional)
 */
export function trackWhatsAppClick(
  producto: Producto,
  variacion?: Variacion,
): void {
  if (!canTrack()) return;

  const event = ANALYTICS_EVENTS.WHATSAPP_CLICK;
  window.gtag!("event", event.name, {
    event_category: event.category,
    event_label: producto.nombre,
    producto_id: producto.id,
    producto_nombre: producto.nombre,
    producto_slug: producto.slug,
    variacion_tamanio: variacion?.tamanio ?? null,
    variacion_color: variacion?.color ?? null,
    variacion_precio: variacion?.precio ?? null,
    value: variacion?.precio ?? producto.precio_desde ?? 0,
  });
}

/**
 * Track product detail page view
 * @param producto - Product being viewed
 */
export function trackProductView(producto: Producto): void {
  if (!canTrack()) return;

  const event = ANALYTICS_EVENTS.PRODUCT_VIEW;
  window.gtag!("event", event.name, {
    event_category: event.category,
    event_label: producto.nombre,
    producto_id: producto.id,
    producto_nombre: producto.nombre,
    producto_slug: producto.slug,
    categoria_id: producto.categoria_id,
    precio_desde: producto.precio_desde,
    value: producto.precio_desde ?? 0,
  });
}

/**
 * Track category filter usage
 * @param categoriaSlug - Selected category slug
 * @param categoriaNombre - Category name for readable label
 */
export function trackCategoryFilter(
  categoriaSlug: string,
  categoriaNombre: string,
): void {
  if (!canTrack()) return;

  const event = ANALYTICS_EVENTS.CATEGORY_FILTER;
  window.gtag!("event", event.name, {
    event_category: event.category,
    event_label: categoriaNombre,
    filter_type: "category",
    filter_value: categoriaSlug,
  });
}

/**
 * Track variation selection
 * @param producto - Product being configured
 * @param variacion - Selected variation
 */
export function trackVariationSelect(
  producto: Producto,
  variacion: Variacion,
): void {
  if (!canTrack()) return;

  const event = ANALYTICS_EVENTS.VARIATION_SELECT;
  window.gtag!("event", event.name, {
    event_category: event.category,
    event_label: `${producto.nombre} - ${variacion.tamanio} ${variacion.color}`,
    producto_id: producto.id,
    variacion_id: variacion.id,
    variacion_tamanio: variacion.tamanio,
    variacion_color: variacion.color,
    variacion_precio: variacion.precio,
    value: variacion.precio,
  });
}
