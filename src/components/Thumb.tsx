"use client";
import { useEffect, useState } from "react";

type Props = {
  src?: string;
  fallback: string;
  alt: string;
  cover?: boolean;
  size?: number;
};

export default function Thumb({ src, fallback, alt, cover = false, size }: Props) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);

  if (!src || bad) {
    return (
      <span aria-hidden="true" style={size ? { fontSize: size * 0.8, lineHeight: 1 } : undefined}>
        {fallback}
      </span>
    );
  }

  const style: React.CSSProperties = cover
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : size
      ? {
          width: size,
          height: size,
          aspectRatio: "1 / 1",
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }
      : { width: "80%", height: "80%", aspectRatio: "1 / 1", objectFit: "contain" };

  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} style={style} />
  );
}