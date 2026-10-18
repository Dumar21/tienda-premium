"use client";
import { useEffect, useState } from "react";

// Devuelve { [placeId]: urlDelÍcono }. Llega unos ms después de cargar la página.
export function useGameIcons() {
  const [icons, setIcons] = useState<Record<string, string>>({});
  useEffect(() => {
    let off = false;
    fetch("/api/game-icons")
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => !off && setIcons(j))
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);
  return icons;
}