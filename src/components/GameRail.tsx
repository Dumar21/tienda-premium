"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { G } from "@/lib/catalog";
import Thumb from "@/components/Thumb";

const CSS = `
.gx{position:relative}
.gx-rail{display:flex;gap:12px;height:440px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;padding:44px 32px;margin:-26px -28px;-webkit-overflow-scrolling:touch}
.gx-rail::-webkit-scrollbar{display:none}

.gx-c{--dc:56,189,248;--ease:cubic-bezier(.22,1,.36,1);position:relative;flex:0 0 112px;height:100%;border-radius:28px;overflow:hidden;cursor:pointer;text-align:left;border:1px solid rgba(var(--dc),.25);background:var(--gbg);isolation:isolate;will-change:flex-basis;transition:flex-basis .75s var(--ease),border-color .5s,box-shadow .6s}
.gx-c[aria-current=true]{flex-basis:380px;border-color:rgba(var(--dc),.8);box-shadow:0 0 42px -6px rgba(var(--dc),.55),0 0 0 1px rgba(var(--dc),.2)}

.gx-img{position:absolute;inset:0;z-index:-2;display:block;filter:saturate(1.15) brightness(.85);transform:scale(1.04);transition:transform 1s var(--ease)}
.gx-img>*{width:100%;height:100%;object-fit:cover}
.gx-c[aria-current=true] .gx-img{transform:scale(1)}

.gx-lt{position:absolute;inset:0;z-index:-1;pointer-events:none;background:rgba(5,9,20,.3);transition:opacity .7s var(--ease)}
.gx-c[aria-current=true] .gx-lt{opacity:.7}

.gx-n{position:absolute;left:16px;top:16px;font-size:13px;font-weight:800;letter-spacing:.1em;color:rgba(255,255,255,.85)}
.gx-v{position:absolute;left:50%;bottom:22px;writing-mode:vertical-rl;transform:translateX(-50%) rotate(180deg);font-size:17px;font-weight:800;letter-spacing:-.01em;white-space:nowrap;max-height:260px;overflow:hidden;text-overflow:ellipsis;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.7);transition:opacity .35s}
.gx-c[aria-current=true] .gx-v{opacity:0}

.gx-o{position:absolute;left:0;bottom:0;width:380px;padding:26px;display:flex;flex-direction:column;align-items:flex-start;gap:10px;pointer-events:none;text-shadow:0 2px 16px rgba(0,0,0,.6)}
.gx-o>*{opacity:0;transform:translate3d(0,14px,0);transition:opacity .2s,transform .2s}
.gx-c[aria-current=true] .gx-o{pointer-events:auto}
.gx-c[aria-current=true] .gx-o>*{opacity:1;transform:none;transition:opacity .6s var(--ease),transform .8s var(--ease)}
.gx-c[aria-current=true] .gx-o>*:nth-child(1){transition-delay:.12s}
.gx-c[aria-current=true] .gx-o>*:nth-child(2){transition-delay:.18s}
.gx-c[aria-current=true] .gx-o>*:nth-child(3){transition-delay:.24s}
.gx-c[aria-current=true] .gx-o>*:nth-child(4){transition-delay:.3s}
.gx-tg{display:inline-block;padding:5px 12px;border-radius:99px;background:rgba(var(--dc),.3);border:1px solid rgba(var(--dc),.6);font-size:11px;font-weight:700;letter-spacing:.08em;text-shadow:none}
.gx-o h3{margin:0;font-size:clamp(26px,3vw,38px);line-height:1.05;letter-spacing:-.035em}
.gx-o p{margin:0;max-width:20em;font-size:14px;line-height:1.5;color:rgba(244,241,255,.85)}
.gx-go{margin-top:6px;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border-radius:99px;background:#fff;color:#0a1020;font-weight:800;font-size:14px;text-shadow:none}
.gx-c[aria-current=true] .gx-go{transition:opacity .6s var(--ease),transform .8s var(--ease),box-shadow .25s,gap .25s}
.gx-go:hover{gap:12px;box-shadow:0 12px 28px -10px rgba(var(--dc),.9)}

.gx-bar{display:flex;align-items:center;gap:18px;margin-top:4px}
.gx-pg{flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden}
.gx-pg i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--a),var(--b),var(--c));transition:width .25s}
.gx-ar{display:flex;gap:8px}
.gx-ar button{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:24px;line-height:1;background:rgba(9,15,32,.6);border:1px solid var(--line);transition:background .25s,transform .3s var(--ease)}
.gx-ar button:hover{background:linear-gradient(135deg,var(--a),var(--b));transform:scale(1.08)}
.gx-ar button:active{transform:scale(.94)}

@media(max-width:640px){
.gx-rail{height:380px;gap:10px;padding:34px 20px;margin:-20px -16px}
.gx-c{flex-basis:76px;border-radius:22px}
.gx-c[aria-current=true]{flex-basis:260px}
.gx-v{font-size:15px;bottom:18px}
.gx-o{width:260px;padding:20px}
.gx-ar button{width:40px;height:40px}
}
@media(prefers-reduced-motion:reduce){
.gx-c,.gx-c *{transition-duration:.01ms!important;transition-delay:0s!important}
}
`;

