const J = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });

export async function onRequestGet({ request, env }) {
  const code = new URL(request.url).searchParams.get("code") || "";
  if (code.length < 8 || code.length > 64) return J({ error: "invalid code" }, 400);
  const raw = await env.EJIAN_KV.get("sync:" + code);
  return J(raw ? JSON.parse(raw) : null);
}

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return J({ error: "bad json" }, 400); }
  const { code, db, ts } = b || {};
  if (typeof code !== "string" || code.length < 8 || code.length > 64) return J({ error: "invalid code" }, 400);
  const payload = JSON.stringify({ db: db && typeof db === "object" ? db : {}, ts: +ts || Date.now() });
  if (payload.length > 60000) return J({ error: "too large" }, 413);
  await env.EJIAN_KV.put("sync:" + code, payload);
  return J({ ok: true });
}
