export type Row = {
  id: number;
  name: string;
  value: number;
  category: string;
  date: string;
};

export function generateData(n = 1000): Row[] {
  const cats = ['A', 'B', 'C', 'D'];
  const out: Row[] = [];
  for (let i = 1; i <= n; i++) {
    out.push({
      id: i,
      name: `Item ${i}`,
      value: Math.round(Math.random() * 10000) / 100,
      category: cats[i % cats.length],
      date: new Date(Date.now() - (i % 365) * 24 * 3600 * 1000).toISOString().slice(0, 10)
    });
  }
  return out;
}
