import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendAlerts = async () => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM alerts WHERE created_at > NOW() - INTERVAL '1 minute' ORDER BY created_at DESC`
      );
      for (const alert of rows) {
        res.write(`data: ${JSON.stringify({ type: 'alert', data: alert })}\n\n`);
      }
    } catch (err) { console.error(err) }
  };

  const sendBadges = async () => {
    try {
      const { rows } = await pool.query(
        `SELECT eb.*, bd.name, bd.description, bd.icon
         FROM earned_badges eb
         JOIN badge_definitions bd ON eb.badge_id = bd.id
         WHERE eb.earned_at > NOW() - INTERVAL '1 minute'`
      );
      for (const badge of rows) {
        res.write(`data: ${JSON.stringify({ type: 'badge', data: badge })}\n\n`);
      }
    } catch (err) { console.error(err) }
  };

  // initial burst
  await sendAlerts();
  await sendBadges();

  const interval = setInterval(async () => {
    await sendAlerts();
    await sendBadges();
  }, 5000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}
