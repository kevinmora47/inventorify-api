import express from 'express';
import db from '../config/database.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
      const results = await db.query(
          `SELECT p.id, p.article_id, p.product_name, p.product_description, pc.category_name AS category, p.purchase_price, 
          p.selling_price, p.quantity, p.profit_per_product
   FROM products p
   JOIN product_catalog pc ON p.catalog_id = pc.id
   ORDER BY p.product_name;
   `
      );
      res.json(results.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



router.post('/products', async (req, res) => {
  console.log("Received data:", req.body); // Log data to debug
  const { productId, productName, productDescription, catalogId, purchasePrice, sellingPrice, quantity } = req.body;
  
  // Further validation here
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







export default router;
