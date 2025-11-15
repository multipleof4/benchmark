const parseMarkdown = async m => {
  try {
    const {marked} = await import('https://esm.sh/marked');
    return marked.parse(m);
  } catch (e) {
    return `<pre>${e.message}</pre>`;
  }
};
export default parseMarkdown;