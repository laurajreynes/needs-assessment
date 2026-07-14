import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  try {
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

    const submissions = await sql`
      SELECT id, salesperson, customer, stock, availability, has_trade, duration, submitted_at, data
      FROM asheville_submissions
      ORDER BY submitted_at DESC
      LIMIT 300
    `;

    return res.status(200).json({ submissions });
  } catch (err) {
    console.error("Asheville dashboard error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
