const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://cdn.skypack.dev/scrypt-js');
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);
  const hashBytes = await scrypt(passwordBytes, saltBytes, 1024, 8, 1, 32);
  return Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join('');
};
export default hashPassword;
// Generation time: 5.832s
// Result: PASS