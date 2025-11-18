const hashPassword = async (pwd, salt) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js')
  const e = new TextEncoder()
  const h = await scrypt(e.encode(pwd), e.encode(salt), 1024, 8, 1, 32)
  return [...h].map(v => v.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;