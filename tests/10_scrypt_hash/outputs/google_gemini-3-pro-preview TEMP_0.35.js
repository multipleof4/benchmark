const hashPassword = async (p, s) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js')
  const e = new TextEncoder()
  const h = await scrypt(e.encode(p), e.encode(s), 1024, 8, 1, 32)
  return Array.from(h).map(b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;
// Generation time: 18.084s
// Result: PASS