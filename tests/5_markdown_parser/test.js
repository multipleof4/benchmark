export default {
  functionName: 'parseMarkdown',
  prompt: `// Write an async JavaScript function 'parseMarkdown' that parses Markdown text and converts it to HTML.
// - The function must accept a Markdown string.
// - You MUST use dynamic import() to load one or more libraries from a CDN to help with parsing.
// - The function should handle: headers (h1-h6), bold, italic, links, code blocks, inline code, lists (ordered/unordered), and blockquotes.
// - Return the resulting HTML string.`,
  getTestCases: () => {
    const markdown = `# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n\`\`\`js\nconst x = 5;\n\`\`\``;
    return [markdown];
  },
  runTest: async (parseMarkdown) => {
    const [markdown] = globalThis.getTestCases ? globalThis.getTestCases() : this.getTestCases();
    const html = await parseMarkdown(markdown);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const selectors = ['h1', 'strong', 'em', 'ul', 'code'];
    const missing = selectors.find(s => !doc.querySelector(s));
    if (missing) {
      throw new Error(`Test Failed: HTML output missing required element: <${missing}>`);
    }
  }
};
