export async function onRequestPost({ request, env }) {
  const { email } = await request.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('{"error":"Invalid email"}', { status: 400, headers: { 'Content-Type': 'application/json' } });

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_KEY}`
    },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(`{"error":"Resend error: ${text}"}`, { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } });
}
