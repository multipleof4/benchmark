async function hashPassword(password, salt) {
  const { scrypt } = await import('https://cdn.skypack.dev/scrypt-js');
  const encoder = new TextEncoder();
  const pwBuf = encoder.encode(password);
  const saltBuf = encoder.encode(salt);
  const hashBuf = await scrypt(pwBuf, saltBuf, 1024, 8, 1, 32);
  return Array.from(hashBuf).map(b => b.toString(16).padStart(2, '0')).join('');
}
export default hashPassword;