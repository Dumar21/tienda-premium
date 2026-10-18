"use client";

import React, { useState, useEffect } from "react";
import { G, P, ROBUX_IMG } from "@/lib/catalog";
import { useGameIcons } from "@/lib/useGameIcons";
import Thumb from "@/components/Thumb";
import GameRail from "@/components/GameRail";

const PAY: Record<string, [string, string[]]> = {
  Colombia: ["🇨🇴", ["Nequi", "Bre-B", "Bancolombia", "PSE", "Tarjeta"]],
  México: ["🇲🇽", ["OXXO", "SPEI", "Mercado Pago", "Tarjeta"]],
  Argentina: ["🇦🇷", ["Mercado Pago", "Transferencia", "Tarjeta"]],
  Perú: ["🇵🇪", ["Yape", "Transferencia", "Tarjeta"]],
  Brasil: ["🇧🇷", ["Pix", "Transferencia", "Tarjeta"]],
  "Todo el mundo": ["🌎", ["PayPal", "Cash App", "Cripto", "Binance Pay", "Apple Pay", "Google Pay"]],
};

const FAQ_ITEMS = [
  ["¿Cuáles son los métodos de entrega?", "Con Gamepass creas un pase en tu juego, nosotros cubrimos el 30 % de impuesto y tus Robux llegan a transacciones pendientes en 5 días. Con Grupo te unes a uno de nuestros grupos y la espera estándar es de 14 días."],
  ["¿Cuánto tarda la entrega de Robux?", "Normalmente entre 15 minutos y 24 horas. En casos excepcionales puede llegar a 48 horas y siempre te avisamos en la página."],
  ["¿Necesitan mi contraseña?", "Nunca. Solo necesitamos tu nombre de usuario de Roblox para entregarte los Robux."],
  ["¿Qué métodos de pago aceptan?", "Pagos locales en Colombia, México, Argentina, Perú y Brasil. Desde otros países, con cripto o tarjeta."],
  ["¿Cómo funciona el cashback y el saldo?", "Cada compra suma cashback según tu rango y se acumula como saldo. Lo usas para pagar total o parcialmente tus próximas compras al instante."],
];

