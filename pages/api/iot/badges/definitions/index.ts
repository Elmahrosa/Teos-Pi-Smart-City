import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM badge_definitions ORDER BY created_at DESC');
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch definitions' });
    }
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session || session.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    try {
      const body = req.body;
      const { name, description, icon, rule } = body;
      const { rows } = await pool.query(
        `INSERT INTO badge_definitions (name, description, icon, rule)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, description, icon, JSON.stringify(rule)]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create badge' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
