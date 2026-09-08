class UnionFind {
  p = new Map();
  r = new Map();

  constructor(elements) {
    for (const el of elements) {
      this.p.set(el, el);
      this.r.set(el, 0);
    }
  }

  find(i) {
    if (this.p.get(i) !== i) this.p.set(i, this.find(this.p.get(i)));
    return this.p.get(i);
  }

  union(i, j) {
    let [rootI, rootJ] = [this.find(i), this.find(j)];
    if (rootI === rootJ) return false;

    const [rankI, rankJ] = [this.r.get(rootI), this.r.get(rootJ)];
    if (rankI < rankJ) [rootI, rootJ] = [rootJ, rootI];
    this.p.set(rootJ, rootI);
    if (rankI === rankJ) this.r.set(rootI, rankI + 1);

    return true;
  }
}

export async function computeMST(tomlStr) {
  const [{ parse }, mnemonist, textTableMod] = await Promise.all([
    import('https://esm.sh/smol-toml'),
    import('https://esm.sh/mnemonist'),
    import('https://esm.sh/text-table')
  ]);

  const Heap = mnemonist.Heap || mnemonist.default?.Heap;
  const table = textTableMod.default || textTableMod;

  const { edges = [] } = parse(tomlStr);
  const nodes = new Set();
  const heap = new Heap((a, b) => Number(a.weight) - Number(b.weight));

  for (const edge of edges) {
    nodes.add(edge.from);
    nodes.add(edge.to);
    heap.push(edge);
  }

  const uf = new UnionFind(nodes);
  const mst = [];
  let totalWeight = 0;
  const targetEdges = Math.max(0, nodes.size - 1);

  while (mst.length < targetEdges && heap.size > 0) {
    const edge = heap.pop();
    if (uf.union(edge.from, edge.to)) {
      mst.push([edge.from, edge.to, String(edge.weight)]);
      totalWeight += Number(edge.weight);
    }
  }

  return {
    table: table([['From', 'To', 'Weight'], ...mst]),
    totalWeight
  };
}
export default computeMST;
// Generation time: 31.116s
// Result: PASS