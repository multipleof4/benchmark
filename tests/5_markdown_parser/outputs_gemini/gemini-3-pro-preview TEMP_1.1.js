const parseMarkdown = async s => {
  const { parse: p } = await import('https://esm.sh/marked@12');
  return p(s);
};
export default parseMarkdown;