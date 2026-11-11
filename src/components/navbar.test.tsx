import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("links the product name to the home page", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "WorkBot" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it.each([
    ["Home", "/"],
    ["Products", "/products"],
    ["Contact", "/contact"],
    ["Settings", "/settings"],
  ])("links %s to %s", (name, href) => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  });
});
