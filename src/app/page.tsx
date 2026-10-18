"use client";

import "./ladrillo.css";
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
  ["¿Cómo funciona el cashback y el saldo?", "Cada compra suma cashback según tu rango y se acumula como saldo. Lo usas para pagar total o parcialmente tus próximas compras al instante."],
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

// productos con imagen que se muestran rotando en las tarjetas
const MM2_ITEMS = P.filter((x) => x.c === "MM2" && x.img);
const GAME_ITEMS = P.filter((x) => x.c === "In-game" && x.img);

const RANKS = [
  ["🥉", "Bronce", "1 %", "Desde el inicio"],
  ["🥈", "Plata", "1,5 %", "Desde $32.000"],
  ["🥇", "Oro", "2 %", "Desde $96.000"],
  ["🏆", "Platino", "2,5 %", "Desde $210.000"],
  ["💠", "Diamante", "3 %", "Desde $390.000"],
];

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

/* ---------- utilidades de animación ---------- */

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

function SecHead({ title, accent, text, link, href = "#top" }: { title: string; accent: string; text: string; link?: string; href?: string }) {
  return (
    <div className="lx-sh">
      <div>
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

/* ---------- partículas (canvas, pausa si la pestaña no se ve) ---------- */

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

/* ---------- dos ítems que se van cambiando ---------- */

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
          if (n === 2) return [b, a]; // con 2 ítems se intercambian
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

/* ---------- abanico de 3 ítems para la tarjeta grande de MM2 ---------- */

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

/* ---------- página ---------- */

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

  const RATE = 3300;

  // barra: se encoge al bajar y muestra el progreso de lectura
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

  // marca la sección en la que estás (menú de arriba y barra de abajo)
  useEffect(() => {
    const els = ["juegos", "vendemos", "top", "cashback"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // brillo que sigue al mouse en las tarjetas (un solo listener para todas)
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

  const featuredProduct = filteredProducts[0];
  const listProducts = filteredProducts.slice(1, 7);
  const robuxRate = robuxQty >= 5000 ? 0.008 : 0.0085;

  return (
    <div className="lx-root">
      <div className="lx-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <ParticleField />

      {/* BARRA SUPERIOR FLOTANTE (3 piezas separadas) */}
      <div ref={islandRef} className={`lx-island ${headerScrolled ? "on" : ""}`}>
        {/* 1. principal */}
        <div className="lx-bar">
          <a className="lx-logo" href="#">
            <img className="lx-logoimg" src="/img/logo-4x.png" alt="Pixel Store" />
          </a>
          <nav className="lx-nav">
            <a href="#juegos" className={active === "juegos" ? "on" : ""}>Juegos</a>
            <a href="#vendemos" className={active === "vendemos" ? "on" : ""}>Servicios</a>
            <a href="#top" className={active === "top" ? "on" : ""}>Más vendidos</a>
            <a href="#cashback" className={active === "cashback" ? "on" : ""}>Cashback</a>
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

        {/* 2. moneda e idioma */}
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

        {/* 3. notificaciones y perfil (por ahora no hacen nada) */}
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
        {/* HERO */}
        <div className="lx-hero">
          <div className="lx-ban" aria-hidden="true" />
          <img className="lx-orb" src="/img/ROBUX_IMG.png" alt="" aria-hidden="true" />
          <img className="lx-orb" src="/img/ROBUX_IMG.png" alt="" aria-hidden="true" />
          <img className="lx-orb" src="/img/ROBUX_IMG.png" alt="" aria-hidden="true" />
          <div className="lx-w">
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
            <Reveal delay={650} className="lx-hs">
              <input
                type="text"
                placeholder="Buscar Robux, limiteds, MM2 e ítems…"
                aria-label="Buscar en el catálogo"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </Reveal>
            <Reveal delay={800}>
              <div className="lx-tiles">
                <a className="lx-card spot lx-tile" href="#vendemos">
                  <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={55} />
                  <b>Robux</b>
                  <small>1.000 desde {money(8.5)}</small>
                </a>
                <a className="lx-card spot lx-tile" href="#top" onClick={() => setTab("MM2")}>
                  <ItemSwap items={MM2_ITEMS} size={52} />
                  <b>Armas MM2</b>
                  <small>26 godlys disponibles</small>
                </a>
                <a className="lx-card spot lx-tile" href="#top" onClick={() => setTab("Limiteds")}>
                  <span className="lx-e">💎</span>
                  <b>Limiteds</b>
                  <small>desde {money(35)}</small>
                </a>
                <a className="lx-card spot lx-tile" href="#juegos">
                  <ItemSwap items={GAME_ITEMS} size={52} delay={1300} />
                  <b>Ítems in-game</b>
                  <small>31 juegos disponibles</small>
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* TICKER */}
        <div className="lx-tick" aria-hidden="true">
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

        {/* JUEGOS */}
        <section className="lx-sec" id="juegos">
          <div className="lx-w">
            <SecHead title="Elige tu" accent="juego" text="Ítems entregados directo en el juego, pagados en tu moneda local." link="Ver todos los juegos" />
            <Reveal>
              <GameRail icons={icons} />
            </Reveal>
          </div>
        </section>

        {/* TODO LO QUE VENDEMOS */}
        <section className="lx-sec" id="vendemos">
          <div className="lx-w">
            <SecHead title="Todo lo que" accent="vendemos" text="Robux, armas MM2, Limiteds e ítems in-game. Una vitrina, cuatro mundos." link="Ver catálogo completo" />
            <Reveal>
              <div className="lx-note">
                <Flag code="co" size={20} />
                <span>
                  Precios en <b>Colombia</b> (COP), con el 30 % de impuesto de Roblox cubierto por Pixel Store.
                </span>
              </div>
              <div className="lx-bento">
                <a className="lx-card spot lx-bc lx-mm" href="#top" onClick={() => setTab("MM2")}>
                  <ItemFan items={MM2_ITEMS} />
                  <h3>Armas MM2</h3>
                  <small>
                    186 skins · desde <b>{money(0.08)}</b>
                  </small>
                  <p style={{ marginTop: 8, color: "var(--mut)", fontSize: 13, maxWidth: "45%" }}>
                    Cuchillos y armas raras de Murder Mystery 2, al mejor precio.
                  </p>
                  <span className="lx-lk">Explorar MM2 →</span>
                </a>

                <div className="lx-card spot lx-bc lx-rb">
                  <h3>Robux</h3>
                  <small>
                    Compra protegida · desde <b>{money(8.5)}</b>/1.000
                  </small>
                  <input
                    type="range"
                    min="400"
                    max="20000"
                    step="100"
                    value={robuxQty}
                    onChange={(e) => setRobuxQty(Number(e.target.value))}
                    aria-label="Cantidad de Robux"
                  />
                  <div className="lx-rr">
                    <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={32} />
                    <b>{robuxQty.toLocaleString("es-CO")}</b>
                    <span>{money(robuxQty * robuxRate)}</span>
                  </div>
                  <div className="lx-rr">
                    <b>
                      1.000 <em className="lx-tag">Popular</em>
                    </b>
                    <span>{money(8.5)}</span>
                  </div>
                  <div className="lx-rr">
                    <b>
                      20.000 <em className="lx-tag v">Mejor valor</em>
                    </b>
                    <span>{money(160)}</span>
                  </div>
                  <button className="lx-btn" style={{ width: "100%", marginTop: 16 }} onClick={() => addToCart("Robux")}>
                    Comprar Robux
                  </button>
                </div>

                <a className="lx-card spot lx-bc lx-lm" href="#top" onClick={() => setTab("Limiteds")}>
                  <h3>Limiteds 💎</h3>
                  <small>
                    8 coleccionables · desde <b>{money(35)}</b>
                  </small>
                  <span className="lx-lk">Ver coleccionables →</span>
                </a>

                <a className="lx-card spot lx-bc lx-ig" href="#juegos">
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

        {/* RANKING */}
        <section className="lx-sec" id="top">
          <div className="lx-w">
            <SecHead title="Lo que más" accent="se compra" text="El ranking real de los últimos 7 días, contado pedido por pedido." link="Ver catálogo" />
            <div className="lx-tabs" role="group" aria-label="Filtrar ranking">
              {["Todos", "MM2", "Limiteds", "In-game"].map((f) => (
                <button key={f} aria-pressed={f === tab} onClick={() => setTab(f)}>
                  {f}
                </button>
              ))}
            </div>

            <div className="lx-top">
              {filteredProducts.length === 0 ? (
                <p style={{ color: "var(--mut)" }}>No encontramos nada con esa búsqueda. Prueba otro nombre o cambia de pestaña.</p>
              ) : (
                <>
                  {featuredProduct && (
                    <div className="lx-card spot lx-big" key={featuredProduct.n}>
                      <div className="lx-im" style={{ background: `linear-gradient(160deg, ${featuredProduct.bg})` }}>
                        <span className="lx-pimg">
                          <Thumb src={featuredProduct.img} fallback={featuredProduct.e} alt={featuredProduct.n} size={170} />
                        </span>
                        <div className="lx-rk1">
                          <span className="lx-mdl">1</span>
                          <span className="lx-mdl" style={{ background: "linear-gradient(180deg,#FDE047,#F59E0B)", color: "#3A2606" }}>
                            Más vendido
                          </span>
                        </div>
                      </div>
                      <div className="lx-bd">
                        <span className="lx-tag">{featuredProduct.g}</span>
                        <h3>{featuredProduct.n}</h3>
                        <small>{featuredProduct.t}</small>
                        <div className="lx-pr">
                          <span>{money(featuredProduct.p)}</span>
                          <button className="lx-btn" onClick={() => addToCart(featuredProduct.n)}>
                            Comprar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="lx-lst">
                    {listProducts.map((x, i) => (
                      <div key={x.n + i} className="lx-card spot lx-row">
                        <span className={`lx-mdl ${["s", "c"][i] || ""}`}>{i + 2}</span>
                        <span className="lx-th" style={{ background: `linear-gradient(160deg, ${x.bg})` }}>
                          <Thumb src={x.img} fallback={x.e} alt={x.n} size={40} />
                        </span>
                        <div>
                          <b>{x.n}</b>
                          <small>
                            {x.g} · {x.t}
                          </small>
                        </div>
                        <strong>{money(x.p)}</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="lx-sec">
          <div className="lx-w">
            <h2 style={{ textAlign: "center", fontSize: "clamp(26px,3.6vw,40px)", marginBottom: 24 }}>
              <Split text="Miles" /> <Split text="confían en nosotros" grad start={1} />
            </h2>
            <Reveal>
              <div className="lx-stats">
                <div className="lx-card spot">
                  <b>
                    <CountUp to={4.9} dec={1} suf=" ★" />
                  </b>
                  <small>9.316 reseñas</small>
                </div>
                <div className="lx-card spot">
                  <b>
                    <CountUp to={140000} pre="+" />
                  </b>
                  <small>Pedidos entregados</small>
                </div>
                <div className="lx-card spot">
                  <b>2024</b>
                  <small>Operando desde</small>
                </div>
                <div className="lx-card spot">
                  <b>
                    <CountUp to={15} pre="+" />
                  </b>
                  <small>Métodos de pago</small>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CASHBACK */}
        <section className="lx-sec" id="cashback">
          <div className="lx-w">
            <div className="lx-cb">
              <div>
                <div className="lx-sh">
                  <div>
                    <h2>
                      <Split text="Cada compra te" /> <Split text="devuelve dinero" grad start={3} />
                    </h2>
                    <Reveal delay={150}>
                      <p>Comprar suma XP. Subes de rango y recibes hasta el 3 % de cada pedido como saldo, automático y sin códigos.</p>
                    </Reveal>
                  </div>
                </div>
                <Reveal delay={250}>
                  <div className="lx-card lx-vs">
                    <div>
                      <small>Gastas</small>
                      <b>$320.000</b>
                    </div>
                    <span style={{ color: "rgba(255,255,255,.35)", fontSize: 24 }}>→</span>
                    <div style={{ textAlign: "right" }}>
                      <small style={{ color: "#34D399" }}>Vuelve a tu saldo</small>
                      <b style={{ color: "#34D399" }}>+$9.600</b>
                    </div>
                    <p>Automático en cada pedido, sin códigos. Hasta 3 % según tu rango, y tu saldo sirve en cualquier compra.</p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={200}>
                <div className="lx-rks">
                  {RANKS.map((r, idx) => (
                    <div key={idx} className="lx-card spot">
                      <span className="lx-m">{r[0]}</span>
                      <p>{r[1]}</p>
                      <b>{r[2]}</b>
                      <small>{r[3]}</small>
                    </div>
                  ))}
                  <div className="lx-card spot lx-pro">
                    <span className="lx-m">⭐</span>
                    <p>Pixel Plus</p>
                    <b>5 %</b>
                    <small>Cashback fijo, sin importar tu rango</small>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* MÉTODOS DE PAGO */}
        <PaySection />

        {/* FAQ */}
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
                    <h3 style={{ fontSize: 16 }}>¿Te quedaste con dudas?</h3>
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

        {/* CTA FINAL */}
        <section className="lx-sec">
          <div className="lx-w">
            <Reveal>
              <div className="lx-cta">
                <div>
                  <h2>
                    <Split text="Tu primer pedido puede" /> <Split text="llegar hoy mismo" grad start={4} />
                  </h2>
                  <p style={{ color: "var(--mut)", margin: "14px 0 22px", maxWidth: "30em" }}>
                    Robux, MM2, Limiteds e ítems in-game al mejor precio de LATAM, con compra 100 % protegida y soporte todos los días.
                  </p>
                  <a className="lx-btn" href="#top">
                    Comprar ahora
                  </a>
                </div>
                <div className="lx-mini">
                  <a className="lx-card spot" href="#vendemos">
                    <span className="lx-e">🔷</span>Robux
                  </a>
                  <a className="lx-card spot" href="#top" onClick={() => setTab("MM2")}>
                    <ItemSwap items={MM2_ITEMS} size={36} delay={700} />Armas MM2
                  </a>
                  <a className="lx-card spot" href="#top" onClick={() => setTab("Limiteds")}>
                    <span className="lx-e">💎</span>Limiteds
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <div className="lx-foot">
        <div className="lx-w">
          <div className="lx-fg">
            <div>
              <a className="lx-logo" href="#">
                <img className="lx-logoimg" src="/img/logo-4x.png" alt="Pixel Store" />
              </a>
              <p style={{ marginTop: 12, maxWidth: "20em" }}>Compra productos de Roblox de forma segura, rápida y económica.</p>
            </div>
            <div>
              <h4>Tienda</h4>
              <ul>
                <li>Catálogo</li>
                <li>Robux</li>
                <li>Grupos</li>
                <li>Pixel Plus</li>
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
            © 2026 Pixel Store · Términos · Privacidad
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
        <a href="#cashback" className={active === "cashback" ? "on" : ""}>
          <Ico>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v10M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.8 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5" />
          </Ico>
          Cashback
        </a>
      </nav>

      <div className={`lx-toast ${showToast ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </div>
  );
}