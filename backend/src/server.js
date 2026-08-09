import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'AyushStore API' }));
app.get('/api/products', (_req, res) => res.json([
  { id: 1, name: 'Digital Thermometer', price: 249, category: 'Health Devices' },
  { id: 2, name: 'Vitamin C Tablets', price: 199, category: 'Wellness' },
  { id: 3, name: 'First Aid Kit', price: 499, category: 'First Aid' },
  { id: 4, name: 'Hand Sanitizer', price: 129, category: 'Personal Care' }
]));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AyushStore API running on port ${PORT}`));
