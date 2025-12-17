const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.1.7/+esm');
  const encoder = new TextEncoder();
  
  const derivedKey = await scrypt(
    encoder.encode(password),
    encoder.encode(salt),
    1024,
    8,
    1,
    32
  );

  return Array.from(derivedKey, byte => byte.toString(16).padStart(2, '0')).join('');
};
export default hashPassword;
// Generation time: 9.228s
// Result: FAIL