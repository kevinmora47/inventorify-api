import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config(); // Load environment variables

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

export default {
  query: (text, params) => pool.query(text, params),
};
