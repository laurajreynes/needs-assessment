import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return res.status(500).json({ error: "Gmail credentials not configured" });

  const { recipients, subject, html } = req.body;
  if (!recipients?.length || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Discovery App" <${user}>`,
      to: recipients.join(", "),
      subject,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
