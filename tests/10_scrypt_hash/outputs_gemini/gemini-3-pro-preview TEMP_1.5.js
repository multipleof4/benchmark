const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://unpkg.com/scrypt-js@3.0.1/scrypt.js')
  const enc = str => new TextEncoder().encode(str)
  const buf = await scrypt(enc(password), enc(salt), 1024, 8, 1, 32)
  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;