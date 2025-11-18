const parseMarkdown = async m => (
  (await import('https://esm.sh/marked@12.0.0'))
    .parse(m)
)
export default parseMarkdown;