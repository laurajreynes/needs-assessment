import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  const pin = req.headers["x-pin"] || req.query.pin;
  if (pin !== (process.env.DASHBOARD_PIN || "2026")) {
    return res.status(401).json({ error: "Invalid PIN" });
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  try {
    const submissions = await sql`
      SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 200
    `;

    const stats = await sql`
      SELECT
        COUNT(*)::int AS total,
        ROUND(AVG(duration))::int AS avg_duration,
        COUNT(DISTINCT salesperson)::int AS unique_sp
      FROM submissions
    `;

    const bySp = await sql`
      SELECT
        salesperson,
        COUNT(*)::int AS count,
        ROUND(AVG(duration))::int AS avg_dur
      FROM submissions
      WHERE salesperson != ''
      GROUP BY salesperson
      ORDER BY count DESC
    `;

    const byDay = await sql`
      SELECT
        DATE(submitted_at) AS day,
        COUNT(*)::int AS count
      FROM submissions
      GROUP BY DATE(submitted_at)
      ORDER BY day DESC
      LIMIT 30
    `;

    return res.status(200).json({
      submissions,
      stats: stats[0] || { total: 0, avg_duration: 0, unique_sp: 0 },
      bySp,
      byDay,
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
