const hashPassword = async (pwd, salt) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js')
  const enc = txt => new TextEncoder().encode(txt)
  const key = await scrypt(enc(pwd), enc(salt), 1024, 8, 1, 32)
  return Array.from(key, b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;