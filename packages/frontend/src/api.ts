export type Row = {
  id: number;
  name: string;
  value: number;
  category: string;
  date: string;
};

export async function fetchData(offset = 0, limit = 50, q = '', category = '') {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  const res = await fetch(`http://localhost:4000/api/data?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json() as Promise<{ total: number; offset: number; limit: number; data: Row[] }>;
}
