async function findLISLength(arr) {
    const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
    const tails = [];
    for (const num of arr) {
        const idx = bisectLeft(tails, num);
        if (idx === tails.length) tails.push(num);
        else tails[idx] = num;
    }
    return tails.length;
}
export default findLISLength;
// Generation time: 4.847s
// Result: PASS