export async function analyzeSignal(yamlStr) {
  const [
    { default: yaml },
    math,
    { default: ndarray },
    { default: fft },
    { default: DOMPurify }
  ] = await Promise.all([
    import('https://esm.sh/js-yaml'),
    import('https://esm.sh/mathjs'),
    import('https://esm.sh/ndarray'),
    import('https://esm.sh/ndarray-fft'),
    import('https://esm.sh/dompurify')
  ]);

  const { sampleRate, duration, components } = yaml.load(yamlStr);
  const N = sampleRate * duration;
  const signal = new Float64Array(N);

  for (let i = 0; i < N; i++) {
    const t = i / sampleRate;
    signal[i] = components.reduce(
      (acc, { frequency, amplitude }) =>
        acc + amplitude * math.sin(2 * math.pi * frequency * t),
      0
    );
  }

  const real = ndarray(new Float64Array(signal), [N]);
  const imag = ndarray(new Float64Array(N), [N]);
  fft(1, real, imag);

  const peaks = [];
  const halfN = N / 2;

  for (let k = 0; k <= halfN; k++) {
    const mag = math.sqrt(real.get(k) ** 2 + imag.get(k) ** 2) / halfN;
    if (mag > 0.1) {
      peaks.push({
        frequencyHz: Math.round((k * sampleRate) / N),
        magnitude: Math.round(mag * 100) / 100
      });
    }
  }

  peaks.sort((a, b) => b.magnitude - a.magnitude);

  const rows = peaks
    .map(p => `<tr><td>${p.frequencyHz}</td><td>${p.magnitude}</td></tr>`)
    .join('');

  const rawHtml = `<table><tr><th>Frequency (Hz)</th><th>Magnitude</th></tr>${rows}</table>`;
  const html = DOMPurify.sanitize(rawHtml);

  return { peaks, html, signalLength: N };
}
export default analyzeSignal;
// Generation time: 16.083s
// Result: FAIL