export async function computeMST(tomlString) {
  const [{ parse }, mnemonist, textTableMod] = await Promise.all([
    import('https://esm.sh/smol-toml'),
    import('https://esm.sh/mnemonist/heap'),
    import('https://esm.sh/text-table')
  ]);

  const Heap = mnemonist.default ?? mnemonist.Heap ?? mnemonist;
  const textTable = textTableMod.default ?? textTableMod;

  const { edges = [] } = parse(tomlString);
  const parent = new Map();
  const rank = new Map();

  for (const { from, to } of edges) {
    if (!parent.has(from)) parent.set(from, from), rank.set(from, 0);
    if (!parent.has(to)) parent.set(to, to), rank.set(to, 0);
  }

  const find = (n) => {
    let root = n;
    while (root !== parent.get(root)) root = parent.get(root);
    let curr = n;
    while (curr !== root) {
      const next = parent.get(curr);
      parent.set(curr, root);
      curr = next;
    }
    return root;
  };

  const union = (u, v) => {
    let rootU = find(u);
    let rootV = find(v);
    if (rootU === rootV) return false;

    const rankU = rank.get(rootU);
    const rankV = rank.get(rootV);
    if (rankU < rankV) [rootU, rootV] = [rootV, rootU];

    parent.set(rootV, rootU);
    if (rankU === rankV) rank.set(rootU, rankU + 1);
    return true;
  };

  const heap = new Heap((a, b) => a.weight - b.weight);
  for (const edge of edges) heap.push(edge);

  const mst = [];
  let totalWeight = 0;
  const targetEdges = Math.max(0, parent.size - 1);

  while (heap.size > 0 && mst.length < targetEdges) {
    const edge = heap.pop();
    if (union(edge.from, edge.to)) {
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }

  const rows = [
    ['From', 'To', 'Weight'],
    ...mst.map(({ from, to, weight }) => [from, to, String(weight)])
  ];

  return {
    table: textTable(rows),
    totalWeight
  };
}
export default computeMST;
// Generation time: 18.013s
// Result: PASS