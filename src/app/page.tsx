"use client";

import "./glass.css";
import React, { useState, useEffect, useRef } from "react";
import { G, P, ROBUX_IMG } from "@/lib/catalog";
import { useGameIcons } from "@/lib/useGameIcons";
import Thumb from "@/components/Thumb";
import Flag from "@/components/Flag";
import GameRail from "@/components/GameRail";
import PaySection from "@/components/PaySection";

const FAQ_ITEMS = [
  ["¿Cuáles son los métodos de entrega?", "Con Gamepass creas un pase en tu juego, nosotros cubrimos el 30 % de impuesto y tus Robux llegan a transacciones pendientes en 5 días. Con Grupo te unes a uno de nuestros grupos y la espera estándar es de 14 días."],
  ["¿Cuánto tarda la entrega de Robux?", "Normalmente entre 15 minutos y 24 horas. En casos excepcionales puede llegar a 48 horas y siempre te avisamos en la página."],
  ["¿Necesitan mi contraseña?", "Nunca. Solo necesitamos tu nombre de usuario de Roblox para entregarte los Robux."],
  ["¿Qué métodos de pago aceptan?", "Pagos locales en Colombia, México, Argentina, Perú y Brasil. Desde otros países, con cripto o tarjeta."],
];

const TICKER = [
  ["Go******", "Duskwing bundle", "hace 5 min"],
  ["Ow****", "Robux", "hace 13 min"],
  ["an******", "2x Mastery", "hace 1 h"],
  ["ch*****", "Robux", "hace 27 min"],
  ["Lo******", "Bat bundle", "hace 1 h"],
  ["Xx******", "Robux", "hace 29 min"],
  ["Ee*****", "Spooky skin case 3x", "hace 2 h"],
  ["ne******", "Robux", "hace 43 min"],
];

const STEPS = [
  ["1", "Elige", "Escoge Robux, un arma de MM2, un Limited o el ítem de tu juego."],
  ["2", "Paga", "Con tu moneda local en Colombia, México, Argentina, Perú y Brasil, o con cripto y tarjeta desde otros países."],
  ["3", "Recibe", "La entrega llega normalmente entre 15 minutos y 24 horas. Nunca te pedimos la contraseña, solo tu usuario."],
];

const LATAM = [
  ["co", "Colombia"],
  ["mx", "México"],
  ["ar", "Argentina"],
  ["pe", "Perú"],
  ["br", "Brasil"],
];

const QUICK = [1000, 5000, 10000, 20000];
const R_MIN = 400;
const R_MAX = 20000;

const MM2_ITEMS = P.filter((x) => x.c === "MM2" && x.img);
const GAME_ITEMS = P.filter((x) => x.c === "In-game" && x.img);

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function Brand() {
  return (
    <a className="lx-logo" href="#" aria-label="Rbx Latam Store">
      <span className="lx-lt">
        <span className="lx-ri">
          <Thumb src={ROBUX_IMG} fallback="🔷" alt="" size={28} />
        </span>
        <b>
          <em>Latam</em> Store
        </b>
      </span>
    </a>
  );
}

