async function processCSV(csv,{filterColumn,filterValue,groupBy,aggregateColumn,operation}){
  const Papa=(await import('https://cdn.jsdelivr.net/npm/papaparse@5/+esm')).default;
  const{data}=Papa.parse(csv,{header:true,skipEmptyLines:true});
  const groups=new Map();
  for(const row of data){
    if(row[filterColumn]==filterValue){
      const key=row[groupBy];
      const val=Number(row[aggregateColumn])||0;
      const g=groups.get(key)||{sum:0,count:0};
      g.sum+=val;
      g.count++;
      groups.set(key,g);
    }
  }
  const result=[];
  for(const[key,g]of groups){
    let res;
    switch(operation){
      case'sum':res=g.sum;break;
      case'avg':res=g.sum/g.count;break;
      case'count':res=g.count;break;
    }
    result.push({[groupBy]:key,result:res});
  }
  return result;
}
export default processCSV;