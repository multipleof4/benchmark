const parseMarkdown = async (text) => {
  const { parse } = await import('https://esm.sh/marked');
  return parse(text);
};
export default parseMarkdown;