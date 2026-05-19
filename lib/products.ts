import type { Product as PrismaProduct } from "@prisma/client";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
};

export const CATEGORIES = ["All", "Electronics", "Clothing", "Home", "Books", "Sports"];

export function serializeProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    featured: p.featured,
  };
}
