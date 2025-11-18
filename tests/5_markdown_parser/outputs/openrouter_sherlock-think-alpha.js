async function parseMarkdown(md){
  const{marked}=await import('https://esm.sh/marked');
  const{DOMPurify}=await import('https://esm.sh/dompurify');
  return DOMPurify.sanitize(marked.parse(md));
}
export default parseMarkdown;