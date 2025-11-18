const parseMarkdown = async t => {
  const { parse: p } = await import('https://esm.sh/marked@12')
  return p(t, {
    async: false,
    breaks: true,
    gfm: true
  })
}
export default parseMarkdown;