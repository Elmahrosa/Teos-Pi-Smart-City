import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const totalDevicesRes = await pool.query("SELECT COUNT(DISTINCT device_id) as count FROM telemetry WHERE ts > NOW() - INTERVAL '1 hour'");
    const activeAlertsRes = await pool.query("SELECT COUNT(*) as count FROM alerts WHERE acknowledged = false AND created_at > NOW() - INTERVAL '1 hour'");
    const airQualityRes = await pool.query("SELECT AVG(value) as avg FROM telemetry WHERE metric = 'air_quality' AND ts > NOW() - INTERVAL '1 hour'");
    const energyRes = await pool.query("SELECT AVG(value) as avg FROM telemetry WHERE metric = 'energy_efficiency' AND ts > NOW() - INTERVAL '1 hour'");

    const totalDevices = Number(totalDevicesRes.rows[0]?.count || 0);
    const activeAlerts = Number(activeAlertsRes.rows[0]?.count || 0);
    const avgAirQuality = Math.round(Number(airQualityRes.rows[0]?.avg || 0));
    const energyEfficiency = Math.round(Number(energyRes.rows[0]?.avg || 0));

    res.status(200).json({ totalDevices, activeAlerts, avgAirQuality, energyEfficiency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
