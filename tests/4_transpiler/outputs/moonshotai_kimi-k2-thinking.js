let hb;
export const renderTemplate=async(t,d)=>{
  try{
    hb??=(await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/handlebars.mjs')).default;
    return hb.compile(t)(d);
  }catch(e){
    throw new Error(`Render failed: ${e.message}`);
  }
};
export default renderTemplate;
// Generation time: 50.722s
// Result: FAIL