function useIn<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, on] = useIn<HTMLDivElement>();
  return (
    <div ref={ref} className={`lx-rv ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

function Split({ text, grad = false, start = 0 }: { text: string; grad?: boolean; start?: number }) {
  const [ref, on] = useIn<HTMLSpanElement>();
  return (
    <span ref={ref} className={`lx-split ${on ? "in" : ""}`}>
      {text.split(" ").map((w, i) => (
        <React.Fragment key={i}>
          <span className={`lx-w1 ${grad ? "lx-g" : ""}`} style={{ "--i": i + start } as React.CSSProperties}>
            {w}
          </span>{" "}
        </React.Fragment>
      ))}
    </span>
  );
}

function CountUp({ to, dec = 0, pre = "", suf = "" }: { to: number; dec?: number; pre?: string; suf?: string }) {
  const [ref, on] = useIn<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setV(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return (
    <span ref={ref}>
      {pre}
      {v.toLocaleString("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec })}
      {suf}
    </span>
  );
}

function SecHead({ tag, title, accent, text, link, href = "#top" }: { tag: string; title: string; accent: string; text: string; link?: string; href?: string }) {
  return (
    <div className="lx-sh">
      <div>
        <Reveal>
          <span className="lx-eb">{tag}</span>
        </Reveal>
        <h2>
          <Split text={title} /> <Split text={accent} grad start={title.split(" ").length} />
        </h2>
        <Reveal delay={150}>
          <p>{text}</p>
        </Reveal>
      </div>
      {link && (
        <a className="lx-more" href={href}>
          {link} →
        </a>
      )}
    </div>
  );
}

function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const cols = ["56,189,248", "37,99,235", "147,197,253"];
    type Pt = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let pts: Pt[] = [];
    let w = 0, h = 0, raf = 0;
    const m = { x: -999, y: -999 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor(w / 20));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.05,
        r: Math.random() * 1.8 + 0.7,
        c: cols[Math.floor(Math.random() * 3)],
      }));
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.x - m.x, dy = p.y - m.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 19600 && d2 > 1) {
          const f = (1 - d2 / 19600) * 0.6;
          p.vx += (dx / Math.sqrt(d2)) * f * 0.1;
          p.vy += (dy / Math.sqrt(d2)) * f * 0.1;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx + 0.0001;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.fillStyle = `rgba(${p.c},.12)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.c},.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const ax = p.x - q.x, ay = p.y - q.y;
          const dd = ax * ax + ay * ay;
          if (dd < 12100) {
            ctx.strokeStyle = `rgba(${p.c},${(1 - dd / 12100) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      m.x = e.clientX;
      m.y = e.clientY;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas ref={ref} className="lx-canvas" aria-hidden="true" />;
}

type SwapItem = { n: string; e: string; img?: string };

function ItemSwap({ items, size = 48, delay = 0 }: { items: SwapItem[]; size?: number; delay?: number }) {
  const n = items.length;
  const [pos, setPos] = useState<[number, number]>([0, n > 1 ? 1 : 0]);

  useEffect(() => {
    if (n < 2) return;
    let t = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        t++;
        setPos(([a, b]) => {
          if (n === 2) return [b, a];
          if (t % 2) {
            let x = (a + 1) % n;
            if (x === b) x = (x + 1) % n;
            return [x, b];
          }
          let x = (b + 1) % n;
          if (x === a) x = (x + 1) % n;
          return [a, x];
        });
      }, 2600);
    }, delay);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [n, delay]);

  if (!n) return null;
  const [a, b] = pos;
  const A = items[a];
  const B = items[b];
  const box = { width: size, height: size } as React.CSSProperties;

  return (
    <span className="lx-swap" style={{ width: n > 1 ? size * 1.6 : size, height: size }} aria-hidden="true">
      <span className={`lx-sl ${n > 1 ? "a" : "solo"}`} style={box}>
        <span className="lx-swi" key={`a${a}`}>
          <Thumb src={A.img} fallback={A.e} alt={A.n} size={size} />
        </span>
      </span>
      {n > 1 && (
        <span className="lx-sl b" style={box}>
          <span className="lx-swi" key={`b${b}`}>
            <Thumb src={B.img} fallback={B.e} alt={B.n} size={size} />
          </span>
        </span>
      )}
    </span>
  );
}

function ItemFan({ items, size = 96 }: { items: SwapItem[]; size?: number }) {
  const n = items.length;
  const k = Math.min(3, n);
  const [pos, setPos] = useState<number[]>(() => Array.from({ length: k }, (_, i) => i));

  useEffect(() => {
    if (n <= k) return;
    let t = 0;
    const iv = setInterval(() => {
      t++;
      setPos((p) => {
        const slot = t % k;
        let x = (p[slot] + 1) % n;
        while (p.includes(x)) x = (x + 1) % n;
        const c = [...p];
        c[slot] = x;
        return c;
      });
    }, 2400);
    return () => clearInterval(iv);
  }, [n, k]);

  return (
    <div className="lx-fan" aria-hidden="true">
      {pos.map((idx, slot) => (
        <span className="lx-fs" key={slot}>
          <span className="lx-swi" key={idx}>
            <Thumb src={items[idx].img} fallback={items[idx].e} alt={items[idx].n} size={size} />
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const icons = useGameIcons();
  const [cur, setCur] = useState("COP");
  const [cart, setCart] = useState(0);
  const [tab, setTab] = useState("Todos");
  const [q, setQ] = useState("");
  const [robuxQty, setRobuxQty] = useState(5000);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [lang, setLang] = useState("ES");
  const [active, setActive] = useState("");
  const islandRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [buyOff, setBuyOff] = useState({ x: 0, y: 0, w: 0 });

  const RATE = 3300;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setHeaderScrolled(y > 40);
      if (y < 300) setActive("");
      islandRef.current?.style.setProperty("--p", String(max > 0 ? y / max : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const els = ["juegos", "vendemos", "top"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest?.(".spot") as HTMLElement | null;
      if (!t || raf) return;
      const cx = e.clientX, cy = e.clientY;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${cx - r.left}px`);
        t.style.setProperty("--my", `${cy - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const calc = () => {
      const el = buyRef.current;
      const hero = el?.closest(".lx-hero") as HTMLElement | null;
      if (!el || !hero) return;
      const a = el.getBoundingClientRect();
      const b = hero.getBoundingClientRect();
      setBuyOff({ x: a.left - b.left + 1, y: a.top - b.top + 1, w: hero.offsetWidth });
    };
    calc();
    const t = setTimeout(calc, 1300);
    window.addEventListener("resize", calc);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", calc);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 1800);
  };

  const addToCart = (itemName: string) => {
    setCart((prev) => prev + 1);
    triggerToast(`${itemName} agregado al carrito`);
  };

  const money = (u: number) => {
    if (cur === "COP") {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(u * RATE);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(u);
  };

  const filteredProducts = P.filter((x) => {
    const matchesTab = tab === "Todos" || x.c === tab;
    const matchesSearch = !q || (x.n + x.g + x.c).toLowerCase().includes(q.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const rankProducts = filteredProducts.slice(0, 8);
  const robuxRate = robuxQty >= 5000 ? 0.008 : 0.0085;
  const robuxPct = ((robuxQty - R_MIN) / (R_MAX - R_MIN)) * 100;

  return (
    <div className="lx-root">
      <div className="lx-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <ParticleField />

      <div ref={islandRef} className={`lx-island ${headerScrolled ? "on" : ""}`}>
        <div className="lx-bar">
          <Brand />
          <nav className="lx-nav">
            <a href="#juegos" className={active === "juegos" ? "on" : ""}>Juegos</a>
            <a href="#vendemos" className={active === "vendemos" ? "on" : ""}>Servicios</a>
            <a href="#top" className={active === "top" ? "on" : ""}>Más vendidos</a>
          </nav>
          <label className={`lx-find ${q ? "has" : ""}`}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar…"
              aria-label="Buscar"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </label>
          <button className="lx-pill cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 8H6" />
            </svg>
            <span className="lx-ctext">Carrito</span>
            <span className="lx-cnt">{cart}</span>
          </button>
        </div>

        <div className="lx-bar sm lx-cur">
          <button className="lx-pill" onClick={() => setCur((p) => (p === "COP" ? "USD" : "COP"))} aria-label="Cambiar moneda">
            <Flag code={cur === "COP" ? "co" : "us"} size={18} />
            <span className="lx-cd">{cur}</span>
          </button>
          <button className="lx-pill lx-lang" onClick={() => setLang((l) => (l === "ES" ? "EN" : "ES"))} aria-label="Cambiar idioma">
            <Flag code={lang === "ES" ? "es" : "us"} size={18} />
            {lang}
          </button>
        </div>

        <div className="lx-bar sm lx-usr">
          <button className="lx-ic" aria-label="Notificaciones">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <i className="lx-dot" />
          </button>
          <button className="lx-av" aria-label="Perfil">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </button>
        </div>
      </div>

      <main>
        <section className="lx-hero">
          <div className="lx-ban" aria-hidden="true" />
          <div className="lx-w lx-hg">
            <div className="lx-hl">
              <Reveal>
                <span className="lx-badge">
                  <s>★★★★★</s>
                  <b>4,9</b>9.316 reseñas verificadas
                </span>
              </Reveal>
              <h1>
                <Split text="Compra Robux e ítems" /> <Split text="baratos y seguros" grad start={4} />
              </h1>
              <Reveal delay={500}>
                <p className="lx-sub">
                  Robux, armas MM2, Limiteds e ítems in-game al mejor precio de LATAM, con +140.000 pedidos entregados.
                </p>
              </Reveal>
              <Reveal delay={650}>
                <div className="lx-chips">
                  <a className="lx-chip spot" href="#comprar">
                    <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={30} />
                    <span>
                      <b>Robux</b>
                      <small>1.000 desde {money(8.5)}</small>
                    </span>
                  </a>
                  <a className="lx-chip spot" href="#top" onClick={() => setTab("MM2")}>
                    <ItemSwap items={MM2_ITEMS} size={30} />
                    <span>
                      <b>Armas MM2</b>
                      <small>26 godlys disponibles</small>
                    </span>
                  </a>
                  <a className="lx-chip spot" href="#top" onClick={() => setTab("Limiteds")}>
                    <span className="lx-e">💎</span>
                    <span>
                      <b>Limiteds</b>
                      <small>desde {money(35)}</small>
                    </span>
                  </a>
                  <a className="lx-chip spot" href="#juegos">
                    <ItemSwap items={GAME_ITEMS} size={30} delay={1300} />
                    <span>
                      <b>Ítems in-game</b>
                      <small>31 juegos disponibles</small>
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={400}>
              <div className="lx-buy" id="comprar" ref={buyRef}>
                <span
                  className="lx-buybg"
                  aria-hidden="true"
                  style={{ left: -buyOff.x, top: -buyOff.y, width: buyOff.w }}
                />
                <div className="lx-buyh">
                  <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={44} />
                  <div>
                    <h3>Comprar Robux</h3>
                    <small>Compra protegida · desde {money(8.5)}/1.000</small>
                  </div>
                </div>
                <div className="lx-bq">
                  <b>{robuxQty.toLocaleString("es-CO")}</b>
                  <span>Robux</span>
                </div>
                <input
                  type="range"
                  min={R_MIN}
                  max={R_MAX}
                  step="100"
                  value={robuxQty}
                  style={{ "--pct": `${robuxPct}%` } as React.CSSProperties}
                  onChange={(e) => setRobuxQty(Number(e.target.value))}
                  aria-label="Cantidad de Robux"
                />
                <div className="lx-qs">
                  {QUICK.map((n) => (
                    <button key={n} className="lx-qb" aria-pressed={robuxQty === n} onClick={() => setRobuxQty(n)}>
                      {n.toLocaleString("es-CO")}
                    </button>
                  ))}
                </div>
                <div className="lx-bt">
                  <small>Total a pagar</small>
                  <strong>{money(robuxQty * robuxRate)}</strong>
                </div>
                <button className="lx-btn" onClick={() => addToCart("Robux")}>
                  Comprar Robux
                </button>
                <p className="lx-bn">Entrega entre 15 min y 24 h. Nunca pedimos tu contraseña.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="lx-w">
          <Reveal>
            <div className="lx-trust">
              <div>
                <b>
                  <CountUp to={4.9} dec={1} suf=" ★" />
                </b>
                <small>9.316 reseñas</small>
              </div>
              <div>
                <b>
                  <CountUp to={140000} pre="+" />
                </b>
                <small>Pedidos entregados</small>
              </div>
              <div>
                <b>2024</b>
                <small>Operando desde</small>
              </div>
              <div>
                <b>
                  <CountUp to={15} pre="+" />
                </b>
                <small>Métodos de pago</small>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lx-tick" style={{ marginTop: 70 }} aria-hidden="true">
          <div className="lx-tk">
            {[...TICKER, ...TICKER].map((t, idx) => (
              <div key={idx}>
                <i />
                <span>
                  <b>{t[0]}</b> compró <em>{t[1]}</em>
                </span>
                <span>{t[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="lx-sec" id="juegos">
          <div className="lx-w">
            <SecHead tag="01 · Juegos" title="Elige tu" accent="juego" text="Ítems entregados directo en el juego, pagados en tu moneda local." link="Ver todos los juegos" />
            <Reveal>
              <GameRail icons={icons} />
            </Reveal>
          </div>
        </section>

        <section className="lx-sec" id="como">
          <div className="lx-w">
            <SecHead tag="02 · Cómo funciona" title="Así de" accent="fácil" text="Tres pasos y tu pedido va en camino." />
            <Reveal>
              <div className="lx-steps">
                {STEPS.map((s) => (
                  <div key={s[0]} className="lx-step spot">
                    <b className="lx-sn">{s[0]}</b>
                    <h3>{s[1]}</h3>
                    <p>{s[2]}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="lx-sec" id="vendemos">
          <div className="lx-w">
            <SecHead tag="03 · Catálogo" title="Más para tu" accent="inventario" text="Armas MM2, Limiteds e ítems in-game. Los Robux los compras arriba, directo en el inicio." link="Ver catálogo completo" />
            <Reveal>
              <div className="lx-note">
                <Flag code="co" size={20} />
                <span>
                  Precios en <b>Colombia</b> (COP), con el 30 % de impuesto de Roblox cubierto por Rbx Latam Store.
                </span>
              </div>
              <div className="lx-bento">
                <a className="lx-bc spot lx-mm" href="#top" onClick={() => setTab("MM2")}>
                  <ItemFan items={MM2_ITEMS} />
                  <h3>Armas MM2</h3>
                  <small>
                    186 skins · desde <b>{money(0.08)}</b>
                  </small>
                  <p className="lx-bp">Cuchillos y armas raras de Murder Mystery 2, al mejor precio.</p>
                  <span className="lx-lk">Explorar MM2 →</span>
                </a>

                <a className="lx-bc spot lx-lm" href="#top" onClick={() => setTab("Limiteds")}>
                  <h3>Limiteds 💎</h3>
                  <small>
                    8 coleccionables · desde <b>{money(35)}</b>
                  </small>
                  <span className="lx-lk">Ver coleccionables →</span>
                </a>

                <a className="lx-bc spot lx-ig" href="#juegos">
                  <h3>Ítems in-game 🎮</h3>
                  <small>
                    31 juegos · desde <b>{money(0.09)}</b>
                  </small>
                  <div className="lx-igr">
                    {G.slice(1, 5).map((g, idx) => (
                      <div key={idx} style={{ background: `linear-gradient(160deg, ${g.gradient})` }}>
                        <Thumb cover src={icons[String(g.placeId)]} fallback={g.emoji} alt={g.name} />
                        <p>
                          <small>{g.name}</small>
                          <b>{["30 Random Emotes", "Duskwing bundle", "Prop Bundle", "2x Mastery"][idx]}</b>
                        </p>
                      </div>
                    ))}
                  </div>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="lx-sec" id="top">
          <div className="lx-w">
            <SecHead tag="04 · Ranking" title="Lo que más" accent="se compra" text="El ranking real de los últimos 7 días, contado pedido por pedido." link="Ver catálogo" />
            <div className="lx-tabs" role="group" aria-label="Filtrar ranking">
              {["Todos", "MM2", "Limiteds", "In-game"].map((f) => (
                <button key={f} aria-pressed={f === tab} onClick={() => setTab(f)}>
                  {f}
                </button>
              ))}
            </div>

            {rankProducts.length === 0 ? (
              <p style={{ color: "var(--mut)" }}>No encontramos nada con esa búsqueda. Prueba otro nombre o cambia de pestaña.</p>
            ) : (
              <div className="lx-rank">
                {rankProducts.map((x, i) => (
                  <div key={x.n + i} className="lx-pc spot">
                    <span className="lx-pim" style={{ background: `linear-gradient(160deg, ${x.bg})` }}>
                      <span className="lx-pn">{String(i + 1).padStart(2, "0")}</span>
                      {i === 0 && <span className="lx-hot">Más vendido</span>}
                      <span className="lx-pimg">
                        <Thumb src={x.img} fallback={x.e} alt={x.n} size={90} />
                      </span>
                    </span>
                    <div className="lx-pb">
                      <span className="lx-tag">{x.g}</span>
                      <b>{x.n}</b>
                      <small>{x.t}</small>
                    </div>
                    <div className="lx-pf">
                      <strong>{money(x.p)}</strong>
                      <button className="lx-btn sm" onClick={() => addToCart(x.n)}>
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <PaySection />

        <section className="lx-sec" id="faq">
          <div className="lx-w">
            <div className="lx-faq">
              <div>
                <h2>
                  <Split text="Preguntas" /> <Split text="frecuentes" grad start={1} />
                </h2>
                <Reveal delay={150}>
                  <p style={{ color: "var(--mut)", marginTop: 12 }}>¿Más dudas? Escríbenos y te respondemos al instante, todos los días.</p>
                  <div className="lx-card spot lx-sup">
                    <h3>¿Te quedaste con dudas?</h3>
                    <p>El soporte humano responde en minutos, todos los días.</p>
                    <button className="lx-btn">Hablar con soporte</button>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={150}>
                {FAQ_ITEMS.map((f, i) => (
                  <details key={i} open={i === 0}>
                    <summary>{f[0]}</summary>
                    <p>{f[1]}</p>
                  </details>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <div className="lx-foot">
        <div className="lx-w">
          <div className="lx-fg">
            <div>
              <Brand />
              <p style={{ marginTop: 12, maxWidth: "20em" }}>Compra productos de Roblox de forma segura, rápida y económica.</p>
              <p className="lx-latf">🌎 Hecho en Latinoamérica, para Latinoamérica</p>
              <div className="lx-fls sm">
                {LATAM.map((c) => (
                  <Flag key={c[0]} code={c[0]} size={20} />
                ))}
              </div>
            </div>
            <div>
              <h4>Tienda</h4>
              <ul>
                <li>Catálogo</li>
                <li>Robux</li>
                <li>Grupos</li>
              </ul>
            </div>
            <div>
              <h4>Cuenta</h4>
              <ul>
                <li>Mi perfil</li>
                <li>Mis pedidos</li>
              </ul>
            </div>
            <div>
              <h4>Soporte</h4>
              <ul>
                <li>Ayuda</li>
                <li>Reseñas</li>
                <li>Discord</li>
                <li>Email</li>
              </ul>
            </div>
            <div>
              <h4>Programas</h4>
              <ul>
                <li>Referidos</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>
          <p className="lx-fine">
            © 2026 Rbx Latam Store · Términos · Privacidad
            <br />
            Servicio independiente. No estamos afiliados, asociados ni respaldados por Roblox Corporation. Todas las marcas pertenecen a sus respectivos propietarios.
          </p>
        </div>
      </div>

      <button className="lx-chat" aria-label="Abrir chat de soporte">
        💬
      </button>

      <nav className="lx-dock" aria-label="Navegación">
        <a href="#juegos" className={active === "juegos" ? "on" : ""}>
          <Ico>
            <path d="M6 12h4M8 10v4" />
            <circle cx="15.5" cy="11" r=".7" />
            <circle cx="17.5" cy="13" r=".7" />
            <path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.2l-1.3 6A3 3 0 0 0 4.4 18c.8 0 1.6-.4 2.1-1l1.2-1.5h8.6l1.2 1.5c.5.6 1.3 1 2.1 1a3 3 0 0 0 2.9-3.8l-1.3-6A4 4 0 0 0 17.3 5z" />
          </Ico>
          Juegos
        </a>
        <a href="#vendemos" className={active === "vendemos" ? "on" : ""}>
          <Ico>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </Ico>
          Servicios
        </a>
        <a href="#top" className={active === "top" ? "on" : ""}>
          <Ico>
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M14 7h7v7" />
          </Ico>
          Top
        </a>
      </nav>

      <div className={`lx-toast ${showToast ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </div>
  );
}