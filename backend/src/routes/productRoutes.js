import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { q, category, page = 1, limit = 24 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    if (q?.trim()) filter.$text = { $search: q.trim() };
    const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 50);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * safeLimit;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      Product.countDocuments(filter)
    ]);
    res.json({ items, total, page: Math.floor(skip / safeLimit) + 1, limit: safeLimit });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
});

export default router;
