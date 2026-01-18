import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "./useProductFilters";
import type { ProductoCompleto } from "@/lib/types";

// Mock Next.js navigation hooks
const mockReplace = vi.fn();
const mockSearchParams = new Map<string, string[]>();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    getAll: (key: string) => mockSearchParams.get(key) || [],
    get: (key: string) => {
      const values = mockSearchParams.get(key);
      return values && values.length > 0 ? values[0] : null;
    },
  }),
}));

describe("useProductFilters", () => {
  // Mock product data
  const mockProductos: ProductoCompleto[] = [
    {
      id: "1",
      nombre: "Mantel Grande",
      slug: "mantel-grande",
      descripcion: "Mantel grande",
      precio_desde: 15000,
      categoria: { id: "manteles", nombre: "Manteles", descripcion: "", activo: true },
      activo: true,
      variaciones: [],
      imagenes: [],
    },
    {
      id: "2",
      nombre: "Mantel Pequeño",
      slug: "mantel-pequeno",
      descripcion: "Mantel pequeño",
      precio_desde: 8000,
      categoria: { id: "manteles", nombre: "Manteles", descripcion: "", activo: true },
      activo: true,
      variaciones: [],
      imagenes: [],
    },
    {
      id: "3",
      nombre: "Servilleta",
      slug: "servilleta",
      descripcion: "Servilleta",
      precio_desde: 3000,
      categoria: { id: "servilletas", nombre: "Servilletas", descripcion: "", activo: true },
      activo: true,
      variaciones: [],
      imagenes: [],
    },
    {
      id: "4",
      nombre: "Camino de Mesa",
      slug: "camino-mesa",
      descripcion: "Camino de mesa",
      precio_desde: 12000,
      categoria: { id: "caminos", nombre: "Caminos de Mesa", descripcion: "", activo: true },
      activo: true,
      variaciones: [],
      imagenes: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.clear();
  });

  it("initializes with empty filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    expect(result.current.filters.categorias).toEqual([]);
    expect(result.current.filters.precioMin).toBeUndefined();
    expect(result.current.filters.precioMax).toBeUndefined();
  });

  it("returns all products when no filters applied", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    expect(result.current.filteredProducts).toHaveLength(4);
    expect(result.current.filteredProducts).toEqual(mockProductos);
  });

  it("filters products by single category", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ categorias: ["manteles"] });
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts[0].nombre).toBe("Mantel Grande");
    expect(result.current.filteredProducts[1].nombre).toBe("Mantel Pequeño");
  });

  it("filters products by multiple categories", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ categorias: ["manteles", "servilletas"] });
    });

    expect(result.current.filteredProducts).toHaveLength(3);
    const names = result.current.filteredProducts.map((p) => p.nombre);
    expect(names).toContain("Mantel Grande");
    expect(names).toContain("Mantel Pequeño");
    expect(names).toContain("Servilleta");
  });

  it("filters products by minimum price", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ precioMin: 10000 });
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    const names = result.current.filteredProducts.map((p) => p.nombre);
    expect(names).toContain("Mantel Grande");
    expect(names).toContain("Camino de Mesa");
  });

  it("filters products by maximum price", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ precioMax: 10000 });
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    const names = result.current.filteredProducts.map((p) => p.nombre);
    expect(names).toContain("Mantel Pequeño");
    expect(names).toContain("Servilleta");
  });

  it("filters products by price range", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ precioMin: 5000, precioMax: 13000 });
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    const names = result.current.filteredProducts.map((p) => p.nombre);
    expect(names).toContain("Mantel Pequeño");
    expect(names).toContain("Camino de Mesa");
  });

  it("combines category and price filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({
        categorias: ["manteles"],
        precioMin: 10000,
      });
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].nombre).toBe("Mantel Grande");
  });

  it("returns empty array when no products match filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({
        categorias: ["manteles"],
        precioMin: 20000,
      });
    });

    expect(result.current.filteredProducts).toHaveLength(0);
  });

  it("clears all filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    // Apply filters
    act(() => {
      result.current.updateFilters({
        categorias: ["manteles"],
        precioMin: 10000,
        precioMax: 20000,
      });
    });

    expect(result.current.filteredProducts).toHaveLength(1);

    // Clear filters
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.categorias).toEqual([]);
    expect(result.current.filters.precioMin).toBeUndefined();
    expect(result.current.filters.precioMax).toBeUndefined();
    expect(result.current.filteredProducts).toHaveLength(4);
  });

  it("updates URL when filters change", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ categorias: ["manteles"] });
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("categoria=manteles")
    );
  });

  it("updates URL with multiple categories", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ categorias: ["manteles", "servilletas"] });
    });

    // Should be called with both categories as separate params
    const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0];
    expect(lastCall).toContain("categoria=manteles");
    expect(lastCall).toContain("categoria=servilletas");
  });

  it("updates URL with price filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ precioMin: 5000, precioMax: 15000 });
    });

    const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0];
    expect(lastCall).toContain("precioMin=5000");
    expect(lastCall).toContain("precioMax=15000");
  });

  it("initializes filters from URL search params", () => {
    mockSearchParams.set("categoria", ["manteles"]);
    mockSearchParams.set("precioMin", ["8000"]);
    mockSearchParams.set("precioMax", ["15000"]);

    const { result } = renderHook(() => useProductFilters(mockProductos));

    expect(result.current.filters.categorias).toEqual(["manteles"]);
    expect(result.current.filters.precioMin).toBe(8000);
    expect(result.current.filters.precioMax).toBe(15000);

    // Should filter based on initial params
    expect(result.current.filteredProducts).toHaveLength(2);
  });

  it("handles products without categories", () => {
    const productoSinCategoria: ProductoCompleto = {
      id: "5",
      nombre: "Sin Categoría",
      slug: "sin-categoria",
      descripcion: "Producto sin categoría",
      precio_desde: 5000,
      categoria: null,
      activo: true,
      variaciones: [],
      imagenes: [],
    };

    const { result } = renderHook(() =>
      useProductFilters([...mockProductos, productoSinCategoria])
    );

    act(() => {
      result.current.updateFilters({ categorias: ["manteles"] });
    });

    // Product without category should not match
    expect(result.current.filteredProducts).toHaveLength(2);
    expect(
      result.current.filteredProducts.find((p) => p.id === "5")
    ).toBeUndefined();
  });

  it("handles products with precio_desde as null", () => {
    const productoSinPrecio: ProductoCompleto = {
      id: "6",
      nombre: "Sin Precio",
      slug: "sin-precio",
      descripcion: "Producto sin precio",
      precio_desde: null,
      categoria: { id: "otros", nombre: "Otros", descripcion: "", activo: true },
      activo: true,
      variaciones: [],
      imagenes: [],
    };

    const { result } = renderHook(() =>
      useProductFilters([...mockProductos, productoSinPrecio])
    );

    act(() => {
      result.current.updateFilters({ precioMin: 1000 });
    });

    // Product with null price (treated as 0) should not match precioMin > 0
    expect(
      result.current.filteredProducts.find((p) => p.id === "6")
    ).toBeUndefined();
  });

  it("can update filters multiple times", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    // First update
    act(() => {
      result.current.updateFilters({ categorias: ["manteles"] });
    });
    expect(result.current.filteredProducts).toHaveLength(2);

    // Second update
    act(() => {
      result.current.updateFilters({ precioMin: 10000 });
    });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filters.categorias).toEqual(["manteles"]);
    expect(result.current.filters.precioMin).toBe(10000);

    // Third update - change category
    act(() => {
      result.current.updateFilters({ categorias: ["servilletas"] });
    });
    expect(result.current.filteredProducts).toHaveLength(0); // No servilletas >= 10000
  });

  it("handles edge case of exact price match", () => {
    const { result } = renderHook(() => useProductFilters(mockProductos));

    act(() => {
      result.current.updateFilters({ precioMin: 8000, precioMax: 8000 });
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].nombre).toBe("Mantel Pequeño");
  });
});
