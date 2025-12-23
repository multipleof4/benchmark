let m;
const parseMarkdown = async (s) => {
  m ||= (await import('https://esm.sh/marked')).marked;
  return m.parse(s);
};
export default parseMarkdown;
// Generation time: 125.998s
// Result: PASS