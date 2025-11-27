let p;

export const parseMarkdown = async (s) => {
  p ||= Promise.all([
    import('https://esm.sh/marked@7.0.4').then(r => r.marked),
    import('https://esm.sh/dompurify@3.0.5').then(r => r.default)
  ]);
  const [m, d] = await p;
  return d.sanitize(m.parse(s));
};
export default parseMarkdown;
// Generation time: 550.549s
// Result: PASS