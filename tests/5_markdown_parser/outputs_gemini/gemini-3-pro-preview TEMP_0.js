const parseMarkdown = async t => {
  const u = 'https://esm.sh/',
        [{ parse }, { default: d }] = await Promise.all([
          import(u + 'marked@12.0.1'),
          import(u + 'dompurify@3.0.9')
        ])
  return d(self).sanitize(parse(t ?? ''))
}
export default parseMarkdown;