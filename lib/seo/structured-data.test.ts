import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from "./structured-data";
import type { ProductoCompleto } from "@/lib/types";

describe("generateProductSchema", () => {
  it("generates valid Product schema with complete data", () => {
    const producto: ProductoCompleto = {
      id: "prod-1",
      nombre: "Mantel Floral",
      slug: "mantel-floral",
      descripcion: "Mantel artesanal con diseño floral",
      categoria_id: "cat-1",
      precio_desde: 15000,
      destacado: false,
      activo: true,
      tiempo_fabricacion: "3-5 días",
      material: "Algodón 100%",
      cuidados: "Lavar a mano",
      created_at: "2024-01-01T00:00:00Z",
      variaciones: [
        {
          id: "var-1",
          producto_id: "prod-1",
          tamanio: "150x200cm",
          color: "Rojo",
          precio: 15000,
          stock: 5,
          sku: "MF-150-R",
          activo: true,
        },
        {
          id: "var-2",
          producto_id: "prod-1",
          tamanio: "180x250cm",
          color: "Azul",
          precio: 18500,
          stock: 3,
          sku: "MF-180-A",
          activo: true,
        },
      ],
      imagenes: [
        {
          id: "img-1",
          producto_id: "prod-1",
          url: "/images/productos/mantel-floral.jpg",
          alt_text: "Mantel Floral Rojo",
          orden: 1,
          es_principal: true,
        },
      ],
      categoria: {
        id: "cat-1",
        nombre: "Manteles",
        slug: "manteles",
        descripcion: null,
        orden: 1,
      },
    };

    const schema = generateProductSchema(producto);

    // Verify schema structure
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.name, "Mantel Floral");
    assert.equal(schema.description, "Mantel artesanal con diseño floral");
    assert.equal(schema.material, "Algodón 100%");

    // Verify brand
    assert.equal(schema.brand["@type"], "Brand");
    assert.equal(schema.brand.name, "fira Estudio");

    // Verify image
    assert.ok(schema.image?.includes("/images/productos/mantel-floral.jpg"));

    // Verify offers (AggregateOffer)
    assert.ok(schema.offers);
    assert.equal(schema.offers["@type"], "AggregateOffer");
    assert.equal(schema.offers.priceCurrency, "ARS");
    assert.equal(schema.offers.lowPrice, 15000);
    assert.equal(schema.offers.highPrice, 18500);
    assert.equal(schema.offers.availability, "https://schema.org/InStock");

    // Verify additional properties
    assert.ok(Array.isArray(schema.additionalProperty));
    assert.ok(
      schema.additionalProperty.some(
        (prop: any) => prop.name === "Tiempo de fabricación",
      ),
    );
  });

  it("generates PreOrder availability when stock is zero", () => {
    const producto: ProductoCompleto = {
      id: "prod-2",
      nombre: "Servilleta",
      slug: "servilleta",
      descripcion: "Servilleta básica",
      categoria_id: "cat-2",
      precio_desde: 5000,
      destacado: false,
      activo: true,
      tiempo_fabricacion: "2-3 días",
      material: null,
      cuidados: null,
      created_at: "2024-01-01T00:00:00Z",
      variaciones: [
        {
          id: "var-1",
          producto_id: "prod-2",
          tamanio: "40x40cm",
          color: "Blanco",
          precio: 5000,
          stock: 0, // Stock zero = PreOrder
          sku: "SER-40-B",
          activo: true,
        },
      ],
      imagenes: [],
      categoria: {
        id: "cat-2",
        nombre: "Servilletas",
        slug: "servilletas",
        descripcion: null,
        orden: 2,
      },
    };

    const schema = generateProductSchema(producto);

    assert.equal(schema.offers.availability, "https://schema.org/PreOrder");
  });

  it("handles product with no images", () => {
    const producto: ProductoCompleto = {
      id: "prod-3",
      nombre: "Camino de Mesa",
      slug: "camino-mesa",
      descripcion: "Camino elegante",
      categoria_id: "cat-3",
      precio_desde: 8000,
      destacado: false,
      activo: true,
      tiempo_fabricacion: "1 semana",
      material: null,
      cuidados: null,
      created_at: "2024-01-01T00:00:00Z",
      variaciones: [
        {
          id: "var-1",
          producto_id: "prod-3",
          tamanio: "40x150cm",
          color: "Beige",
          precio: 8000,
          stock: 2,
          sku: "CM-40-B",
          activo: true,
        },
      ],
      imagenes: [],
      categoria: {
        id: "cat-3",
        nombre: "Caminos",
        slug: "caminos",
        descripcion: null,
        orden: 3,
      },
    };

    const schema = generateProductSchema(producto);

    assert.equal(schema.image, undefined);
  });

  it("uses main image when available", () => {
    const producto: ProductoCompleto = {
      id: "prod-4",
      nombre: "Test Product",
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
      variaciones: [
        {
          id: "var-1",
          producto_id: "prod-4",
          tamanio: "S",
          color: "Red",
          precio: 1000,
          stock: 1,
          sku: "TEST",
          activo: true,
        },
      ],
      imagenes: [
        {
          id: "img-1",
          producto_id: "prod-4",
          url: "/images/secondary.jpg",
          alt_text: "Secondary",
          orden: 2,
          es_principal: false,
        },
        {
          id: "img-2",
          producto_id: "prod-4",
          url: "/images/main.jpg",
          alt_text: "Main",
          orden: 1,
          es_principal: true,
        },
      ],
      categoria: {
        id: "cat-1",
        nombre: "Test",
        slug: "test",
        descripcion: null,
        orden: 1,
      },
    };

    const schema = generateProductSchema(producto);

    assert.ok(schema.image?.includes("/images/main.jpg"));
  });
});

