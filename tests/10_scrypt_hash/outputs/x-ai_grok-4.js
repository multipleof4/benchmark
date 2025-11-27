async function hashPassword(password, salt) {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/index.js');
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);
  const hashBytes = await scrypt(passwordBytes, saltBytes, 1024, 8, 1, 32);
  return Array.from(hashBytes, byte => byte.toString(16).padStart(2, '0')).join('').toLowerCase();
}
export default hashPassword;
// Generation time: 12.779s
// Result: FAIL