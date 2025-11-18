const parseMarkdown = async (md) => {
  const { parse } = await import('https://esm.sh/marked@12');
  return parse(md || '');
};
export default parseMarkdown;