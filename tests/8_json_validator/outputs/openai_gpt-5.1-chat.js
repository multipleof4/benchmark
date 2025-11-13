async function validateJSON(o, s) {
  const { default: Ajv } = await import('https://esm.sh/ajv@8');
  const a = new Ajv({ allErrors: true });
  const v = a.compile(s);
  const ok = v(o);
  return { valid: ok, errors: ok ? [] : v.errors.map(e => e.message) };
}
export default validateJSON;