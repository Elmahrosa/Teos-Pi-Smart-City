import { Pool } from "pg";
import { BadgeRule } from "./types";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function grantBadge(userId: string, badgeId: string, deviceId: string): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO earned_badges (user_id, badge_id, device_id)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [userId, badgeId, deviceId]
    );
    return true;
  } catch (err) {
    console.error("Grant badge error:", err);
    return false;
  }
}

export async function triggerAlert(deviceId: string, metric: string, severity: string, message: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO alerts (device_id, metric, severity, message)
       VALUES ($1, $2, $3, $4)`,
      [deviceId, metric, severity, message]
    );
  } catch (err) {
    console.error("Trigger alert error:", err);
  }
}

// Evaluate a badge rule by fetching recent telemetry values and evaluating the condition in JS.
// This avoids injecting operators into SQL.
export async function evaluateBadgeRule(deviceId: string, rule: BadgeRule, durationMinutes: number = 60): Promise<boolean> {
  try {
    const { rows } = await pool.query(
      `SELECT value FROM telemetry
       WHERE device_id = $1
         AND metric = $2
         AND ts > NOW() - INTERVAL '${durationMinutes} minutes'`,
      [deviceId, rule.metric]
    );

    if (!rows || rows.length === 0) return false;

    // Evaluate operator per row; if any row matches, return true.
    for (const r of rows) {
      const val = Number(r.value);
      switch (rule.operator) {
        case ">": if (val > rule.threshold) return true; break;
        case "<": if (val < rule.threshold) return true; break;
        case ">=": if (val >= rule.threshold) return true; break;
        case "<=": if (val <= rule.threshold) return true; break;
        case "==": if (val == rule.threshold) return true; break;
        case "!=": if (val != rule.threshold) return true; break;
        default: break;
      }
    }
    return false;
  } catch (err) {
    console.error("evaluateBadgeRule error:", err);
    return false;
  }
}
