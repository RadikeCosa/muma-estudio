import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { CategoryFilter } from "./CategoryFilter";
import type { Categoria } from "@/lib/types";
import * as gtag from "@/lib/analytics/gtag";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock analytics
vi.mock("@/lib/analytics/gtag", () => ({
  trackCategoryFilter: vi.fn(),
}));

describe("CategoryFilter", () => {
  const mockCategorias: Categoria[] = [
    {
      id: "cat-1",
      nombre: "Manteles",
      slug: "manteles",
      descripcion: "Manteles artesanales",
      orden: 1,
    },
    {
      id: "cat-2",
      nombre: "Servilletas",
      slug: "servilletas",
      descripcion: "Servilletas decorativas",
      orden: 2,
    },
    {
      id: "cat-3",
      nombre: "Caminos de Mesa",
      slug: "caminos-mesa",
      descripcion: "Caminos elegantes",
      orden: 3,
    },
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
    expect(screen.getByText("Caminos de Mesa")).toBeInTheDocument();
  });

  it("renders 'Todos' button", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    expect(screen.getByText("Todos")).toBeInTheDocument();
  });

  it("marks 'Todos' as active when no category is selected", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const todosButton = screen.getByText("Todos");
    expect(todosButton).toHaveClass("bg-foreground");
    expect(todosButton).toHaveClass("text-background");
  });

  it("marks category as active when selected", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("manteles"),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const mantelesButton = screen.getByText("Manteles");
    expect(mantelesButton).toHaveClass("bg-foreground");
    expect(mantelesButton).toHaveClass("text-background");
  });

  it("renders correct links for each category", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const mantelesLink = screen.getByText("Manteles").closest("a");
    expect(mantelesLink).toHaveAttribute(
      "href",
      "/productos?categoria=manteles"
    );

    const servilletasLink = screen.getByText("Servilletas").closest("a");
    expect(servilletasLink).toHaveAttribute(
      "href",
      "/productos?categoria=servilletas"
    );
  });

  it("renders 'Todos' link to /productos", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const todosLink = screen.getByText("Todos").closest("a");
    expect(todosLink).toHaveAttribute("href", "/productos");
  });

  it("handles empty categories array", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<CategoryFilter categorias={[]} />);

    // Should still render "Todos" button
    expect(screen.getByText("Todos")).toBeInTheDocument();
  });

  it("marks only one category as active at a time", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("servilletas"),
    } as any);

    render(<CategoryFilter categorias={mockCategorias} />);

    const mantelesButton = screen.getByText("Manteles");
    const servilletasButton = screen.getByText("Servilletas");

    // Servilletas should be active
    expect(servilletasButton).toHaveClass("bg-foreground");

    // Manteles should NOT be active
    expect(mantelesButton).not.toHaveClass("bg-foreground");
    expect(mantelesButton).toHaveClass("bg-muted");
  });

  it("has horizontal scrollable layout", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    const { container } = render(<CategoryFilter categorias={mockCategorias} />);

    const scrollContainer = container.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBeInTheDocument();
  });
});
