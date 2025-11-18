async function hashPassword(password, salt) {
  const { scrypt } = await import('https://cdn.skypack.dev/scrypt-js');
  const e = new TextEncoder();
  const pw = e.encode(password);
  const s = e.encode(salt);
  const h = await scrypt(pw, s, 1024, 8, 1, 32);
  return Array.from(h).map(b=>b.toString(16).padStart(2,'0')).join('');
}
export default hashPassword;