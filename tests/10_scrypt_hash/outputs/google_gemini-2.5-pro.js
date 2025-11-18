const hashPassword = async (password, salt) => {
  const { default: scrypt } = await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/scrypt.min.js');

  const encoder = new TextEncoder();

  const hashBytes = await scrypt(
    encoder.encode(password),
    encoder.encode(salt),
    1024,
    8,
    1,
    32
  );

  return [...hashBytes]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};
export default hashPassword;