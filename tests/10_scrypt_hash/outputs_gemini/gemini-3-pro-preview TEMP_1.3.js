const hashPassword = async (p, s) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js@3.0.1')
  const e = new TextEncoder()
  const k = await scrypt(e.encode(p), e.encode(s), 1024, 8, 1, 32)
  return [...k].map(b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;