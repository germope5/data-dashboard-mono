import express from 'express';
import cors from 'cors';
import { generateData, Row } from './data';

const app = express();
app.use(cors());
app.use(express.json());

const DATA: Row[] = generateData(5000);

app.get('/api/data', (req, res) => {
  const q = (req.query.q as string) || '';
  const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 1000);
  const offset = parseInt((req.query.offset as string) || '0', 10) || 0;
  const category = (req.query.category as string) || '';
  const sortBy = (req.query.sortBy as string) || '';
  const sortDir = ((req.query.sortDir as string) || 'asc').toLowerCase();

  let items = DATA;
  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((r) => r.name.toLowerCase().includes(qq));
  }
  if (category) {
    items = items.filter((r) => r.category === category);
  }

  // Sorting
  if (sortBy) {
    items = items.slice().sort((a: any, b: any) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === 'asc' ? -1 : 1;
      if (vb == null) return sortDir === 'asc' ? 1 : -1;
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }

  const total = items.length;
  const page = items.slice(offset, offset + limit);

  res.json({ total, offset, limit, data: page });
});

// Summary endpoint for dashboards
app.get('/api/summary', (req, res) => {
  const total = DATA.length;
  const byCategory: Record<string, { count: number; sum: number; avg: number }> = {};
  for (const r of DATA) {
    if (!byCategory[r.category]) byCategory[r.category] = { count: 0, sum: 0, avg: 0 };
    byCategory[r.category].count += 1;
    byCategory[r.category].sum += r.value;
  }
  for (const k of Object.keys(byCategory)) {
    const v = byCategory[k];
    v.avg = +(v.sum / v.count).toFixed(2);
  }
  const values = DATA.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = +(values.reduce((s, x) => s + x, 0) / values.length).toFixed(2);

  res.json({ total, byCategory, min, max, avg });
});

// Simple AI insights endpoint (placeholder) — can be proxied to Ollama later
app.post('/api/ai/insights', (req, res) => {
  const { top = 5 } = req.body || {};
  // compute top categories by count
  const counts: Record<string, number> = {};
  for (const r of DATA) counts[r.category] = (counts[r.category] || 0) + 1;
  const tops = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([category, count]) => ({ category, count }));

  const insight = `Top ${top} categories by count: ${tops.map((t) => `${t.category}(${t.count})`).join(', ')}.`;
  res.json({ insight, tops });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
