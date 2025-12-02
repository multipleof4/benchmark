const parseMarkdown=async e=>(await import("https://cdn.jsdelivr.net/npm/markdown-it@13.0.2/dist/markdown-it.min.js")).default().render(e)
export default parseMarkdown;
// Generation time: 9.601s
// Result: FAIL