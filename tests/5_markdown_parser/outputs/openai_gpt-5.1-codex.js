const parseMarkdown=async m=>{
  const {marked}=await import('https://cdn.jsdelivr.net/npm/marked@11.1.0/lib/marked.esm.js')
  return marked.parse(m)
}
export default parseMarkdown;