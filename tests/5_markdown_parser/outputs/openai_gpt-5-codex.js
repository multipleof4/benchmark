const parseMarkdown=async t=>{
  parseMarkdown.l??=import('https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js');
  const{marked}=await parseMarkdown.l;
  return marked.parse(t||'');
};
export default parseMarkdown;