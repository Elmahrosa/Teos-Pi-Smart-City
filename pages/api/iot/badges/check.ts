import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { evaluateAllBadgeRules } from '../../../lib/iot/rules';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || session.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  try {
    await evaluateAllBadgeRules();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Evaluation failed' });
  }
}
