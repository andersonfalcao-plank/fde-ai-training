"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AddToCartButton({ title }: { title: string }) {
  const [added, setAdded] = useState(false);

  return (
    <Button
      className="w-full"
      onClick={() => setAdded(true)}
      disabled={added}
      aria-label={added ? `${title} added to cart` : `Add ${title} to cart`}
    >
      {added ? <Check /> : <ShoppingCart />}
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
