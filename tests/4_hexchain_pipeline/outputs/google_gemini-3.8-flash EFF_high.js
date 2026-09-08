export async function hexchain(tomlStr) {
  const cdn = 'https://esm.sh/';
  const [
    { parse },
    { default: seedrandom },
    { mean: getMean, standardDeviation: getStd, median: getMedian },
    { default: Ajv },
    { default: textTable },
    { default: DOMPurify }
  ] = await Promise.all([
    import(`${cdn}smol-toml`),
    import(`${cdn}seedrandom`),
    import(`${cdn}simple-statistics`),
    import(`${cdn}ajv`),
    import(`${cdn}text-table`),
    import(`${cdn}dompurify`)
  ]);

  const config = parse(tomlStr);
  const ajv = new Ajv();
  const schema = {
    type: 'object',
    required: ['seed', 'count', 'label'],
    properties: {
      seed: { type: 'string' },
      count: { type: 'integer', minimum: 1, maximum: 10000 },
      label: { type: 'string', minLength: 1 }
    }
  };

  if (!ajv.validate(schema, config)) {
    return { valid: false, errors: ajv.errorsText() };
  }

  const rng = new seedrandom(config.seed);
  const nums = Array.from({ length: config.count }, () => rng());
  const round = fn => +fn(nums).toFixed(6);

  const mean = round(getMean);
  const stddev = round(getStd);
  const median = round(getMedian);

  const tableStr = textTable([
    ['Stat', 'Value'],
    ['mean', String(mean)],
    ['stddev', String(stddev)],
    ['median', String(median)]
  ]);

  const table = DOMPurify.sanitize(`<pre class="stats">${tableStr}</pre>`);

  return {
    valid: true,
    label: config.label,
    stats: { mean, stddev, median },
    table,
    count: config.count
  };
}
export default hexchain;
// Generation time: 57.013s
// Result: PASS