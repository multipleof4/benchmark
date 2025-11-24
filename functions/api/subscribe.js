export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const { email } = await request.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const cf = request.cf || {};
  const geo = [cf.city, cf.region, cf.country].filter(Boolean).join(', ') || 'Unknown';
  await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Priority: '3', Title: `New sub: ${geo}` },
    body: email
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
