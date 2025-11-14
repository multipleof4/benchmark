const parseMarkdown=async(md='')=>{
  const{marked}=await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
  return marked.parse(md);
};
export default parseMarkdown;