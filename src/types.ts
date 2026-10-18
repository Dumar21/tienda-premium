export type ProductCategory =
  | "Café"
  | "Cerámica"
  | "Textil"
  | "Ilustración"
  | "Velitas";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  badge?: "nuevo" | "oferta" | "destacado" | "agotado";
  stock: number;
  featured?: boolean;
  rating?: number;
  reviews?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Category = {
  name: ProductCategory;
  slug: string;
  count: number;
  image: string;
};