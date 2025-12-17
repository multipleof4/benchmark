const parseMarkdown = async (md) => {
    const [{ marked }, { default: sanitize }] = await Promise.all([
        import('https://esm.sh/marked'),
        import('https://esm.sh/dompurify')
    ]);

    return sanitize.sanitize(marked.parse(md));
};
export default parseMarkdown;
// Generation time: 7.966s
// Result: PASS