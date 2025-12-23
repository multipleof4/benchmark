async function hashPassword(password, salt) {
  const scrypt = (await import("https://cdnjs.cloudflare.com/ajax/libs/scrypt-js/0.0.2/index.js")).scrypt;
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);
  const derivedKey = await scrypt(passwordBytes, saltBytes, 1024, 8, 1, 32);
  return Array.from(derivedKey)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
export default hashPassword;
// Generation time: 3.507s
// Result: FAIL