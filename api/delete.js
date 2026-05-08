import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  try {
    const { id, customer } = req.body || {};
    let result;
    if (id) {
      result = await sql`DELETE FROM submissions WHERE id = ${id} RETURNING id, customer`;
    } else if (customer) {
      result = await sql`DELETE FROM submissions WHERE customer = ${customer} RETURNING id, customer`;
    } else {
      return res.status(400).json({ error: "Provide id or customer" });
    }
    return res.status(200).json({ success: true, deleted: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
