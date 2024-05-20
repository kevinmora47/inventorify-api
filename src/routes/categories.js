import express from 'express';
import db from '../config/database.js';

const router = express.Router();

router.get('/categories', async (req, res) => {
    try {
        const results = await db.query('SELECT id, category_name FROM product_catalog ORDER BY category_name;');
        res.json(results.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;