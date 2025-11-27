async function validateJSON(jsonObject, jsonSchema) {
  try {
    const Ajv = (await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.min.js')).default 
      || (await import('https://esm.sh/ajv@8')).default;
    
    const ajv = new Ajv({ allErrors: true, verbose: true });
    const validate = ajv.compile(jsonSchema);
    const valid = validate(jsonObject);
    
    return {
      valid,
      errors: valid ? [] : validate.errors.map(e => 
        e.instancePath 
          ? `${e.instancePath} ${e.message}` 
          : e.message
      )
    };
  } catch (e) {
    try {
      const { default: Ajv } = await import('https://esm.sh/ajv@8');
      const ajv = new Ajv({ allErrors: true, verbose: true });
      const validate = ajv.compile(jsonSchema);
      const valid = validate(jsonObject);
      
      return {
        valid,
        errors: valid ? [] : validate.errors.map(e => 
          e.instancePath 
            ? `${e.instancePath} ${e.message}` 
            : e.message
        )
      };
    } catch (err) {
      return {
        valid: false,
        errors: [`Schema validation failed: ${err.message}`]
      };
    }
  }
}
export default validateJSON;
// Generation time: 5.496s
// Result: PASS