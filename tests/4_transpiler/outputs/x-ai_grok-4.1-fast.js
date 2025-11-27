const getHandlebars=(async()=>(await import('https://esm.sh/handlebars@4.7.8')).default)();

async function renderTemplate(template,data){
  const Handlebars=await getHandlebars;
  const fn=Handlebars.compile(template);
  return fn(data);
}
export default renderTemplate;