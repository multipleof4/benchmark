const validateJSON = async (d, s) => {
  try {
    const Ajv = (await import('https://esm.sh/ajv@8.17.1')).default;
    const v = new Ajv({ allErrors: true }).compile(s);
    const b = v(d);
    return { 
      valid: b, 
      errors: b ? [] : v.errors.map(e => `${e.instancePath} ${e.message}`.trim()) 
    };
  } catch (e) {
    return { valid: false, errors: [e.message] };
  }
};
export default validateJSON;