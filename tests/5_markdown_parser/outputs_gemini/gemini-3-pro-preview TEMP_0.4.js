const parseMarkdown = async (md) => {
  const { parse } = await import('https://esm.sh/marked');
  return parse(md);
};
export default parseMarkdown;