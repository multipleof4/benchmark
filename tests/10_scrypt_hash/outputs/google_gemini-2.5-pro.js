const hashPassword = async (password, salt) => {
  const { scrypt } = await import('https://esm.sh/scrypt-js@3.0.1');

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
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
export default hashPassword;