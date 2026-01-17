/**
 * Analytics event constants
 * Centralized event definitions for Google Analytics tracking
 */

/**
 * WhatsApp button click event
 * Tracks when users click to consult via WhatsApp
 */
export const WHATSAPP_CLICK = {
  name: "whatsapp_click",
  category: "engagement",
} as const;

/**
 * Product detail view event
 * Tracks when users view a product detail page (GA4 recommended event)
 */
export const PRODUCT_VIEW = {
  name: "view_item",
  category: "ecommerce",
} as const;

/**
 * Category filter event
 * Tracks when users filter products by category
 */
export const CATEGORY_FILTER = {
  name: "filter_products",
  category: "navigation",
} as const;

/**
 * Variation selection event
 * Tracks when users select a product variation (size/color)
 */
export const VARIATION_SELECT = {
  name: "select_item",
  category: "ecommerce",
} as const;

/**
 * All analytics events grouped for easy access
 */
export const ANALYTICS_EVENTS = {
  WHATSAPP_CLICK,
  PRODUCT_VIEW,
  CATEGORY_FILTER,
  VARIATION_SELECT,
} as const;

/**
 * Type for a single analytics event
 */
export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Valid event names for type checking
 */
export type AnalyticsEventName = AnalyticsEvent["name"];

/**
 * Valid event categories for type checking
 */
export type AnalyticsEventCategory = AnalyticsEvent["category"];
