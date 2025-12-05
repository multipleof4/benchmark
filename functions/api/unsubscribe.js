export async function onRequestPost({ request, env }) {
  const { email } = await request.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('{"error":"Invalid email"}', { status: 400, headers: { 'Content-Type': 'application/json' } });

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_TOKEN}`
    },
    body: JSON.stringify({ email, unsubscribed: true })
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(`{"error":"Resend error: ${text}"}`, { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Priority: '3', Title: `🔕 Unsubscribe` },
    body: email
  });

  return new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } });
}
