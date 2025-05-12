// lib/postgres.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'policy_tracker',
  password: '6409610786',
  port: 5432,
});

export default pool;
