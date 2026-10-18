export type Game = { name: string; placeId: number | null; emoji: string; gradient: string };

export const G: Game[] = [
  { name: "Jujutsu Shenanigans", placeId: 9391468976, emoji: "👊", gradient: "#7f1d1d,#1e1b4b" },
  { name: "Blox Fruits", placeId: 2753915549, emoji: "🍎", gradient: "#1d4ed8,#7c3aed" },
  { name: "Dress To Impress", placeId: 15101393044, emoji: "👗", gradient: "#db2777,#f9a8d4" },
  { name: "Rivals", placeId: 17625359962, emoji: "🎯", gradient: "#0e7490,#1e293b" },
  { name: "Murder Mystery 2", placeId: 142823291, emoji: "🗡️", gradient: "#b91c1c,#111827" },
  { name: "Criminality", placeId: 4588604953, emoji: "🔫", gradient: "#374151,#0f172a" },
  { name: "Pet Simulator 99", placeId: 8737899170, emoji: "🐾", gradient: "#ea580c,#7c2d12" },
  { name: "Fisch", placeId: 16732694052, emoji: "🐟", gradient: "#0369a1,#064e3b" },
  { name: "Evade", placeId: 9872472334, emoji: "🏃", gradient: "#4d7c0f,#1e1b4b" },
  { name: "Jailbreak", placeId: 606849621, emoji: "🚓", gradient: "#1e3a8a,#be123c" },
];

export const ROBUX_IMG = "/img/ROBUX_IMG.png";

export type Product = { n: string; c: string; g: string; p: number; t: string; e: string; bg: string; img?: string };

export const P: Product[] = [
  { n: "Icewing", c: "MM2", g: "Murder Mystery 2", p: 0.9, t: "18 vendidos esta semana", e: "🗡️", bg: "#1c87b900,#4c0519", img: "/img/icewing.png" },
  { n: "+1 Fruit Storage", c: "In-game", g: "Blox Fruits", p: 3.4, t: "16 vendidos", e: "🍎", bg: "#1d4fd800,#312e81", img: "/img/fruit-storage.png" },
  { n: "Eternal IV", c: "MM2", g: "Godly", p: 0.5, t: "Quedan 3", e: "🗡️", bg: "#7c3aed00,#1e1b4b", img: "/img/eternal-iv.png" },
  { n: "Eternal III", c: "MM2", g: "Godly", p: 0.39, t: "10 vendidos", e: "🔪", bg: "#9f123a00,#1e1b4b", img: "/img/eternal-iii.png" },
  { n: "Eternalcane", c: "MM2", g: "Godly", p: 0.6, t: "Queda 1", e: "🦯", bg: "#ca8b0400,#422006", img: "/img/eternalcane.png" },
  { n: "Orange Seer", c: "MM2", g: "Godly", p: 0.28, t: "7 vendidos", e: "🪓", bg: "#ea5a0c00,#431407", img: "/img/orange-seer.png" },
  { n: "10 Random Emotes", c: "In-game", g: "Jujutsu Shenanigans", p: 2.13, t: "7 vendidos", e: "🎭", bg: "#9f123a00,#1e1b4b", img: "/img/emotes.png" },
  { n: "Limited de muestra", c: "Limiteds", g: "Roblox", p: 35, t: "Desde $35", e: "👑", bg: "#0890b200,#4c1d95" },
];