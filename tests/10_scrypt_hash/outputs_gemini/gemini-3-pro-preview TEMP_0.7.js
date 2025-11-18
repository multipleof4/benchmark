const hashPassword = async (pwd, salt) => {
  const { scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm');
  const e = new TextEncoder();
  const h = await scrypt(e.encode(pwd), e.encode(salt), 1024, 8, 1, 32);
  return Array.from(h, b => b.toString(16).padStart(2, '0')).join('');
};
export default hashPassword;