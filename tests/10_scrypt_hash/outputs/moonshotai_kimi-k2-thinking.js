async function hashPassword(password, salt) {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/dist/scrypt.min.js');
  const enc = new TextEncoder();
  const buf = await scrypt(enc.encode(password), enc.encode(salt), 1024, 8, 1, 32);
  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
}
export default hashPassword;
// Generation time: 39.100s
// Result: FAIL