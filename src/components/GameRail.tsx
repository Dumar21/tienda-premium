"use client";
import { useEffect, useRef, useState } from "react";
import { G } from "@/lib/catalog";
import Thumb from "@/components/Thumb";

export default function GameRail({ icons }: { icons: Record<string, string> }) {
  const rail = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = rail.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="car">
      <div className="rail" ref={rail} onScroll={update}>
        {G.map((g) => {
          const icon = icons[String(g.placeId)];
          return (
            <div
              key={g.name}
              className="gm"
              style={{ background: icon ? "#0A0C11" : `linear-gradient(160deg, ${g.gradient})` }}
            >
              <Thumb cover src={icon} fallback={g.emoji} alt={g.name} />
              <b>{g.name}</b>
            </div>
          );
        })}
      </div>
      {canPrev && (
        <button className="ib pv" aria-label="Juegos anteriores" onClick={() => go(-1)}>
          ‹
        </button>
      )}
      {canNext && (
        <button className="ib nx" aria-label="Más juegos" onClick={() => go(1)}>
          ›
        </button>
      )}
    </div>
  );
}