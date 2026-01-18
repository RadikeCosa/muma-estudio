import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

import {
  trackWhatsAppClick,
  trackProductView,
  trackCategoryFilter,
  trackVariationSelect,
} from "./gtag";
import type { Producto, Variacion } from "@/lib/types";

// Mock window.gtag calls
interface GtagCall {
  command: string;
  eventName: string;
  params: Record<string, unknown>;
}

let gtagCalls: GtagCall[] = [];
let originalGtag: typeof window.gtag;
let originalEnv: string | undefined;

describe("gtag tracking functions", () => {
  beforeEach(() => {
    // Reset calls array
    gtagCalls = [];

    // Mock window.gtag
    if (typeof window !== "undefined") {
      originalGtag = window.gtag;
    }

    // Create a mock gtag function
    (global as any).window = {
      gtag: (command: string, eventName: string, params?: Record<string, unknown>) => {
        gtagCalls.push({ command, eventName, params: params || {} });
      },
    };

    // Mock production environment
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    // Restore original gtag
    if (typeof window !== "undefined" && originalGtag) {
      (window as any).gtag = originalGtag;
    } else {
      delete (global as any).window;
    }

    // Restore environment
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  describe("trackWhatsAppClick", () => {
    it("tracks WhatsApp click with product data", () => {
      const producto: Producto = {
        id: "prod-1",
        nombre: "Mantel Floral",
        slug: "mantel-floral",
        descripcion: "Mantel artesanal",
        categoria_id: "cat-1",
        precio_desde: 15000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "3-5 días",
        material: "Algodón",
        cuidados: "Lavar a mano",
        created_at: "2024-01-01T00:00:00Z",
      };

      trackWhatsAppClick(producto);

      assert.equal(gtagCalls.length, 1);
      const call = gtagCalls[0];
      assert.equal(call.command, "event");
      assert.equal(call.params.producto_id, "prod-1");
      assert.equal(call.params.producto_nombre, "Mantel Floral");
      assert.equal(call.params.producto_slug, "mantel-floral");
    });

    it("tracks WhatsApp click with product and variation data", () => {
      const producto: Producto = {
        id: "prod-1",
        nombre: "Mantel Floral",
        slug: "mantel-floral",
        descripcion: "Mantel artesanal",
        categoria_id: "cat-1",
        precio_desde: 15000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "3-5 días",
        material: "Algodón",
        cuidados: "Lavar a mano",
        created_at: "2024-01-01T00:00:00Z",
      };

      const variacion: Variacion = {
        id: "var-1",
        producto_id: "prod-1",
        tamanio: "150x200cm",
        color: "Rojo",
        precio: 15000,
        stock: 5,
        sku: "MF-150-R",
        activo: true,
      };

      trackWhatsAppClick(producto, variacion);

      assert.equal(gtagCalls.length, 1);
      const call = gtagCalls[0];
      assert.equal(call.params.variacion_tamanio, "150x200cm");
      assert.equal(call.params.variacion_color, "Rojo");
      assert.equal(call.params.variacion_precio, 15000);
      assert.equal(call.params.value, 15000);
    });

    it("does not track in development environment", () => {
      process.env.NODE_ENV = "development";

      const producto: Producto = {
        id: "prod-1",
        nombre: "Test",
        slug: "test",
        descripcion: "Test",
        categoria_id: "cat-1",
        precio_desde: 1000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 día",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      trackWhatsAppClick(producto);

      assert.equal(gtagCalls.length, 0);
    });

    it("uses precio_desde when no variation provided", () => {
      const producto: Producto = {
        id: "prod-1",
        nombre: "Test",
        slug: "test",
        descripcion: "Test",
        categoria_id: "cat-1",
        precio_desde: 12000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 día",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      trackWhatsAppClick(producto);

      assert.equal(gtagCalls.length, 1);
      assert.equal(gtagCalls[0].params.value, 12000);
    });
  });

  describe("trackProductView", () => {
    it("tracks product detail page view", () => {
      const producto: Producto = {
        id: "prod-2",
        nombre: "Servilleta Artesanal",
        slug: "servilleta-artesanal",
        descripcion: "Servilleta hecha a mano",
        categoria_id: "cat-2",
        precio_desde: 5000,
        destacado: true,
        activo: true,
        tiempo_fabricacion: "2-3 días",
        material: "Lino",
        cuidados: "Lavar en frío",
        created_at: "2024-01-01T00:00:00Z",
      };

      trackProductView(producto);

      assert.equal(gtagCalls.length, 1);
      const call = gtagCalls[0];
      assert.equal(call.command, "event");
      assert.equal(call.params.producto_id, "prod-2");
      assert.equal(call.params.producto_nombre, "Servilleta Artesanal");
      assert.equal(call.params.categoria_id, "cat-2");
      assert.equal(call.params.precio_desde, 5000);
    });

    it("handles product without precio_desde", () => {
      const producto: Producto = {
        id: "prod-3",
        nombre: "Test Product",
        slug: "test-product",
        descripcion: "Test",
        categoria_id: null,
        precio_desde: null,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 semana",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      trackProductView(producto);

      assert.equal(gtagCalls.length, 1);
      assert.equal(gtagCalls[0].params.value, 0);
    });
  });

  describe("trackCategoryFilter", () => {
    it("tracks category filter selection", () => {
      trackCategoryFilter("manteles", "Manteles");

      assert.equal(gtagCalls.length, 1);
      const call = gtagCalls[0];
      assert.equal(call.command, "event");
      assert.equal(call.params.event_label, "Manteles");
      assert.equal(call.params.filter_type, "category");
      assert.equal(call.params.filter_value, "manteles");
    });

    it("tracks multiple filter selections independently", () => {
      trackCategoryFilter("manteles", "Manteles");
      trackCategoryFilter("servilletas", "Servilletas");

      assert.equal(gtagCalls.length, 2);
      assert.equal(gtagCalls[0].params.filter_value, "manteles");
      assert.equal(gtagCalls[1].params.filter_value, "servilletas");
    });
  });

  describe("trackVariationSelect", () => {
    it("tracks variation selection with full details", () => {
      const producto: Producto = {
        id: "prod-1",
        nombre: "Mantel Floral",
        slug: "mantel-floral",
        descripcion: "Mantel artesanal",
        categoria_id: "cat-1",
        precio_desde: 15000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "3-5 días",
        material: "Algodón",
        cuidados: "Lavar a mano",
        created_at: "2024-01-01T00:00:00Z",
      };

      const variacion: Variacion = {
        id: "var-1",
        producto_id: "prod-1",
        tamanio: "180x250cm",
        color: "Azul",
        precio: 18500,
        stock: 3,
        sku: "MF-180-A",
        activo: true,
      };

      trackVariationSelect(producto, variacion);

      assert.equal(gtagCalls.length, 1);
      const call = gtagCalls[0];
      assert.equal(call.command, "event");
      assert.equal(call.params.producto_id, "prod-1");
      assert.equal(call.params.variacion_id, "var-1");
      assert.equal(call.params.variacion_tamanio, "180x250cm");
      assert.equal(call.params.variacion_color, "Azul");
      assert.equal(call.params.variacion_precio, 18500);
      assert.equal(call.params.value, 18500);
    });

    it("includes formatted label with product and variation info", () => {
      const producto: Producto = {
        id: "prod-1",
        nombre: "Camino de Mesa",
        slug: "camino-mesa",
        descripcion: "Test",
        categoria_id: "cat-1",
        precio_desde: 8000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 semana",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      const variacion: Variacion = {
        id: "var-2",
        producto_id: "prod-1",
        tamanio: "40x150cm",
        color: "Verde",
        precio: 8500,
        stock: 2,
        sku: "CM-40-V",
        activo: true,
      };

      trackVariationSelect(producto, variacion);

      const call = gtagCalls[0];
      assert.equal(
        call.params.event_label,
        "Camino de Mesa - 40x150cm Verde"
      );
    });
  });

  describe("canTrack checks", () => {
    it("does not track when gtag is not defined", () => {
      delete (global as any).window.gtag;

      const producto: Producto = {
        id: "prod-1",
        nombre: "Test",
        slug: "test",
        descripcion: "Test",
        categoria_id: null,
        precio_desde: 1000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 día",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      trackProductView(producto);

      assert.equal(gtagCalls.length, 0);
    });

    it("does not track in non-production environment", () => {
      process.env.NODE_ENV = "test";

      const producto: Producto = {
        id: "prod-1",
        nombre: "Test",
        slug: "test",
        descripcion: "Test",
        categoria_id: null,
        precio_desde: 1000,
        destacado: false,
        activo: true,
        tiempo_fabricacion: "1 día",
        material: null,
        cuidados: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      trackProductView(producto);

      assert.equal(gtagCalls.length, 0);
    });
  });
});
