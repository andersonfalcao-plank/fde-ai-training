export type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const products: Product[] = [
  {
    id: "ceramic-mug",
    title: "Ceramic Mug",
    description: "A 350 ml stoneware mug with a matte glaze and a wide handle.",
    image: "/products/mug.svg",
  },
  {
    id: "canvas-tote",
    title: "Canvas Tote",
    description: "Heavy cotton tote with reinforced straps for everyday carry.",
    image: "/products/tote.svg",
  },
  {
    id: "desk-lamp",
    title: "Desk Lamp",
    description: "Adjustable LED lamp with warm light and a weighted base.",
    image: "/products/lamp.svg",
  },
  {
    id: "dotted-notebook",
    title: "Dotted Notebook",
    description: "A5 notebook with 160 dotted pages and a lay-flat binding.",
    image: "/products/notebook.svg",
  },
  {
    id: "water-bottle",
    title: "Water Bottle",
    description: "Insulated steel bottle that keeps drinks cold for 24 hours.",
    image: "/products/bottle.svg",
  },
  {
    id: "wireless-headphones",
    title: "Wireless Headphones",
    description: "Over-ear headphones with 30-hour battery life.",
    image: "/products/headphones.svg",
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}
