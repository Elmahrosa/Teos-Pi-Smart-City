import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || session.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  if (req.method === 'PUT') {
    try {
      const { name, description, icon, rule, enabled } = req.body;
      const { rows } = await pool.query(
        `UPDATE badge_definitions
         SET name = $1, description = $2, icon = $3, rule = $4, enabled = $5, updated_at = NOW()
         WHERE id = $6 RETURNING *`,
        [name, description, icon, JSON.stringify(rule), enabled, id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Badge not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM badge_definitions WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  res.setHeader('Allow', ['PUT','DELETE']);
  res.status(405).end();
}
