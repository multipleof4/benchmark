const enc = new TextEncoder;
let scryptLoader;
const hashPassword = async (password, salt) => {
  scryptLoader ||= import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm').then(({ scrypt }) => scrypt);
  const scrypt = await scryptLoader;
  const hash = await scrypt(enc.encode(password), enc.encode(salt), 1024, 8, 1, 32);
  return [...hash].map(v => v.toString(16).padStart(2, '0')).join('');
};
export default hashPassword;