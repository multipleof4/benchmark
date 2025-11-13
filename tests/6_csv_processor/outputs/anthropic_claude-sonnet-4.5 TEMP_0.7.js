const processCSV = async (csvString, config) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  
  const { data } = parse(csvString, { 
    header: true, 
    skipEmptyLines: true,
    dynamicTyping: true
  });
  
  const filtered = data.filter(row => 
    row[config.filterColumn] == config.filterValue
  );
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[config.groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  const operations = {
    sum: arr => arr.reduce((s, r) => s + (Number(r[config.aggregateColumn]) || 0), 0),
    avg: arr => operations.sum(arr) / arr.length || 0,
    count: arr => arr.length
  };
  
  return Object.entries(grouped).map(([key, rows]) => ({
    [config.groupBy]: key,
    result: operations[config.operation](rows)
  }));
};
export default processCSV;