import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders breadcrumb items correctly", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Manteles")).toBeInTheDocument();
  });

  it("always includes 'Inicio' as the first item", () => {
    const items = [{ name: "Productos", url: "/productos" }];

    render(<Breadcrumbs items={items} />);

    const breadcrumbItems = screen.getAllByRole("listitem");
    expect(breadcrumbItems[0]).toHaveTextContent("Inicio");
  });

  it("renders correct links for each breadcrumb item", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
    ];

    render(<Breadcrumbs items={items} />);

    const inicioLink = screen.getByText("Inicio").closest("a");
    expect(inicioLink).toHaveAttribute("href", "/");

    const productosLink = screen.getByText("Productos").closest("a");
    expect(productosLink).toHaveAttribute("href", "/productos");
  });

  it("renders last item without link (current page)", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Mantel Floral", url: "/productos/mantel-floral" },
    ];

    render(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText("Mantel Floral");
    expect(lastItem).not.toHaveAttribute("href");
    expect(lastItem.tagName).toBe("SPAN");
  });

  it("marks last item with aria-current='page'", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Mantel Floral", url: "/productos/mantel-floral" },
    ];

    render(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText("Mantel Floral");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("renders chevron separators between items", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
    ];

    const { container } = render(<Breadcrumbs items={items} />);

    // Should have chevrons (one less than total items)
    const chevrons = container.querySelectorAll("svg");
    // 3 items (Inicio + 2 custom) = 2 chevrons
    expect(chevrons.length).toBe(2);
  });

  it("renders with proper navigation semantics", () => {
    const items = [{ name: "Productos", url: "/productos" }];

    render(<Breadcrumbs items={items} />);

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders JSON-LD structured data script", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
    ];

    const { container } = render(<Breadcrumbs items={items} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("includes all items in JSON-LD schema", () => {
    const items = [
      { name: "Productos", url: "/productos" },
      { name: "Manteles", url: "/productos?categoria=manteles" },
    ];

    const { container } = render(<Breadcrumbs items={items} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.textContent || "{}");

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(3); // Inicio + 2 items
    expect(jsonLd.itemListElement[0].name).toBe("Inicio");
    expect(jsonLd.itemListElement[1].name).toBe("Productos");
    expect(jsonLd.itemListElement[2].name).toBe("Manteles");
  });

  it("handles single item breadcrumb", () => {
    const items = [{ name: "Productos", url: "/productos" }];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
  });

  it("handles empty items array", () => {
    render(<Breadcrumbs items={[]} />);

    // Should still render "Inicio"
    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    const items = [{ name: "Productos", url: "/productos" }];

    render(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText("Productos");
    expect(lastItem).toHaveClass("font-medium");
    expect(lastItem).toHaveClass("text-foreground");
  });

  it("renders links with hover state class", () => {
    const items = [{ name: "Productos", url: "/productos" }];

    render(<Breadcrumbs items={items} />);

    const link = screen.getByText("Inicio").closest("a");
    expect(link).toHaveClass("hover:text-foreground");
  });
});
