export async function hexchain(tomlString) {
  const [smol, sr, ss, ajvMod, tt, dp] = await Promise.all(
    ['smol-toml', 'seedrandom', 'simple-statistics', 'ajv', 'text-table', 'dompurify']
      .map(lib => import(`https://esm.sh/${lib}`))
  );

  const parse = smol.parse || smol.default?.parse || smol.default;
  const seedrandom = sr.default || sr;
  const Ajv = ajvMod.default || ajvMod;
  const table = tt.default || tt;
  const DOMPurify = dp.default || dp;

  const config = parse(tomlString);
  const ajv = new Ajv();

  const valid = ajv.validate({
    type: 'object',
    required: ['seed', 'count', 'label'],
    properties: {
      seed: { type: 'string' },
      count: { type: 'integer', minimum: 1, maximum: 10000 },
      label: { type: 'string', minLength: 1 }
    }
  }, config);

  if (!valid) {
    return { valid: false, errors: ajv.errorsText() };
  }

  const rng = new seedrandom(config.seed);
  const data = Array.from({ length: config.count }, () => rng());

  const mean = +ss.mean(data).toFixed(6);
  const stddev = +ss.standardDeviation(data).toFixed(6);
  const median = +ss.median(data).toFixed(6);

  const tableStr = table([
    ['Stat', 'Value'],
    ['mean', String(mean)],
    ['stddev', String(stddev)],
    ['median', String(median)]
  ]);

  const sanitizedHTML = DOMPurify.sanitize(`<pre class="stats">${tableStr}</pre>`);

  return {
    valid: true,
    label: config.label,
    stats: { mean, stddev, median },
    table: sanitizedHTML,
    count: config.count
  };
}
export default hexchain;
// Generation time: 24.452s
// Result: PASS