export default function Home() {
  const icons = useGameIcons();
  const [cur, setCur] = useState("COP");
  const [cart, setCart] = useState(0);
  const [tab, setTab] = useState("Todos");
  const [q, setQ] = useState("");
  const [robuxQty, setRobuxQty] = useState(5000);
  const [payCountry, setPayCountry] = useState("Colombia");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const RATE = 3300;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1800);
  };

  const addToCart = (itemName: string) => {
    setCart((prev) => prev + 1);
    triggerToast(`${itemName} agregado al carrito`);
  };

  const money = (u: number) => {
    if (cur === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(u * RATE);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(u);
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
    <>
      <header id="hd" className={headerScrolled ? "on" : ""}>
        <div className="bar">
          <button className="ib" aria-label="Menú">
            ☰
          </button>
          <a className="logo" href="#">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <rect x="2" y="10" width="26" height="17" rx="4" fill="#22D3EE" />
              <circle cx="9" cy="6.5" r="3.2" fill="#818CF8" />
              <circle cx="21" cy="6.5" r="3.2" fill="#818CF8" />
            </svg>
            Ladrillo
          </a>
          <nav className="nav">
            <a href="#juegos">Juegos</a>
            <a href="#vendemos">Servicios</a>
            <a href="#top">Más vendidos</a>
            <a href="#cashback">Cashback</a>
          </nav>
          <div className="sb">
            <input
              type="search"
              className="q"
              placeholder="Buscar Robux, limiteds, MM2 e ítems…"
              aria-label="Buscar"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          </div>
          <button
            className="pill"
            id="cur"
            onClick={() => setCur((prev) => (prev === "COP" ? "USD" : "COP"))}
          >
            {cur === "COP" ? "🇨🇴 COP" : "🇺🇸 USD"}
          </button>
          <button className="pill" id="cart">
            Carrito<span className="cnt">{cart}</span>
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <div className="hero">
          <div className="ban" aria-hidden="true" />
          <div className="w">
            <span className="badge">
              <s>★★★★★</s>
              <b>4,9</b>9.316 reseñas verificadas
            </span>
            <h1>
              Compra Robux e ítems <span className="g">baratos y seguros</span>
            </h1>
            <p className="sub">
              Robux, armas MM2, Limiteds e ítems in-game al mejor precio de LATAM, con +140.000 pedidos entregados.
            </p>
            <div className="hs">
              <input
                type="search"
                className="q"
                placeholder="Buscar Robux, limiteds, MM2 e ítems…"
                aria-label="Buscar en el catálogo"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="tiles">
              <a className="card tile" href="#vendemos">
                <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={55} />
                <b>Robux</b>
                <small>1.000 desde {money(8.5)}</small>
              </a>
              <a className="card tile" href="#top" onClick={() => setTab("MM2")}>
                <span className="e">🗡️</span>
                <b>Armas MM2</b>
                <small>26 godlys disponibles</small>
              </a>
              <a className="card tile" href="#top" onClick={() => setTab("Limiteds")}>
                <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={55} />
                <b>Limiteds</b>
                <small>desde {money(35)}</small>
              </a>
              <a className="card tile" href="#juegos">
                <span className="e">🎮</span>
                <b>Ítems in-game</b>
                <small>31 juegos disponibles</small>
              </a>
            </div>
          </div>
        </div>

        {/* TICKER / BANNER */}
        <div className="tick" aria-hidden="true">
          <div className="tk">
            {[
              ["Go******", "Duskwing bundle", "hace 5 min"],
              ["Ow****", "Robux", "hace 13 min"],
              ["an******", "2x Mastery", "hace 1 h"],
              ["ch*****", "Robux", "hace 27 min"],
              ["Lo******", "Bat bundle", "hace 1 h"],
              ["Xx******", "Robux", "hace 29 min"],
              ["Ee*****", "Spooky skin case 3x", "hace 2 h"],
              ["ne******", "Robux", "hace 43 min"],
            ].concat([
              ["Go******", "Duskwing bundle", "hace 5 min"],
              ["Ow****", "Robux", "hace 13 min"],
              ["an******", "2x Mastery", "hace 1 h"],
              ["ch*****", "Robux", "hace 27 min"],
              ["Lo******", "Bat bundle", "hace 1 h"],
              ["Xx******", "Robux", "hace 29 min"],
              ["Ee*****", "Spooky skin case 3x", "hace 2 h"],
              ["ne******", "Robux", "hace 43 min"],
            ]).map((t, idx) => (
              <div key={idx}>
                <i />
                <span>
                  <b>{t[0]}</b> compró <em>{t[1]}</em>
                </span>
                <u>{t[2]}</u>
              </div>
            ))}
          </div>
        </div>

        {/* JUEGOS SECTION */}
        <section className="sec" id="juegos" style={{ paddingBottom: "8px" }}>
          <div className="w">
            <div className="sh" style={{ "--bar": "#A78BFA", "--bc": "#C4B5FD" } as React.CSSProperties}>
              <div>
                <i />
                <h2>Elige tu juego</h2>
                <p>Ítems entregados directo en el juego, pagados en tu moneda local.</p>
              </div>
              <a className="more" href="#top">
                Ver todos los juegos
              </a>
            </div>
            <GameRail icons={icons} />
          </div>
        </section>

        {/* TODO LO QUE VENDEMOS */}
        <section className="sec" id="vendemos">
          <div className="w">
            <div className="sh" style={{ "--bar": "#60A5FA", "--bc": "#93C5FD" } as React.CSSProperties}>
              <div>
                <i />
                <h2>Todo lo que vendemos</h2>
                <p>Robux, armas MM2, Limiteds e ítems in-game. Una vitrina, cuatro mundos.</p>
              </div>
              <a className="more" href="#top">
                Ver catálogo completo
              </a>
            </div>
            <div className="note">
              🇨🇴
              <span>
                Precios en <b>Colombia</b> (COP), con el 30 % de impuesto de Roblox cubierto por Ladrillo.
              </span>
            </div>
            <div className="bento">
              {/* MM2 Card */}
              <a className="card bc mm" href="#top" onClick={() => setTab("MM2")}>
                <div className="fan">
                  <span>🗡️</span>
                  <span>🔪</span>
                  <span>🪓</span>
                </div>
                <div className="t">
                  <h3>Armas MM2</h3>
                  <small>
                    186 skins · desde <b>{money(0.08)}</b>
                  </small>
                  <p style={{ marginTop: "8px", color: "var(--mut)", fontSize: "13px" }}>
                    Cuchillos y armas raras de Murder Mystery 2, al mejor precio.
                  </p>
                  <span className="lk">Explorar MM2</span>
                </div>
              </a>

              {/* Limiteds Card */}
              <a className="card bc lm" href="#top" onClick={() => setTab("Limiteds")}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3>Limiteds</h3>
                    <small>
                      8 coleccionables · desde <b>{money(35)}</b>
                    </small>
                  </div>
                  <span className="ib">💎</span>
                </div>
              </a>

              {/* Robux Calculator Card */}
              <div className="card bc rb">
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
                <div className="rr">
                 <Thumb src={ROBUX_IMG} fallback="🔷" alt="Robux" size={32} />
                  <b>{robuxQty.toLocaleString("es-CO")}</b>
                  <span>{money(robuxQty * robuxRate)}</span>
                </div>
                <div className="rr">
                  <b>
                    1.000
                    <em className="tag" style={{ fontStyle: "normal" }}>
                      Popular
                    </em>
                  </b>
                  <span>{money(8.5)}</span>
                </div>
                <div className="rr">
                  <b>
                    20.000
                    <em className="tag v" style={{ fontStyle: "normal" }}>
                      Mejor valor
                    </em>
                  </b>
                  <span>{money(160)}</span>
                </div>
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: "14px" }}
                  onClick={() => addToCart("Robux")}
                >
                  Comprar Robux
                </button>
              </div>

              {/* Ítems in-game Card */}
              <a className="card bc ig" href="#juegos">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3>Ítems in-game</h3>
                    <small>
                      31 juegos · desde <b>{money(0.09)}</b>
                    </small>
                  </div>
                  <span className="ib">🎮</span>
                </div>
                <div className="igr">
                  {G.slice(1, 5).map((g, idx) => (
                    <div
                      key={idx}
                      style={{ background: `linear-gradient(160deg, ${g.gradient})` }}
                    >
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
          </div>
        </section>

        {/* RANKING / PRODUCTOS */}
        <section className="sec" id="top" style={{ paddingTop: "8px" }}>
          <div className="w">
            <div className="sh" style={{ "--bar": "#FBBF24", "--bc": "#FCD34D" } as React.CSSProperties}>
              <div>
                <i />
                <h2>Lo que más se compra</h2>
                <p>El ranking real de los últimos 7 días, contado pedido por pedido.</p>
              </div>
              <a className="more" href="#top">
                Ver catálogo
              </a>
            </div>
            <div className="tabs" role="group" aria-label="Filtrar ranking">
              {["Todos", "MM2", "Limiteds", "In-game"].map((f) => (
                <button
                  key={f}
                  aria-pressed={f === tab}
                  onClick={() => setTab(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="top-grid">
              {filteredProducts.length === 0 ? (
                <p style={{ color: "var(--mut)" }}>
                  No encontramos nada con esa búsqueda. Prueba otro nombre o cambia de pestaña.
                </p>
              ) : (
                <>
                  {/* Big Featured Item */}
                  {featuredProduct && (
                    <div className="card big">
                      <div
                        className="im"
                        style={{ background: `linear-gradient(160deg, ${featuredProduct.bg})` }}
                      >
                        {featuredProduct.e}
                        <div className="rk1">
                          <span className="mdl">1</span>
                          <span
                            className="mdl"
                            style={{
                              background: "linear-gradient(180deg, #FDE047, #F59E0B)",
                              height: "28px",
                            }}
                          >
                            Más vendido
                          </span>
                        </div>
                      </div>
                      <div className="bd">
                        <span className="tag">{featuredProduct.g}</span>
                        <h3 style={{ marginTop: "8px" }}>{featuredProduct.n}</h3>
                        <small style={{ color: "var(--mut)" }}>{featuredProduct.t}</small>
                        <div className="pr">
                          <span>{money(featuredProduct.p)}</span>
                          <button className="btn" onClick={() => addToCart(featuredProduct.n)}>
                            Comprar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* List Items */}
                  <div className="lst">
                    {listProducts.map((x, i) => {
                      const medalClasses = ["s", "c"];
                      const medalClass = medalClasses[i] || "n";
                      return (
                        <div key={i} className="card row lift">
                          <span className={`mdl ${medalClass}`}>{i + 2}</span>
                          <span
                            className="th"
                            style={{ background: `linear-gradient(160deg, ${x.bg})` }}
                          >
                            {x.e}
                          </span>
                          <div>
                            <b>{x.n}</b>
                            <small>
                              {x.g} · {x.t}
                            </small>
                          </div>
                          <strong>{money(x.p)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="sec" style={{ paddingTop: "8px" }}>
          <div className="w">
            <h2 style={{ textAlign: "center", fontSize: "clamp(24px, 3.4vw, 36px)", fontWeight: 800, marginBottom: "24px" }}>
              Miles <span style={{ color: "#60A5FA" }}>confían</span> en nosotros
            </h2>
            <div className="stats">
              <div>
                <i />
                <span>
                  <b>4,9 ★</b>
                  <small>9.316 reseñas</small>
                </span>
              </div>
              <div>
                <i />
                <span>
                  <b>+140.000</b>
                  <small>Pedidos entregados</small>
                </span>
              </div>
              <div>
                <i />
                <span>
                  <b>2024</b>
                  <small>Operando desde</small>
                </span>
              </div>
              <div>
                <i />
                <span>
                  <b>+15</b>
                  <small>Métodos de pago</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CASHBACK */}
        <section className="sec" id="cashback">
          <div className="w">
            <div className="cb-grid">
              <div>
                <div className="sh" style={{ "--bar": "#34D399", marginBottom: "24px" } as React.CSSProperties}>
                  <div>
                    <i />
                    <h2>
                      Cada compra te <span style={{ color: "#34D399" }}>devuelve dinero</span>
                    </h2>
                    <p>
                      Comprar suma XP. Subes de rango y recibes hasta el 3 % de cada pedido como saldo, automático y sin códigos.
                    </p>
                  </div>
                </div>
                <div className="card vs">
                  <div>
                    <small>Gastas</small>
                    <b>$320.000</b>
                  </div>
                  <span style={{ color: "rgba(255,255,255,.3)", fontSize: "22px" }}>→</span>
                  <div style={{ textAlign: "right" }}>
                    <small style={{ color: "#34D399" }}>Vuelve a tu saldo</small>
                    <b style={{ color: "#34D399", fontSize: "32px" }}>+$9.600</b>
                  </div>
                  <p>
                    Automático en cada pedido, sin códigos. Hasta 3 % según tu rango, y tu saldo sirve en cualquier compra.
                  </p>
                </div>
              </div>

              <div className="rks">
                {[
                  ["🥉", "Bronce", "1 %", "Desde el inicio"],
                  ["🥈", "Plata", "1,5 %", "Desde $32.000"],
                  ["🥇", "Oro", "2 %", "Desde $96.000"],
                  ["🏆", "Platino", "2,5 %", "Desde $210.000"],
                  ["💠", "Diamante", "3 %", "Desde $390.000"],
                ].map((r, idx) => (
                  <div key={idx} className="card lift">
                    <span className="m">{r[0]}</span>
                    <p>{r[1]}</p>
                    <b>{r[2]}</b>
                    <small>{r[3]}</small>
                  </div>
                ))}
                <div className="card pro lift">
                  <span className="m">⭐</span>
                  <p>Ladrillo Plus</p>
                  <b>5 %</b>
                  <small>Cashback fijo, sin importar tu rango</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MÉTODOS DE PAGO */}
        <section className="sec" id="pagos" style={{ paddingTop: "8px" }}>
          <div className="w">
            <div className="sh" style={{ "--bar": "#2DD4BF", textAlign: "center", justifyContent: "center" } as React.CSSProperties}>
              <div>
                <i style={{ margin: "0 auto 12px" }} />
                <h2>Paga como pagas siempre</h2>
                <p style={{ margin: "10px auto 0" }}>
                  Métodos locales de cada país de LATAM, sin tarjeta internacional ni vueltas raras.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="cc" role="tablist" aria-label="Elige tu país">
                {Object.keys(PAY).map((country) => (
                  <button
                    key={country}
                    role="tab"
                    aria-pressed={country === payCountry}
                    onClick={() => setPayCountry(country)}
                  >
                    {PAY[country][0]} {country}
                  </button>
                ))}
              </div>
            </div>

            <div className="card pay">
              <div className="fl">
                <span>{PAY[payCountry]?.[0]}</span>
                {payCountry}
              </div>
              <div className="mt">
                {PAY[payCountry]?.[1].map((m, idx) => (
                  <div key={idx}>
                    <i>{m.charAt(0)}</i>
                    {m}
                  </div>
                ))}
              </div>
              <p style={{ textAlign: "center", marginTop: "24px", color: "var(--mut)", fontSize: "14px" }}>
                Pagos procesados con proveedores verificados. Nunca pedimos tu contraseña de Roblox.
              </p>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <section className="sec" id="faq" style={{ paddingTop: "8px" }}>
          <div className="w">
            <div className="faq-grid">
              <div>
                <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", fontWeight: 800 }}>
                  Preguntas <span className="g">frecuentes</span>
                </h2>
                <p style={{ color: "var(--mut)", marginTop: "12px" }}>
                  ¿Más dudas? Escríbenos y te respondemos al instante, todos los días.
                </p>
                <div className="card sup">
                  <h3 style={{ fontSize: "16px" }}>¿Te quedaste con dudas?</h3>
                  <p>El soporte humano responde en minutos, todos los días.</p>
                  <button className="btn">Hablar con soporte</button>
                </div>
              </div>

              <div>
                {FAQ_ITEMS.map((f, i) => (
                  <details key={i} open={i === 0}>
                    <summary>{f[0]}</summary>
                    <p>{f[1]}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="sec" style={{ paddingTop: "8px" }}>
          <div className="w">
            <div className="cta-grid">
              <div>
                <h2>
                  Tu primer pedido puede <span className="g">llegar hoy mismo</span>
                </h2>
                <p style={{ color: "var(--mut)", margin: "14px 0 22px", maxWidth: "30em" }}>
                  Robux, MM2, Limiteds e ítems in-game al mejor precio de LATAM, con compra 100 % protegida y soporte todos los días.
                </p>
                <a className="btn" href="#top">
                  Comprar ahora
                </a>
              </div>
              <div className="mini">
                <a className="card" href="#vendemos">
                  <span className="e">🔷</span>Robux
                </a>
                <a className="card" href="#top" onClick={() => setTab("MM2")}>
                  <span className="e">🗡️</span>Armas MM2
                </a>
                <a className="card" href="#top" onClick={() => setTab("Limiteds")}>
                  <span className="e">💎</span>Limiteds
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="w">
          <div className="fg">
            <div>
              <a className="logo" href="#">
                🧱 Ladrillo
              </a>
              <p style={{ marginTop: "12px", maxWidth: "20em" }}>
                Compra productos de Roblox de forma segura, rápida y económica.
              </p>
            </div>
            <div>
              <h4>Tienda</h4>
              <ul>
                <li>Catálogo</li>
                <li>Robux</li>
                <li>Grupos</li>
                <li>Ladrillo Plus</li>
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
          <p className="fine">
            © 2026 Ladrillo · Términos · Privacidad
            <br />
            Servicio independiente. No estamos afiliados, asociados ni respaldados por Roblox Corporation. Todas las marcas pertenecen a sus respectivos propietarios.
          </p>
        </div>
      </footer>

      {/* CHAT FLOTANTE & NAVEGACIÓN MÓVIL */}
      <button className="chat" aria-label="Abrir chat de soporte">
        💬
      </button>

      <nav className="bn" aria-label="Navegación">
        <a className="on" href="#">
          <span>🏠</span>Inicio
        </a>
        <a href="#top">
          <span>🧾</span>Pedidos
        </a>
        <a href="#vendemos">
          <span>🛒</span>Catálogo
        </a>
        <button>
          <span>💬</span>Mensajes
        </button>
        <a href="#faq">
          <span>👤</span>Mi cuenta
        </a>
      </nav>

      {/* TOAST DE NOTIFICACIÓN */}
      <div className={`toast ${showToast ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </>
  );
}
