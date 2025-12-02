let _scrypt;

export async function hashPassword(password, salt) {
  if (!_scrypt) {
    const mod = await import('https://cdn.skypack.dev/scrypt-js');
    _scrypt = mod.default || mod.scrypt;
  }
  const hash = await _scrypt(new TextEncoder().encode(password), new TextEncoder().encode(salt), {
    N: 1024,
    r: 8,
    p: 1,
    dkLen: 32
  });
  return [...hash].map(b => b.toString(16).padStart(2, '0')).join('');
}
export default hashPassword;
// Generation time: 17.866s
// Result: FAIL