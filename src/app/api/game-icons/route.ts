import { connection, NextResponse } from "next/server";
import { G } from "@/lib/catalog";

const TTL = 60 * 60 * 1000;
let cache: { at: number; data: Record<string, string> } | null = null;

async function universeId(placeId: number): Promise<number | null> {
  try {
    const r = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.universeId === "number" ? j.universeId : null;
  } catch {
    return null;
  }
}

async function loadIcons(): Promise<Record<string, string>> {
  const places = G.map((g) => g.placeId).filter((p): p is number => !!p);
  const pairs = await Promise.all(places.map(async (p) => [p, await universeId(p)] as const));

  const placeByUniverse = new Map<number, number>();
  for (const [place, uni] of pairs) if (uni) placeByUniverse.set(uni, place);

  const out: Record<string, string> = {};
  if (!placeByUniverse.size) return out;

  try {
    const ids = [...placeByUniverse.keys()].join(",");
    const url = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=256x256&format=Webp&isCircular=false`;
    const r = await fetch(url);
    if (r.ok) {
      const j = await r.json();
      for (const d of j.data ?? []) {
        const place = placeByUniverse.get(d.targetId);
        if (place && d.state === "Completed" && d.imageUrl) out[String(place)] = d.imageUrl;
      }
    }
  } catch {
  }
  return out;
}

export async function GET() {
  await connection();

  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const data = await loadIcons();
  if (Object.keys(data).length) cache = { at: Date.now(), data };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}