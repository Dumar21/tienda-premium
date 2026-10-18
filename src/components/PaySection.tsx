"use client";
import React, { useState, useEffect, useRef } from "react";
import Flag from "@/components/Flag";
import PayLogo from "@/components/PayLogo";

const PAY: Record<string, [string, string[]]> = {
  Colombia: ["co", ["Nequi", "Bre-B", "Bancolombia", "PSE", "Tarjeta"]],
  México: ["mx", ["OXXO", "SPEI", "Mercado Pago", "Tarjeta"]],
  Argentina: ["ar", ["Mercado Pago", "Transferencia", "Tarjeta"]],
  Perú: ["pe", ["Yape", "Transferencia", "Tarjeta"]],
  Brasil: ["br", ["Pix", "Transferencia", "Tarjeta"]],
  "Todo el mundo": ["🌎", ["PayPal", "Cash App", "Cripto", "Binance Pay", "Apple Pay", "Google Pay"]],
};

/* mismas animaciones que la home (copiadas para que este archivo sea independiente) */
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, on] = useIn<HTMLDivElement>();
  return (
    <div ref={ref} className={`lx-rv ${on ? "in" : ""}`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
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

export default function PaySection() {
  const [country, setCountry] = useState("Colombia");
  const [code, methods] = PAY[country];

  return (
    <section className="lx-sec" id="pagos">
      <div className="lx-w">
        <div className="lx-sh c">
          <div>
            <h2>
              <Split text="Paga como" /> <Split text="pagas siempre" grad start={2} />
            </h2>
            <Reveal delay={150}>
              <p>Métodos locales de cada país de LATAM, sin tarjeta internacional ni vueltas raras.</p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="lx-tabs c" role="tablist" aria-label="Elige tu país">
            {Object.keys(PAY).map((c) => (
              <button key={c} role="tab" aria-selected={c === country} aria-pressed={c === country} onClick={() => setCountry(c)}>
                <Flag code={PAY[c][0]} size={20} />
                {c}
              </button>
            ))}
          </div>

          <div className="lx-card spot lx-pay" key={country}>
            <div className="lx-payhd">
              <Flag code={code} size={44} />
              <h3>{country}</h3>
            </div>

            <div className="lx-mt">
              {methods.map((m, i) => (
                <div key={m} style={{ "--i": i } as React.CSSProperties}>
                  <PayLogo name={m} />
                  {m}
                </div>
              ))}
            </div>

            <p className="lx-paynote">Pagos procesados con proveedores verificados. Nunca pedimos tu contraseña de Roblox.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}