import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AddToCartButton } from "./add-to-cart-button";

describe("AddToCartButton", () => {
  it("starts enabled with an accessible label naming the product", () => {
    render(<AddToCartButton title="Ceramic Mug" />);
    const button = screen.getByRole("button", {
      name: "Add Ceramic Mug to cart",
    });

    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Add to cart");
  });

  it("confirms and disables itself once clicked", () => {
    render(<AddToCartButton title="Ceramic Mug" />);
    fireEvent.click(screen.getByRole("button"));

    const button = screen.getByRole("button", {
      name: "Ceramic Mug added to cart",
    });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Added to cart");
  });
});
