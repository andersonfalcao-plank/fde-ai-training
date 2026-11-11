import { describe, expect, it } from "vitest";

import { getProducts } from "./products";

describe("getProducts", () => {
  it("returns products with unique ids", async () => {
    const products = await getProducts();
    const ids = products.map((product) => product.id);

    expect(products.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every product a title, description and local image", async () => {
    for (const product of await getProducts()) {
      expect(product.title).not.toBe("");
      expect(product.description).not.toBe("");
      expect(product.image).toMatch(/^\/products\/.+\.svg$/);
    }
  });
});
