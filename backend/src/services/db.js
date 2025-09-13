import pg from "pg";
import { config as loadEnv } from "dotenv";

loadEnv();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const db = {
  query: (text, params) => pool.query(text, params),
  one: async (text, params) => {
    const r = await pool.query(text, params);
    if (r.rows.length !== 1) throw new Error("Expected one row");
    return r.rows[0];
  },
  oneOrNone: async (text, params) => {
    const r = await pool.query(text, params);
    return r.rows[0] || null;
  },
  any: async (text, params) => {
    const r = await pool.query(text, params);
    return r.rows;
  },
};

export async function testConnection() {
  const r = await pool.query("SELECT 1 as ok");
  return r.rows[0]?.ok === 1;
}
