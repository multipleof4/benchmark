const createStreamVisualizer = async (asyncIterable, options) => {
    const { maxPoints = 100, alpha = 0.1, width = 800, height = 400, yDomain = [0, 100] } = options;
    const data = [];
    let ema = null;
    let firstTimestamp = null;

    for await (const { timestamp, value } of asyncIterable) {
        ema = ema === null ? value : alpha * value + (1 - alpha) * ema;
        data.push({ timestamp, value, ema });
        if (data.length > maxPoints) data.shift();
        if (firstTimestamp === null) firstTimestamp = timestamp;
    }

    const d3 = await import('https://esm.sh/d3@7');
    const xScale = d3.scaleLinear().domain([firstTimestamp, data[data.length - 1].timestamp]).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
    const line = d3.line().x(d => xScale(d.timestamp)).y(d => yScale(d.ema));
    const path = line(data);

    return { data, path };
};
export default createStreamVisualizer;
// Generation time: 9.968s
// Result: PASS