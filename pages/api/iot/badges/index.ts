import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { rows } = await pool.query(
      `SELECT eb.*, bd.name, bd.description, bd.icon
       FROM earned_badges eb
       JOIN badge_definitions bd ON eb.badge_id = bd.id
       WHERE eb.user_id = $1
       ORDER BY eb.earned_at DESC`,
      [session.user.id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
}