const cache = new Map<string, string | null>();

function dominant(src: string): Promise<string | null> {
  if (cache.has(src)) return Promise.resolve(cache.get(src) ?? null);
  return new Promise((resolve) => {
    const done = (v: string | null) => {
      cache.set(src, v);
      resolve(v);
    };
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const s = 32;
        const cv = document.createElement("canvas");
        cv.width = s;
        cv.height = s;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        if (!ctx) return done(null);
        ctx.drawImage(img, 0, 0, s, s);
        const d = ctx.getImageData(0, 0, s, s).data;
        const bins = new Map<number, { w: number; n: number; r: number; g: number; b: number }>();
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 200) continue;
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const mx = Math.max(r, g, b);
          const mn = Math.min(r, g, b);
          const l = (mx + mn) / 510;
          const sat = mx === 0 ? 0 : (mx - mn) / mx;
          if (l < 0.12 || l > 0.92 || sat < 0.25) continue;
          const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
          const e = bins.get(key) || { w: 0, n: 0, r: 0, g: 0, b: 0 };
          e.w += sat * sat + 0.05;
          e.n += 1;
          e.r += r;
          e.g += g;
          e.b += b;
          bins.set(key, e);
        }
        let best: { w: number; n: number; r: number; g: number; b: number } | null = null;
        bins.forEach((e) => {
          if (!best || e.w > best.w) best = e;
        });
        if (!best) return done(null);
        const b2 = best as { n: number; r: number; g: number; b: number };
        done(`${Math.round(b2.r / b2.n)},${Math.round(b2.g / b2.n)},${Math.round(b2.b / b2.n)}`);
      } catch {
        done(null);
      }
    };
    img.onerror = () => done(null);
    img.src = src;
  });
}

export default function GameRail({ icons }: { icons: Record<string, string> }) {
  const rail = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cols, setCols] = useState<Record<string, string>>({});

  useEffect(() => {
    let dead = false;
    G.forEach((g) => {
      const id = String(g.placeId);
      const src = icons[id];
      if (!src) return;
      dominant(src).then((c) => {
        if (dead || !c) return;
        setCols((p) => (p[id] === c ? p : { ...p, [id]: c }));
      });
    });
    return () => {
      dead = true;
    };
  }, [icons]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const go = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const pick = (i: number, scroll: boolean) => {
    setActive(i);
    if (!scroll) return;
    const card = rail.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const onHover = (i: number) => {
    if (!window.matchMedia("(hover:hover)").matches) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActive(i), 90);
  };

  const onLeaveCard = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <div className="gx">
      <style>{CSS}</style>
      <div className="gx-rail" ref={rail} onScroll={onScroll}>
        {G.map((g, i) => {
          const id = String(g.placeId);
          const icon = icons[id];
          const dc = cols[id];
          const style = {
            "--gbg": dc
              ? `linear-gradient(160deg, rgba(${dc},.55), #050914 85%)`
              : `linear-gradient(160deg, ${g.gradient})`,
            ...(dc ? { "--dc": dc } : {}),
          } as CSSProperties;
          return (
            <div
              key={g.name}
              className="gx-c"
              role="button"
              tabIndex={0}
              aria-current={i === active}
              aria-label={g.name}
              style={style}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={onLeaveCard}
              onClick={() => pick(i, true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(i, true);
                }
              }}
            >
              <span className="gx-img" aria-hidden="true">
                <Thumb cover src={icon} fallback={g.emoji} alt="" />
              </span>
              <span className="gx-lt" aria-hidden="true" />

              <span className="gx-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="gx-v">{g.name}</span>

              <span className="gx-o">
                <span className="gx-tg">Juego {String(i + 1).padStart(2, "0")}</span>
                <h3>{g.name}</h3>
                <p>Ítems entregados directo en el juego, pagados en tu moneda local.</p>
                <button className="gx-go" type="button">
                  Ver ítems →
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="gx-bar">
        <div className="gx-pg" aria-hidden="true">
          <i style={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>
        <div className="gx-ar">
          <button aria-label="Juegos anteriores" onClick={() => go(-1)}>
            ‹
          </button>
          <button aria-label="Más juegos" onClick={() => go(1)}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}