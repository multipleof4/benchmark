export async function analyzeSignal(yamlString) {
  const [yaml, math, ndarray, fft, DOMPurify] = (
    await Promise.all([
      import('https://esm.sh/js-yaml'),
      import('https://esm.sh/mathjs'),
      import('https://esm.sh/ndarray'),
      import('https://esm.sh/ndarray-fft'),
      import('https://esm.sh/dompurify')
    ])
  ).map(m => m.default ?? m);

  const { sampleRate, duration, components } = yaml.load(yamlString);
  const N = sampleRate * duration;
  const halfN = N / 2;

  const signal = Float64Array.from({ length: N }, (_, i) => {
    const t = i / sampleRate;
    return components.reduce(
      (sum, { frequency, amplitude }) => sum + amplitude * math.sin(2 * math.pi * frequency * t),
      0
    );
  });

  const real = ndarray(signal, [N]);
  const imag = ndarray(new Float64Array(N), [N]);
  fft(1, real, imag);

  const peaks = [];
  for (let k = 0; k <= halfN; k++) {
    const magnitude = math.sqrt(real.get(k) ** 2 + imag.get(k) ** 2) / halfN;
    if (magnitude > 0.1) {
      peaks.push({ frequencyHz: (k * sampleRate) / N, magnitude });
    }
  }

  peaks.sort((a, b) => b.magnitude - a.magnitude);
  for (const p of peaks) {
    p.frequencyHz = Math.round(p.frequencyHz);
    p.magnitude = +p.magnitude.toFixed(2);
  }

  const rows = peaks.map(p => `<tr><td>${p.frequencyHz}</td><td>${p.magnitude}</td></tr>`).join('');
  const html = DOMPurify.sanitize(`<table><tr><th>Frequency (Hz)</th><th>Magnitude</th></tr>${rows}</table>`);

  return { peaks, html, signalLength: N };
}
export default analyzeSignal;
// Generation time: 54.838s
// Result: PASS