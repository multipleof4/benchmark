async function hashPassword(password, salt) {
  const { default: scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/index.js');
  const e = new TextEncoder();
  const p = e.encode(password);
  const s = e.encode(salt);
  const h = await scrypt(p, s, 1024, 8, 1, 32);
  return [...h].map(b => b.toString(16).padStart(2, '0')).join('');
}
export default hashPassword;