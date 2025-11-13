let m
export const parseMarkdown=async t=>{
  m||(m=import('https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js'))
  const {marked}=await m
  return marked.parse(t)
}
export default parseMarkdown;