# Testing Guide - fira Estudio

Esta guía documenta la estrategia de testing del proyecto, convenciones, patrones y mejores prácticas.

## 📋 Tabla de Contenidos

- [Estrategia de Testing](#-estrategia-de-testing)
- [Node:test - Testing de Lógica Pura](#-nodetest---testing-de-lógica-pura)
- [Vitest - Testing de Componentes React](#-vitest---testing-de-componentes-react)
- [Convenciones y Mejores Prácticas](#-convenciones-y-mejores-prácticas)
- [Patrones de Mocking](#-patrones-de-mocking)
- [Ejemplos Comunes](#-ejemplos-comunes)
- [CI/CD Integration](#-cicd-integration)

---

## 🎯 Estrategia de Testing

### ¿Por qué dos herramientas de testing?

**fira Estudio** utiliza una estrategia **dual de testing** optimizada para diferentes tipos de código:

| Herramienta   | Para qué                            | Por qué                                                                                                       |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **node:test** | Lógica pura (utils, SEO, analytics) | ✅ Built-in en Node.js 20+<br>✅ Cero configuración<br>✅ Ultra rápido<br>✅ Sin dependencias externas        |
| **Vitest**    | Componentes React                   | ✅ Soporte nativo de JSX/TSX<br>✅ jsdom incluido<br>✅ Compatible con Testing Library<br>✅ HMR y watch mode |

### Principios Fundamentales

1. **Tests simples y claros** - Cada test debe probar una única cosa
2. **AAA Pattern** - Arrange, Act, Assert en todos los tests
3. **Nombres descriptivos** - El nombre del test debe describir qué y por qué
4. **Mocking estratégico** - Solo mockear dependencias externas o costosas
5. **Coverage inteligente** - >70% en lógica crítica, no perseguir 100%

---

## 🟢 Node:test - Testing de Lógica Pura

### Cuándo usar node:test

Usa **node:test** para:

- ✅ Funciones utilitarias (`formatPrice`, `slugify`, `truncateText`)
- ✅ Generadores de datos (schemas SEO, structured data)
- ✅ Lógica de negocio pura (cálculos, transformaciones)
- ✅ Funciones que no dependen de React, DOM o APIs del navegador

❌ **NO uses node:test** para:

- Componentes React (usa Vitest)
- Tests que necesiten `jsdom` o APIs del navegador
- Tests que requieran JSX/TSX

### Estructura Básica

```typescript
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { myFunction } from "./myModule";

describe("myFunction", () => {
  it("should do something specific", () => {
    // Arrange - preparar datos
    const input = "test data";

    // Act - ejecutar función
    const result = myFunction(input);

    // Assert - verificar resultado
    assert.equal(result, "expected output");
  });
});
```

### Assertions Disponibles

```typescript
// Igualdad estricta
assert.equal(actual, expected);
assert.notEqual(actual, unexpected);

// Deep equality (objetos/arrays)
assert.deepEqual(actual, expected);
assert.notDeepEqual(actual, unexpected);

// Truthiness
assert.ok(value); // truthy
assert.ok(!value); // falsy

// Excepciones
assert.throws(() => throwingFunction());
assert.doesNotThrow(() => safeFunction());

// Comparaciones
assert.ok(value > 5);
assert.ok(array.length === 3);
```

### Ejemplo Real: Test de Utility

```typescript
// lib/utils/index.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { slugify, truncateText, isDefined } from "./index";

describe("slugify", () => {
  it("converts text to lowercase", () => {
    assert.equal(slugify("UPPERCASE"), "uppercase");
  });

  it("removes accents from characters", () => {
    assert.equal(slugify("Café con Leché"), "cafe-con-leche");
  });

  it("replaces special characters with hyphens", () => {
    assert.equal(slugify("hello@world"), "hello-world");
  });

  it("creates URL-safe slugs from product names", () => {
    assert.equal(slugify("Mantel Floral 150x200"), "mantel-floral-150x200");
  });
});

describe("truncateText", () => {
  it("returns original text when below maxLength", () => {
    assert.equal(truncateText("Short", 10), "Short");
  });

  it("truncates text and adds ellipsis when exceeding", () => {
    assert.equal(truncateText("This is a long text", 10), "This is...");
  });
});

describe("isDefined", () => {
  it("returns false for null and undefined", () => {
    assert.equal(isDefined(null), false);
    assert.equal(isDefined(undefined), false);
  });

  it("returns true for defined values", () => {
    assert.equal(isDefined(0), true);
    assert.equal(isDefined(""), true);
    assert.equal(isDefined(false), true);
  });
});
```

### Ejemplo Real: Test de Schema SEO

```typescript
// lib/seo/structured-data.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateProductSchema } from "./structured-data";

describe("generateProductSchema", () => {
  it("generates valid Product schema with complete data", () => {
    const producto = {
      id: "prod-1",
      nombre: "Mantel Floral",
      descripcion: "Mantel artesanal",
      precio_desde: 15000,
      // ... más propiedades
    };

    const schema = generateProductSchema(producto);

    // Verificar estructura Schema.org
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.name, "Mantel Floral");

    // Verificar ofertas
    assert.ok(schema.offers);
    assert.equal(schema.offers["@type"], "AggregateOffer");
    assert.equal(schema.offers.priceCurrency, "ARS");
  });

  it("generates PreOrder availability when stock is zero", () => {
    const producto = {
      /* ... */
    };
    const schema = generateProductSchema(producto);

    assert.equal(schema.offers.availability, "https://schema.org/PreOrder");
  });
});
```

### Mocking en node:test

```typescript
import { beforeEach, afterEach, mock } from "node:test";

describe("function with dependencies", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Guardar original
    originalFetch = global.fetch;

    // Mockear
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => ({ data: "mocked" }),
    })) as any;
  });

  afterEach(() => {
    // Restaurar
    global.fetch = originalFetch;
  });

  it("should call fetch", async () => {
    await myFunctionThatUsesFetch();
    assert.equal(mock.calls(global.fetch).length, 1);
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests de node:test
npm run test:node

# Un archivo específico
node --test --import tsx lib/utils/index.test.ts

# Con coverage (usando c8 - instalación adicional requerida)
npx c8 npm run test:node
```

---

## ⚡ Vitest - Testing de Componentes React

### Cuándo usar Vitest

Usa **Vitest** para:

- ✅ Componentes React (ProductCard, CategoryFilter, etc.)
- ✅ Tests que necesiten `jsdom` (manipulación DOM)
- ✅ Tests con Testing Library
- ✅ Hooks personalizados
- ✅ Tests que requieran navegador APIs (localStorage, window, etc.)

### Configuración

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["components/**/*.test.tsx", "app/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
});
```

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom";
```

### Estructura Básica

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Testing Library - Query Methods

```typescript
// Preferir getBy* para elementos que DEBEN existir
screen.getByText("Submit"); // Falla si no existe
screen.getByRole("button"); // Más semántico
screen.getByLabelText("Email"); // Para forms

// Usar queryBy* para elementos que PUEDEN no existir
screen.queryByText("Optional"); // Retorna null si no existe

// Usar findBy* para elementos asíncronos
await screen.findByText("Loaded"); // Espera hasta que aparezca
```

### Ejemplo Real: Test de ProductCard

```typescript
// components/productos/ProductCard.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  const mockProducto = {
    id: "prod-1",
    nombre: "Mantel Floral",
    slug: "mantel-floral",
    precio_desde: 15000,
    destacado: false,
    // ... más propiedades
  };

  it("renders product information correctly", () => {
    render(<ProductCard producto={mockProducto} />);

    expect(screen.getByText("Mantel Floral")).toBeInTheDocument();
    expect(screen.getByText(/Desde \$/)).toBeInTheDocument();
  });

  it("renders image with correct alt text", () => {
    render(<ProductCard producto={mockProducto} />);

    const image = screen.getByAltText(/Mantel Floral/);
    expect(image).toBeInTheDocument();
  });

  it("renders link to product detail page", () => {
    render(<ProductCard producto={mockProducto} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/productos/mantel-floral");
  });

  it("renders destacado badge when producto.destacado is true", () => {
    const destacado = { ...mockProducto, destacado: true };
    render(<ProductCard producto={destacado} />);

    expect(screen.getByText("Destacado")).toBeInTheDocument();
  });

  it("does not render destacado badge when false", () => {
    render(<ProductCard producto={mockProducto} />);

    expect(screen.queryByText("Destacado")).not.toBeInTheDocument();
  });
});
```

### Ejemplo Real: Test con Mocks (CategoryFilter)

```typescript
// components/productos/CategoryFilter.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { CategoryFilter } from "./CategoryFilter";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock analytics
vi.mock("@/lib/analytics/gtag", () => ({
  trackCategoryFilter: vi.fn(),
}));

describe("CategoryFilter", () => {
  const mockCategorias = [
    { id: "1", nombre: "Manteles", slug: "manteles" },
    { id: "2", nombre: "Servilletas", slug: "servilletas" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all categories", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    expect(screen.getByText("Manteles")).toBeInTheDocument();
    expect(screen.getByText("Servilletas")).toBeInTheDocument();
  });

  it("marks active category correctly", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("manteles"),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const mantelesBtn = screen.getByText("Manteles");
    expect(mantelesBtn).toHaveClass("bg-foreground");
  });
});
```

### Testing Async Server Components

```typescript
// components/productos/RelatedProducts.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedProducts } from "./RelatedProducts";
import * as queries from "@/lib/supabase/queries";

// Mock del módulo de queries
vi.mock("@/lib/supabase/queries", () => ({
  getProductosRelacionados: vi.fn(),
}));

describe("RelatedProducts", () => {
  it("renders related products correctly", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue([
      { id: "1", nombre: "Producto A", slug: "producto-a" /* ... */ },
      { id: "2", nombre: "Producto B", slug: "producto-b" /* ... */ },
    ]);

    // Server Component: render con await
    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      }),
    );

    expect(screen.getByText("Productos Relacionados")).toBeInTheDocument();
    expect(screen.getByText("Producto A")).toBeInTheDocument();
  });

  it("returns null when no category provided", async () => {
    const result = await RelatedProducts({
      productoId: "prod-1",
      categoriaId: null,
    });

    expect(result).toBeNull();
  });
});
```

### Matchers de jest-dom

```typescript
// Presencia en DOM
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeEmptyDOMElement();

// Atributos
expect(element).toHaveAttribute("href", "/productos");
expect(element).toHaveClass("bg-foreground");
expect(element).toHaveStyle({ color: "red" });

// Texto
expect(element).toHaveTextContent("Hello");
expect(input).toHaveValue("test@example.com");

// Accesibilidad
expect(button).toBeDisabled();
expect(checkbox).toBeChecked();
expect(element).toHaveFocus();
```

### Ejecutar Tests

```bash
# Todos los tests de Vitest
npm run test:unit

# Modo watch (desarrollo)
npm run test:watch

# Con coverage
npm run test:coverage

# UI interactiva
npx vitest --ui
```

---

## 📏 Convenciones y Mejores Prácticas

### Nombres de Tests

✅ **BIEN** - Descriptivos y en español:

```typescript
it("convierte texto a minúsculas", () => {});
it("renderiza badge destacado cuando producto.destacado es true", () => {});
it("retorna null cuando no hay categoría", () => {});
```

❌ **MAL** - Vagos o en inglés mezclado:

```typescript
it("works", () => {});
it("test slugify", () => {});
it("should test the component", () => {});
```

### Organización de Tests

```typescript
describe("ComponentName", () => {
  // Setup común
  const mockData = {
    /* ... */
  };

  // Tests agrupados por feature
  describe("rendering", () => {
    it("renders basic information", () => {});
    it("renders with custom props", () => {});
  });

  describe("interactions", () => {
    it("handles click events", () => {});
    it("updates on input change", () => {});
  });

  describe("edge cases", () => {
    it("handles empty data", () => {});
    it("handles null values", () => {});
  });
});
```

### AAA Pattern (Arrange-Act-Assert)

```typescript
it("calculates discount correctly", () => {
  // Arrange - Preparar datos y estado
  const originalPrice = 15000;
  const discountPercent = 20;

  // Act - Ejecutar la acción a testear
  const finalPrice = calculateDiscount(originalPrice, discountPercent);

  // Assert - Verificar resultado
  expect(finalPrice).toBe(12000);
});
```

### Coverage Goals

| Tipo de Código | Coverage Mínimo | Razón                 |
| -------------- | --------------- | --------------------- |
| Utils críticos | 90%+            | Usados en toda la app |
| SEO/Analytics  | 80%+            | Impacto en negocio    |
| Components UI  | 70%+            | Cambios frecuentes    |
| Types/Config   | 0%              | No ejecutables        |

---

## 🎭 Patrones de Mocking

### Mock de Módulos Completos

```typescript
// Mockear todo el módulo
vi.mock("@/lib/analytics/gtag", () => ({
  trackWhatsAppClick: vi.fn(),
  trackProductView: vi.fn(),
}));

// Usar en test
import * as gtag from "@/lib/analytics/gtag";

it("tracks analytics", () => {
  myFunction();
  expect(gtag.trackWhatsAppClick).toHaveBeenCalledWith(/* ... */);
});
```

### Mock de Next.js Hooks

```typescript
// useSearchParams
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// En test
vi.mocked(useSearchParams).mockReturnValue({
  get: vi.fn().mockReturnValue("manteles"),
} as any);

// useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mocked(useRouter).mockReturnValue({
  push: vi.fn(),
  refresh: vi.fn(),
} as any);
```

### Mock de window.gtag

```typescript
// node:test
let gtagCalls = [];
beforeEach(() => {
  gtagCalls = [];
  (global as any).window = {
    gtag: (cmd, name, params) => {
      gtagCalls.push({ cmd, name, params });
    },
  };
  process.env.NODE_ENV = "production";
});

afterEach(() => {
  delete (global as any).window;
});
```

### Mock de Supabase Queries

```typescript
vi.mock("@/lib/supabase/queries", () => ({
  getProductos: vi.fn(),
  getProductoBySlug: vi.fn(),
}));

// En test
vi.mocked(queries.getProductos).mockResolvedValue([
  { id: "1", nombre: "Producto A" },
]);
```

---

## 💡 Ejemplos Comunes

### Test de Formateo de Precios

```typescript
describe("formatPrice", () => {
  it("formats Chilean pesos correctly", () => {
    expect(formatPrice(15000)).toMatch(/\$ 15\.000/);
  });

  it("returns fallback for null", () => {
    expect(formatPrice(null)).toBe("Consultar precio");
  });
});
```

### Test de Componente con Link

```typescript
it("renders link with correct href", () => {
  render(<ProductCard producto={mock} />);

  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/productos/mantel-floral");
});
```

### Test de Condicional Rendering

```typescript
it("shows badge when destacado is true", () => {
  render(<ProductCard producto={{ ...mock, destacado: true }} />);
  expect(screen.getByText("Destacado")).toBeInTheDocument();
});

it("hides badge when destacado is false", () => {
  render(<ProductCard producto={{ ...mock, destacado: false }} />);
  expect(screen.queryByText("Destacado")).not.toBeInTheDocument();
});
```

### Test de Schema JSON-LD

```typescript
it("renders JSON-LD script", () => {
  const { container } = render(<Breadcrumbs items={[...]} />);

  const script = container.querySelector('script[type="application/ld+json"]');
  const jsonLd = JSON.parse(script?.textContent || "{}");

  expect(jsonLd["@type"]).toBe("BreadcrumbList");
  expect(jsonLd.itemListElement).toHaveLength(2);
});
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run node:test tests
        run: npm run test:node

      - name: Run Vitest tests
        run: npm run test:unit

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm test
```

---

## 📚 Referencias

- **Node.js Test Runner:** https://nodejs.org/api/test.html
- **Vitest:** https://vitest.dev/
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **jest-dom Matchers:** https://github.com/testing-library/jest-dom

---

## ✅ Checklist para Nuevos Tests

- [ ] Test tiene nombre descriptivo en español
- [ ] Sigue el patrón AAA (Arrange-Act-Assert)
- [ ] Usa la herramienta correcta (node:test vs Vitest)
- [ ] Mockea solo dependencias externas/costosas
- [ ] Verifica tanto casos felices como edge cases
- [ ] No tiene lógica compleja (if/loops)
- [ ] Es independiente (no depende de orden)
- [ ] Pasa consistentemente
