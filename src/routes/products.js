import express from 'express';
import db from '../config/database.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM get_products();');
    res.json(results.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  const { productId, productName, productDescription, catalogId, purchasePrice, sellingPrice, quantity } = req.body;
  
  if (!productId || !productName || !productDescription || !catalogId || purchasePrice == null || sellingPrice == null || quantity == null) {
    return res.status(400).json({ error: 'All fields are required and must be valid.' });
  }

  const profitPerProduct = sellingPrice - purchasePrice;

  try {
    const result = await db.query(
      'INSERT INTO products (article_id, product_name, product_description, catalog_id, purchase_price, selling_price, quantity, profit_per_product) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
      [productId, productName, productDescription, catalogId, purchasePrice, sellingPrice, quantity, profitPerProduct]
    );  
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { productId, productName, productDescription, catalogId, purchasePrice, sellingPrice, quantity } = req.body;
  
  if (!productId || !productName || !productDescription || !catalogId || purchasePrice == null || sellingPrice == null || quantity == null) {
    return res.status(400).json({ error: 'All fields are required and must be valid.' });
  }

  const profitPerProduct = sellingPrice - purchasePrice;

  try {
    const result = await db.query(
      'UPDATE products SET article_id = $1, product_name = $2, product_description = $3, catalog_id = $4, purchase_price = $5, selling_price = $6, quantity = $7, profit_per_product = $8 WHERE id = $9 RETURNING *;',
      [productId, productName, productDescription, catalogId, purchasePrice, sellingPrice, quantity, profitPerProduct, id]
    );  
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
