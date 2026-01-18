import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedProducts } from "./RelatedProducts";
import * as queries from "@/lib/supabase/queries";
import type { ProductoCompleto } from "@/lib/types";

// Mock the queries module
vi.mock("@/lib/supabase/queries", () => ({
  getProductosRelacionados: vi.fn(),
}));

describe("RelatedProducts", () => {
  const mockRelatedProducts: ProductoCompleto[] = [
    {
      id: "prod-2",
      nombre: "Mantel Verano",
      slug: "mantel-verano",
      descripcion: "Mantel fresco",
      categoria_id: "cat-1",
      precio_desde: 12000,
      destacado: false,
      activo: true,
      tiempo_fabricacion: "3 días",
      material: "Algodón",
      cuidados: "Lavar a mano",
      created_at: "2024-01-02T00:00:00Z",
      variaciones: [],
      imagenes: [
        {
          id: "img-2",
          producto_id: "prod-2",
          url: "/images/productos/mantel-verano.jpg",
          alt_text: "Mantel Verano",
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
    },
    {
      id: "prod-3",
      nombre: "Mantel Otoño",
      slug: "mantel-otono",
      descripcion: "Mantel cálido",
      categoria_id: "cat-1",
      precio_desde: 14000,
      destacado: false,
      activo: true,
      tiempo_fabricacion: "4 días",
      material: "Lino",
      cuidados: "Lavar en frío",
      created_at: "2024-01-03T00:00:00Z",
      variaciones: [],
      imagenes: [
        {
          id: "img-3",
          producto_id: "prod-3",
          url: "/images/productos/mantel-otono.jpg",
          alt_text: "Mantel Otoño",
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
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders related products correctly", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
        limite: 4,
      })
    );

    expect(screen.getByText("Productos Relacionados")).toBeInTheDocument();
    expect(screen.getByText("Mantel Verano")).toBeInTheDocument();
    expect(screen.getByText("Mantel Otoño")).toBeInTheDocument();
  });

  it("renders product images with correct alt text", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("alt", "Mantel Verano");
    expect(images[1]).toHaveAttribute("alt", "Mantel Otoño");
  });

  it("renders product links with correct href", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    const veranoLink = screen.getByText("Mantel Verano").closest("a");
    expect(veranoLink).toHaveAttribute("href", "/productos/mantel-verano");

    const otonoLink = screen.getByText("Mantel Otoño").closest("a");
    expect(otonoLink).toHaveAttribute("href", "/productos/mantel-otono");
  });

  it("renders prices formatted correctly", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    expect(screen.getByText(/Desde \$ 12\.000/)).toBeInTheDocument();
    expect(screen.getByText(/Desde \$ 14\.000/)).toBeInTheDocument();
  });

  it("returns null when no category is provided", async () => {
    const result = await RelatedProducts({
      productoId: "prod-1",
      categoriaId: null,
    });

    expect(result).toBeNull();
  });

  it("returns null when related products list is empty", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue([]);

    const result = await RelatedProducts({
      productoId: "prod-1",
      categoriaId: "cat-1",
    });

    expect(result).toBeNull();
  });

  it("respects the limite parameter", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    await RelatedProducts({
      productoId: "prod-1",
      categoriaId: "cat-1",
      limite: 2,
    });

    expect(queries.getProductosRelacionados).toHaveBeenCalledWith(
      "prod-1",
      "cat-1",
      2
    );
  });

  it("uses default limite of 4 when not provided", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    await RelatedProducts({
      productoId: "prod-1",
      categoriaId: "cat-1",
    });

    expect(queries.getProductosRelacionados).toHaveBeenCalledWith(
      "prod-1",
      "cat-1",
      4
    );
  });

  it("renders fallback when product has no images", async () => {
    const productsWithoutImages: ProductoCompleto[] = [
      {
        ...mockRelatedProducts[0],
        imagenes: [],
      },
    ];

    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      productsWithoutImages
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  });

  it("uses non-principal image when principal is not available", async () => {
    const productsWithNonPrincipal: ProductoCompleto[] = [
      {
        ...mockRelatedProducts[0],
        imagenes: [
          {
            id: "img-2",
            producto_id: "prod-2",
            url: "/images/productos/secondary.jpg",
            alt_text: "Secondary Image",
            orden: 1,
            es_principal: false,
          },
        ],
      },
    ];

    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      productsWithNonPrincipal
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Secondary Image");
  });

  it("renders with correct grid layout classes", async () => {
    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      mockRelatedProducts
    );

    const { container } = render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-4");
  });

  it("does not render price when precio_desde is null", async () => {
    const productsWithoutPrice: ProductoCompleto[] = [
      {
        ...mockRelatedProducts[0],
        precio_desde: null,
      },
    ];

    vi.mocked(queries.getProductosRelacionados).mockResolvedValue(
      productsWithoutPrice
    );

    render(
      await RelatedProducts({
        productoId: "prod-1",
        categoriaId: "cat-1",
      })
    );

    expect(screen.queryByText(/Desde \$/)).not.toBeInTheDocument();
  });
});
