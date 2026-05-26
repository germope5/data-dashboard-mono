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

  let items = DATA;
  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((r) => r.name.toLowerCase().includes(qq));
  }
  if (category) {
    items = items.filter((r) => r.category === category);
  }

  const total = items.length;
  const page = items.slice(offset, offset + limit);

  res.json({ total, offset, limit, data: page });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
