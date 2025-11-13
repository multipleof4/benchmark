export default {
  functionName: 'parseMarkdown',
  prompt: `// Write an async JavaScript function 'parseMarkdown' that parses Markdown text and converts it to HTML.
// - The function must accept a Markdown string.
// - You MUST use dynamic import() to load one or more libraries from a CDN to help with parsing.
// - The function should handle: headers (h1-h6), bold, italic, links, code blocks, inline code, lists (ordered/unordered), and blockquotes.
// - Return the resulting HTML string.`,
  runTest: async (parseMarkdown) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    const markdown = `# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n\`\`\`js\nconst x = 5;\n\`\`\``;
    const html = await parseMarkdown(markdown);
    if (!html.includes('<h1>') || !html.includes('<strong>') || !html.includes('<em>') || !html.includes('<ul>') || !html.includes('<code>')) {
      throw new Error('Test Failed: HTML output missing required elements.');
    }
    return html;
  }
};
