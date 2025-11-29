import { Pool } from "pg";
import { evaluateBadgeRule, grantBadge } from "./governance";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function evaluateAllBadgeRules(): Promise<void> {
  // Get all enabled badge definitions
  const { rows: badges } = await pool.query(
    "SELECT * FROM badge_definitions WHERE enabled = true"
  );

  // Get all active devices in last hour
  const { rows: devices } = await pool.query(
    "SELECT DISTINCT device_id FROM telemetry WHERE ts > NOW() - INTERVAL '1 hour'"
  );

  for (const badge of badges) {
    const rule = typeof badge.rule === 'string' ? JSON.parse(badge.rule) : badge.rule;
    for (const device of devices) {
      const shouldGrant = await evaluateBadgeRule(
        device.device_id,
        rule,
        rule.duration || 60
      );

      if (shouldGrant) {
        // Find user who owns this device (placeholder)
        const userId = await getDeviceOwner(device.device_id);
        if (userId) {
          await grantBadge(userId, badge.id, device.device_id);
        }
      }
    }
  }
}

async function getDeviceOwner(deviceId: string): Promise<string | null> {
  // Placeholder: return first admin user for now
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  return rows[0]?.id || null;
}
