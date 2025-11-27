async function hashPassword(p, s) {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm')
  const e = new TextEncoder()
  const h = await scrypt(e.encode(p), e.encode(s), 1024, 8, 1, 32)
  return [...h].map(b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;
// Generation time: 2.609s
// Result: PASS