describe("generateBreadcrumbSchema", () => {
  it("generates valid BreadcrumbList schema", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
      { name: "Mantel Floral", url: "/productos/mantel-floral" },
    ];

    const schema = generateBreadcrumbSchema(items);

    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "BreadcrumbList");
    assert.ok(Array.isArray(schema.itemListElement));
    assert.equal(schema.itemListElement.length, 3);
  });

  it("sets correct positions for each item", () => {
    const items = [
      { name: "Home", url: "/" },
      { name: "Products", url: "/productos" },
    ];

    const schema = generateBreadcrumbSchema(items);

    assert.equal(schema.itemListElement[0].position, 1);
    assert.equal(schema.itemListElement[1].position, 2);
    assert.equal(schema.itemListElement[0]["@type"], "ListItem");
  });

  it("includes full URLs with SITE_CONFIG.url", () => {
    const items = [{ name: "Test", url: "/test" }];

    const schema = generateBreadcrumbSchema(items);

    assert.ok(schema.itemListElement[0].item.includes("/test"));
    // Should include the site URL as prefix
    assert.ok(schema.itemListElement[0].item.startsWith("http"));
  });

  it("handles empty breadcrumb list", () => {
    const schema = generateBreadcrumbSchema([]);

    assert.equal(schema.itemListElement.length, 0);
  });

  it("handles single breadcrumb item", () => {
    const items = [{ name: "Solo Item", url: "/solo" }];

    const schema = generateBreadcrumbSchema(items);

    assert.equal(schema.itemListElement.length, 1);
    assert.equal(schema.itemListElement[0].name, "Solo Item");
  });
});

describe("generateOrganizationSchema", () => {
  it("generates valid Organization schema", () => {
    const schema = generateOrganizationSchema();

    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "Organization");
    assert.equal(schema.name, "fira Estudio");
    assert.ok(schema.description);
    assert.ok(schema.url);
  });

  it("includes logo URL", () => {
    const schema = generateOrganizationSchema();

    assert.ok(schema.logo);
    assert.ok(schema.logo.includes("/images/logo.png"));
  });

  it("includes social media URLs when available", () => {
    const schema = generateOrganizationSchema();

    assert.ok(Array.isArray(schema.sameAs));
    // sameAs can be empty or have values depending on env vars
  });

  it("filters out undefined social URLs", () => {
    const schema = generateOrganizationSchema();

    // All items in sameAs should be truthy strings
    schema.sameAs.forEach((url: string) => {
      assert.ok(url);
      assert.equal(typeof url, "string");
    });
  });
});
