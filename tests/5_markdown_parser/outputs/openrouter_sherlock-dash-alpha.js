async function parseMarkdown(md) {
  const { default: marked } = await import('https://cdn.skypack.dev/marked@14.1.2');
  marked.use({
    breaks: true,
    gfm: true,
    async tokenize(src) {
      const tokens = marked.lexer(src);
      for (const token of tokens) {
        if (token.type === 'list') {
          token.ordered = token.ordered || false;
          token.loose = !!token.items.find(item => item.text.includes('\n'));
        }
      }
      return tokens;
    },
    renderer: {
      heading(text, level) { return `<h${level}>${text}</h${level}>`; },
      strong(text) { return `<strong>${text}</strong>`; },
      em(text) { return `<em>${text}</em>`; },
      codespan(text) { return `<code>${text}</code>`; },
      link(href, title, text) { return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`; },
      code(code, infostring) {
        const lang = (infostring || '').match(/^([a-z0-9]+)/i);
        return `<pre><code class="${lang ? `language-${lang[1]}` : ''}">${code}</code></pre>`;
      },
      list(body, ordered) {
        const type = ordered ? 'ol' : 'ul';
        return `<${type}>${body}</${type}>`;
      },
      blockquote(quote) { return `<blockquote>${quote}</blockquote>`; }
    }
  });
  return marked.parse(md);
}
export default parseMarkdown;