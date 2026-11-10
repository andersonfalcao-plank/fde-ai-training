import type { Metadata } from "next";
import Image from "next/image";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/products";

import { AddToCartButton } from "./_components/add-to-cart-button";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Products</h1>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="h-full">
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={300}
                className="aspect-4/3 w-full object-cover"
              />
              <CardHeader className="flex-1">
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <AddToCartButton title={product.title} />
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
