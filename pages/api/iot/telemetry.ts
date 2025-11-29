import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT ts, device_id, metric, value, location
       FROM telemetry
       WHERE ts > NOW() - INTERVAL '24 hours'
       ORDER BY ts DESC
       LIMIT 1000`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
}
