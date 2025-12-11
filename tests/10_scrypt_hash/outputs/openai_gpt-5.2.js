let _scryptMod
let _enc = new TextEncoder

let _getScrypt = () =>
  _scryptMod ||= import("https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm")
    .then(m => (m.scrypt && m) || m.default || m)

let _toHex = u8 =>
  Array.from(u8, b => b.toString(16).padStart(2, "0")).join("")

async function hashPassword(password, salt) {
  let { scrypt } = await _getScrypt()
  let pw = _enc.encode(password)
  let sa = _enc.encode(salt)
  let hash = await scrypt(pw, sa, 1024, 8, 1, 32)
  return _toHex(hash)
}
export default hashPassword;
// Generation time: 13.034s
// Result: PASS