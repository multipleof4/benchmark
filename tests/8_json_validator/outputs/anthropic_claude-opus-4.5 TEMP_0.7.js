async function validateJSON(jsonObject, jsonSchema) {
  const { default: Ajv } = await import("https://esm.sh/ajv@8");
  const { default: addFormats } = await import("https://esm.sh/ajv-formats@3");
  
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  
  const validate = ajv.compile(jsonSchema);
  const valid = validate(jsonObject);
  
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => 
      e.instancePath ? `${e.instancePath} ${e.message}` : e.message
    )
  };
}
export default validateJSON;