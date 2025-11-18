export const parseMarkdown = async (str) => {
  const ref = parseMarkdown;
  ref.lib ||= (await import('https://esm.sh/marked@12.0.1')).marked;
  return ref.lib.parse(str || '', {
    async: false,
    gfm: true,
    breaks: true
  });
};
export default parseMarkdown;