const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js')
  const encoder = new TextEncoder()
  const buffer = await scrypt(
    encoder.encode(password), 
    encoder.encode(salt), 
    1024, 8, 1, 32
  )
  return [...buffer].map(b => b.toString(16).padStart(2, '0')).join('')
}
export default hashPassword;