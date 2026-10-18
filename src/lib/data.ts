import { Product } from "@/types";

export const ROBUX_PACKS: Product[] = [
  {
    id: "robux-400",
    name: "400 Robux Pack",
    description: "Standard package for avatar customization and items.",
    price: 4.99,
    category: "Café",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400&auto=format&fit=crop",
    stock: 999,
    badge: "destacado",
  },
  {
    id: "robux-800",
    name: "800 Robux Pack",
    description: "Most popular choice for frequent game builders.",
    price: 9.99,
    category: "Café",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6e4?q=80&w=400&auto=format&fit=crop",
    stock: 999,
  },
  {
    id: "robux-1700",
    name: "1,700 Robux Pack",
    description: "Unlock exclusive game passes and premium features.",
    price: 19.99,
    category: "Café",
    image: "https://images.unsplash.com/photo-1614680376408-81d91ffe3db7?q=80&w=400&auto=format&fit=crop",
    stock: 999,
    badge: "oferta",
  },
];
