const hashPassword = async (pwd, salt) => {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/scrypt.js')
  const enc = new TextEncoder()
  const key = await scrypt(enc.encode(pwd), enc.encode(salt), 1024, 8, 1, 32)
  return [...key].map(b => (b + 256).toString(16).slice(1)).join('')
}
export default hashPassword;