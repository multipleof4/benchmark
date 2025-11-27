const loadLibs=(()=>{let cache;return async()=>cache||(cache=Promise.all([
import('https://cdn.jsdelivr.net/npm/marked@11.1.0/lib/marked.esm.js'),
import('https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.mjs')
]).then(([{marked},purifyMod])=>{
const purify=(purifyMod.default||purifyMod)(window);
marked.setOptions({gfm:true,headerIds:true,mangle:false});
return {marked,purify};
}));})();

const parseMarkdown=async input=>{
const {marked,purify}=await loadLibs();
const html=marked.parse(typeof input==='string'?input:`${input??''}`);
return purify.sanitize(html,{USE_PROFILES:{html:true}});
};
export default parseMarkdown;
// Generation time: 15.618s
// Result: FAIL