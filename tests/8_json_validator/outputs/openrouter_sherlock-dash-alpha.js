async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://cdn.skypack.dev/ajv@8');
  const ajv = new Ajv({ allErrors: true, verbose: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid,
    errors: valid ? [] : ajv.errors?.map(e => 
      `${e.instancePath || 'data'}: ${e.message} (${e.params?.type || e.schema})`
    ) || []
  };
}
export default validateJSON;