async function parseMarkdown(md){
  const{marked}=await import('https://esm.sh/marked');
  return marked.parse(md);
}
export default parseMarkdown;