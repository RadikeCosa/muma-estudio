import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { truncateText, slugify, isDefined } from "./index";

describe("truncateText", () => {
  it("returns original text when length is below maxLength", () => {
    assert.equal(truncateText("Short text", 20), "Short text");
    assert.equal(truncateText("Hello", 10), "Hello");
  });

  it("returns original text when length equals maxLength", () => {
    assert.equal(truncateText("Exact", 5), "Exact");
  });

  it("truncates text and adds ellipsis when exceeding maxLength", () => {
    assert.equal(truncateText("This is a long text", 10), "This is...");
    assert.equal(truncateText("Hello World", 8), "Hello...");
  });

  it("handles edge case with very short maxLength", () => {
    // When maxLength is 3, we get "..." (3 chars for ellipsis)
    assert.equal(truncateText("Hello", 3), "...");
    // When text length equals maxLength, returns original
    assert.equal(truncateText("Test", 4), "Test");
    assert.equal(truncateText("Hello", 5), "Hello");
    // When text exceeds, truncates and adds ellipsis
    assert.equal(truncateText("Hello!", 5), "He...");
  });

  it("handles empty string", () => {
    assert.equal(truncateText("", 10), "");
  });
});

describe("slugify", () => {
  it("converts text to lowercase", () => {
    assert.equal(slugify("UPPERCASE"), "uppercase");
    assert.equal(slugify("MixedCase"), "mixedcase");
  });

  it("removes accents from characters", () => {
    assert.equal(slugify("Ñoño José"), "nono-jose");
    assert.equal(slugify("Café con Leché"), "cafe-con-leche");
    assert.equal(slugify("Málaga"), "malaga");
  });

  it("replaces spaces with hyphens", () => {
    assert.equal(slugify("hello world"), "hello-world");
    assert.equal(slugify("multiple   spaces"), "multiple-spaces");
  });

  it("replaces special characters with hyphens", () => {
    assert.equal(slugify("hello@world"), "hello-world");
    assert.equal(slugify("price: $100"), "price-100");
    assert.equal(slugify("test&value"), "test-value");
  });

  it("removes leading and trailing hyphens", () => {
    assert.equal(slugify("-leading"), "leading");
    assert.equal(slugify("trailing-"), "trailing");
    assert.equal(slugify("-both-"), "both");
  });

  it("handles consecutive special characters", () => {
    assert.equal(slugify("hello!!!world"), "hello-world");
    assert.equal(slugify("test---value"), "test-value");
  });

  it("creates URL-safe slugs from product names", () => {
    assert.equal(slugify("Mantel Floral 150x200"), "mantel-floral-150x200");
    assert.equal(
      slugify("Servilleta Artesanal - Rojo"),
      "servilleta-artesanal-rojo"
    );
  });

  it("handles empty string", () => {
    assert.equal(slugify(""), "");
  });

  it("handles string with only special characters", () => {
    assert.equal(slugify("@@@###"), "");
    assert.equal(slugify("---"), "");
  });
});

describe("isDefined", () => {
  it("returns false for null", () => {
    assert.equal(isDefined(null), false);
  });

  it("returns false for undefined", () => {
    assert.equal(isDefined(undefined), false);
  });

  it("returns true for defined values", () => {
    assert.equal(isDefined(0), true);
    assert.equal(isDefined(""), true);
    assert.equal(isDefined("text"), true);
    assert.equal(isDefined(42), true);
    assert.equal(isDefined(false), true);
  });

  it("returns true for objects and arrays", () => {
    assert.equal(isDefined({}), true);
    assert.equal(isDefined([]), true);
    assert.equal(isDefined({ key: "value" }), true);
    assert.equal(isDefined([1, 2, 3]), true);
  });

  it("acts as type guard in TypeScript", () => {
    const value: string | null = "test";
    if (isDefined(value)) {
      // TypeScript should know value is string here
      assert.equal(typeof value, "string");
    }
  });
});
