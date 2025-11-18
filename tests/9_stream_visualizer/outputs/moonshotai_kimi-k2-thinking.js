async function createStreamVisualizer(asyncIterable, options) {
  const { maxPoints, alpha, width, height, yDomain } = options;
  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  
  if (!Number.isFinite(maxPoints) || maxPoints < 1) {
    throw new Error('maxPoints must be a positive integer');
  }
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error('alpha must be between 0 and 1');
  }
  if (!Array.isArray(yDomain) || yDomain.length !== 2) {
    throw new Error('yDomain must be an array of [min, max]');
  }
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error('width must be a positive number');
  }
  if (!Number.isFinite(height) || height <= 0) {
    throw new Error('height must be a positive number');
  }

  const data = [];
  let prevEma = null;
  let itemCount = 0;

  for await (const value of asyncIterable) {
    if (!Number.isFinite(value)) {
      throw new Error('Stream must yield finite numeric values');
    }
    
    const timestamp = Date.now();
    const ema = prevEma === null ? value : alpha * value + (1 - alpha) * prevEma;
    const point = { timestamp, value, ema };
    
    if (itemCount < maxPoints) {
      data.push(point);
      itemCount++;
    } else {
      data.shift();
      data.push(point);
    }
    
    prevEma = ema;
  }

  let path = '';
  if (data.length > 0) {
    const xDomain = data.length > 1 ? [data[0].timestamp, data[data.length - 1].timestamp] : [data[0].timestamp - 1000, data[0].timestamp];
    
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([height, 0]);
    
    const line = d3.line()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.ema))
      .curve(d3.curveMonotoneX)
      .defined(d => Number.isFinite(d.ema));
    
    path = line(data) || '';
  }

  return { data, path };
}
export default createStreamVisualizer;