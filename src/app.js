import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/products.js';
import categoryRouter from './routes/categories.js'; 

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', indexRouter);
app.use('/', categoryRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
