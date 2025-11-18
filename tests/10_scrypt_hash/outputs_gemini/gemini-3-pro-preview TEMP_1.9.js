const hashPassword = async (p, s) => {
  const { scrypt: k } = await import('https://esm.sh/scrypt-js@3.0.1')
  const e = t => new TextEncoder().encode(t)
  const r = await k(e(p), e(s), 1024, 8, 1, 32)
  return [...r].map(b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;