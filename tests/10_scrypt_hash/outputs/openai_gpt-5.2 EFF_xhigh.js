const scryptUrl = "https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm";
const te = new TextEncoder();
const N = 1024, r = 8, p = 1, dkLen = 32;
let scryptP;

const getScrypt = () =>
  scryptP ??= import(scryptUrl).then(m => {
    const f = m.scrypt || m.default?.scrypt || m.default;
    if (typeof f != "function") throw Error("scrypt-js: missing scrypt export");
    return f;
  });

const toHex = u8 =>
  Array.from(u8, b => b.toString(16).padStart(2, "0")).join("");

async function hashPassword(password, salt) {
  if (typeof password != "string" || typeof salt != "string") throw TypeError("Expected (string, string)");
  const scrypt = await getScrypt();
  const key = await scrypt(te.encode(password), te.encode(salt), N, r, p, dkLen);
  return toHex(key);
}
export default hashPassword;
// Generation time: 101.462s
// Result: PASS