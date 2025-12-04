export async function onRequestPost({ request, env }) {
  const { email } = await request.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('{"error":"Invalid email"}', { status: 400, headers: { 'Content-Type': 'application/json' } });

  await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Priority: '3', Title: `🔕 Unsubscribe` },
    body: email
  });
  
  return new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } });
}
