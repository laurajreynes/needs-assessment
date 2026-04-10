import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  try {
    // If ?reset=true, wipe and recreate
    if (req.query.reset === "true") {
      await sql`DROP TABLE IF EXISTS submissions`;
    }
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        salesperson TEXT,
        customer TEXT,
        stock TEXT,
        vehicle_year TEXT,
        vehicle_make TEXT,
        vehicle_model TEXT,
        motivation TEXT,
        has_trade BOOLEAN DEFAULT false,
        trade_vehicle TEXT,
        trade_like TEXT,
        trade_dislike TEXT,
        trade_lender TEXT,
        trade_balance TEXT,
        trade_payment TEXT,
        recent_vehicle TEXT,
        recent_like TEXT,
        recent_dislike TEXT,
        lifestyle TEXT[],
        hot_buttons TEXT[],
        primary_driver TEXT,
        decision_influencers TEXT,
        must_haves TEXT,
        notes TEXT,
        duration INTEGER DEFAULT 0,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    return res.status(200).json({ success: true, message: "Table created" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
