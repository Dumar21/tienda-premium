"use client";
import { useEffect, useState } from "react";

const SRC: Record<string, string> = {
  PayPal: "https://cdn.simpleicons.org/paypal",
  "Cash App": "https://cdn.simpleicons.org/cashapp",
  "Apple Pay": "https://cdn.simpleicons.org/applepay",
  "Google Pay": "https://cdn.simpleicons.org/googlepay",
  "Mercado Pago": "https://cdn.simpleicons.org/mercadopago",
  "Binance Pay": "https://cdn.simpleicons.org/binance",
  Cripto: "https://cdn.simpleicons.org/bitcoin",
  Pix: "https://cdn.simpleicons.org/pix",
  Nequi: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVRYhe2XwVHDMBBFnxjfoQNmDzmTDpIS6CAuwRUEDxWEDkIHLgE6yJ2DQgemAnGIPBNirW0lcnwg/2TvSqPv1ddf2TjnmBJ3k65+IwBkAF/mdQ48n+R2M7eumhcxEhrToLLO7rRFxMgDUITmZP5lAywCc83RszYGIBcjc+tsreQL4OUktgSWqbbgkfYXDkJKDRS+1GcR0EoXg3sO2xSFRgM57RKqourASoyU1tl9FIGZW9dAecaCIWw5CGwQxvCBhRiZlABEaOFSAm/ATyD+JEbyaxCo0c9/OeRYXrwF1tkt8B1IDTKnVBrIlXivOSUhYJ39AD4DqV5zSmrFSnxFhy8kI+Db8buS1rpoch8oCR9LFUkJ+B4Q1ZDGcMINEVVITsDfigZfTkbpBR3mdB0CHvmkBDrM6Q+yvgFHKGhfy/sUn6NXogIwt3/Df0/gFwUpVv0BV1NOAAAAAElFTkSuQmCC",
  "Bre-B": "https://d1b4gd4m8561gs.cloudfront.net/sites/default/files/images/bre-b-contraforma.png",
  Bancolombia: "https://play-lh.googleusercontent.com/PBWYzRsov-VYf9CuFLf0vA4z4R2YSZjfK49O9A5bc8xuUiRSH-2D66l1vl4u1UpHJRNwBslOsJ_knDPiGaEQNm4",
  PSE: "https://images.ctfassets.net/ex6ts2p2j0ib/33ZB3pSE7aWIQ6qUTvGEid/cc6bd9d687b772c39657b0af40f174c9/banner-50__pse---new--logo.png?w=3840&q=75",
  OXXO: "https://images.squarespace-cdn.com/content/v1/643d6e522fd87b563f4d1022/1683059696422-Y7FM4DUYYN11XFZV1RGL/Asset+10OXXO.png",
  SPEI: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc75IU27hIOtTQ_Fjh8FMAgIDqoL4QkSSG03814dFlqiVQbax0HlytGnY&s=10",
  Yape: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlfDi7IRmbQvpEqzK67D_YHimFvgb4yGPfb8JWOoSVkw&s=10",
};

const FALLBACK: Record<string, string> = { Tarjeta: "💳", Transferencia: "🏦", Cripto: "₿" };

const TILE = 44;
const DEFAULT_LOGO = { size: 28, fit: "contain" as const };
const LOGO: Record<string, { size: number; fit: "contain" | "cover" }> = {
  Yape: { size: 60, fit: "cover" },
  "Bre-B": { size: 44, fit: "cover" },
  PSE: { size: 44, fit: "cover" },
  Bancolombia: { size: 44, fit: "cover" },
  OXXO: { size: 44, fit: "contain" },
  SPEI: { size: 44, fit: "contain" },
};

export default function PayLogo({ name }: { name: string }) {
  const [bad, setBad] = useState(false);
  const src = SRC[name];
  useEffect(() => setBad(false), [src]);

  const cfg = LOGO[name] ?? DEFAULT_LOGO;

  const box: React.CSSProperties = {
    width: TILE,
    height: TILE,
    borderRadius: 10,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    lineHeight: 1,
  };

  if (!src || bad) {
    return (
      <span
        aria-hidden="true"
        style={{
          ...box,
          background: "linear-gradient(140deg,#38BDF8,#2563EB)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 20,
        }}
      >
        {FALLBACK[name] ?? name.charAt(0)}
      </span>
    );
  }

  return (
    <span style={{ ...box, background: "#fff" }}>
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setBad(true)}
        style={{
          display: "block",
          flexShrink: 0,
          width: cfg.size,
          height: cfg.size,
          objectFit: cfg.fit,
          borderRadius: 0,
        }}
      />
    </span>
  );
}