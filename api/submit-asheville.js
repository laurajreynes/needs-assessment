import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  const d = req.body || {};

  try {
    // Full payload lives in JSONB so the locate profile can evolve without a migration.
    await sql`
      CREATE TABLE IF NOT EXISTS asheville_submissions (
        id SERIAL PRIMARY KEY,
        salesperson TEXT,
        customer TEXT,
        stock TEXT,
        availability TEXT,
        has_trade BOOLEAN DEFAULT false,
        duration INTEGER DEFAULT 0,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        data JSONB
      )
    `;

    await sql`
      INSERT INTO asheville_submissions
        (salesperson, customer, stock, availability, has_trade, duration, submitted_at, data)
      VALUES (
        ${d.sp || ""},
        ${d.cn || ""},
        ${d.stk || ""},
        ${d.avail || ""},
        ${!!d.hasTrade},
        ${d.dur || 0},
        ${d.ts || new Date().toISOString()},
        ${JSON.stringify(d)}
      )
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Asheville submit error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
