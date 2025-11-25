const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/scrypt.min.js')
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)
  const saltBytes = encoder.encode(salt)

  const hashBytes = await scrypt(passwordBytes, saltBytes, 1024, 8, 1, 32)
  return Array.from(hashBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
export default hashPassword;