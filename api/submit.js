import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const d = req.body;
  try {
    await sql`
      INSERT INTO submissions (
        salesperson, customer, stock, vehicle_year, vehicle_make, vehicle_model,
        motivation, has_trade, trade_vehicle, trade_like, trade_dislike,
        trade_lender, trade_balance, trade_payment,
        recent_vehicle, recent_like, recent_dislike,
        lifestyle, hot_buttons, primary_driver, decision_influencers,
        must_haves, notes, duration, submitted_at
      ) VALUES (
        ${d.sp || ""}, ${d.cn || ""}, ${d.stk || ""}, ${d.vy || ""}, ${d.vm || ""}, ${d.vmod || ""},
        ${d.mot || ""}, ${d.hasTrade || false}, ${d.tv || ""}, ${d.tlike || ""}, ${d.tdis || ""},
        ${d.tlen || ""}, ${d.tbal || ""}, ${d.tpay || ""},
        ${d.rv || ""}, ${d.rl || ""}, ${d.rd || ""},
        ${d.life || []}, ${d.hot || []}, ${d.pd || ""}, ${d.di || ""},
        ${d.mh || ""}, ${d.nn || ""}, ${d.dur || 0}, ${d.ts || new Date().toISOString()}
      )
    `;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Submit error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
