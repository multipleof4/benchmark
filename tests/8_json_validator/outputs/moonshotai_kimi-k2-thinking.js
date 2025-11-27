let a, c;

export const validateJSON = async (d, s) => {
  try {
    if (!a) {
      const { default: Ajv } = await import('https://esm.sh/ajv?bundle');
      a = new Ajv({ allErrors: true });
      c = new Map();
    }
    const k = JSON.stringify(s);
    if (!c.has(k)) c.set(k, a.compile(s));
    const v = c.get(k);
    const valid = v(d);
    return {
      valid,
      errors: valid ? [] : v.errors.map(e => `${e.instancePath || 'root'} ${e.message}`)
    };
  } catch (e) {
    return { valid: false, errors: [e.message] };
  }
};
export default validateJSON;
// Generation time: 19.566s
// Result: PASS