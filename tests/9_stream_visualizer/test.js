export default{
  functionName:'createStreamVisualizer',
  prompt:`// Write an async function 'createStreamVisualizer' that consumes a streaming time-series feed and prepares chart data.
// - Accept (asyncIterable, options) where options = { maxPoints, alpha, width, height, yDomain:[min,max] }.
// - Use dynamic import() to load D3 for scales, line generator, etc.
// - Consume the async iterable with 'for await', applying an exponential moving average: ema = alpha * value + (1 - alpha) * prevEma (seed with first value).
// - Keep only the latest 'maxPoints' entries. Each stored point must be { timestamp, value, ema }.
// - Build linear x/y scales (timestamp domain from first/last retained point, yDomain from options) and generate an SVG path string using d3.line on the EMA values.
// - Return { data, path } once the stream completes. 'data' is the capped array; 'path' is the SVG path string ready for a <path d="">.`,

  runTest:async createStreamVisualizer=>{
    const assert={
      strictEqual:(a,e,m)=>{if(a!==e)throw new Error(m||`${a}!==${e}`)},
      ok:(c,m)=>{if(!c)throw new Error(m)}
    };
    const samples=[
      {timestamp:0,value:10},
      {timestamp:1e3,value:20},
      {timestamp:2e3,value:15},
      {timestamp:3e3,value:30},
      {timestamp:4e3,value:25},
      {timestamp:5e3,value:40}
    ];
    async function*mockStream(){
      for(const point of samples)yield {...point};
    }
    const opts={maxPoints:4,alpha:.4,width:400,height:200,yDomain:[0,50]};
    const expected=[
      {timestamp:2e3,value:15,ema:14.4},
      {timestamp:3e3,value:30,ema:20.64},
      {timestamp:4e3,value:25,ema:22.384},
      {timestamp:5e3,value:40,ema:29.4304}
    ];
    const {data,path}=await createStreamVisualizer(mockStream(),opts);
    assert.strictEqual(Array.isArray(data),true,'data must be an array');
    assert.strictEqual(data.length,opts.maxPoints,'Should keep only latest maxPoints entries');
    const withinTol=(a,b,t=1e-3)=>Math.abs(a-b)<=t;
    data.forEach((row,i)=>{
      const exp=expected[i];
      assert.strictEqual(row.timestamp,exp.timestamp,'Timestamp mismatch');
      assert.strictEqual(row.value,exp.value,'Value mismatch');
      if(!withinTol(row.ema,exp.ema))throw new Error(`EMA mismatch at index ${i}: ${row.ema} vs ${exp.ema}`);
    });
    assert.ok(typeof path==='string'&&path.startsWith('M')&&path.includes('L'),'Path should be a valid SVG polyline string');
  }
};
