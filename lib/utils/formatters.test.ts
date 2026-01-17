import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatPrice, formatPriceRange, formatStock } from "./formatters";

const normalizeCurrency = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

describe("formatPrice", () => {
  it("returns fallback when amount is null", () => {
    assert.equal(formatPrice(null), "Consultar precio");
    assert.equal(formatPrice(undefined), "Consultar precio");
  });

  it("formats positive amounts without decimals", () => {
    assert.equal(normalizeCurrency(formatPrice(15000)), "$ 15.000");
    assert.equal(normalizeCurrency(formatPrice(0)), "$ 0");
  });
});

describe("formatPriceRange", () => {
  it("returns fallback when both bounds are missing", () => {
    assert.equal(formatPriceRange(null, null), "Consultar precio");
  });

  it("returns single price when bounds match", () => {
    assert.equal(normalizeCurrency(formatPriceRange(2000, 2000)), "$ 2.000");
  });

  it("formats range when both bounds are provided", () => {
    const result = normalizeCurrency(formatPriceRange(1000, 2500));
    assert.equal(result, "Desde $ 1.000 - Hasta $ 2.500");
  });

  it("falls back to available bound when one is missing", () => {
    assert.equal(normalizeCurrency(formatPriceRange(1200, null)), "$ 1.200");
    assert.equal(normalizeCurrency(formatPriceRange(null, 3500)), "$ 3.500");
  });
});

describe("formatStock", () => {
  it("handles backorder when stock is zero", () => {
    assert.equal(formatStock(0), "A pedido");
  });

  it("singular and plural cases", () => {
    assert.equal(formatStock(1), "1 disponible");
    assert.equal(formatStock(3), "3 disponibles");
  });
});
