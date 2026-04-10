import { useState, useEffect } from "react";

const B = { red: "#C8102E", dk: "#A50D24", blk: "#1A1A1A", w: "#FFF", lg: "#F5F5F5", grn: "#16a34a", amb: "#d97706" };
const F = "'Helvetica Neue',Helvetica,Arial,sans-serif";

const walkaroundLabels = {
  safety: "Safety Systems", fuel: "Fuel Efficiency", space: "Cargo & Versatility",
  tech: "Tech & Connectivity", comfort: "Ride & Comfort", towing: "Towing Capability",
  performance: "Performance & Power", style: "Design & Style",
  offroad: "Off-Road Capability", family: "Family Friendly",
};

const ALL_SALESPEOPLE = [
  "Nick Plank","Kojak McKown","Bailey Hilt","D'Marcus Anthony","Jody Scharping",
  "Mario Aguilera","Will Thermidor","Miguel Medina","Zak Banwart","Carlos Tamayo",
  "Alain Pino","Kelly Floyd","Damian Flores","Alex Coolen","Sean Rowland",
  "Jeff Princile","Manuel Fernandez Segui","Luis Ferrer Jimenez","Jayden Hodges",
  "Louis Mazzaro","Matt Smith","Henry Rosales Guerrero","Lazaro Garcia","Arlex Lacayo",
  "Steven Herrera","Christian Odio","Jessica Dykstra","Renny Ontiveros","Peter Esposito",
  "Ricardo Navarro","Justin Steffy","Tyler Powell",
];

const Card = ({ children, style: s }) => (
  <div style={{ background: B.w, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 16, ...s }}>{children}</div>
);

const Stat = ({ label, value, sub }) => (
  <Card style={{ textAlign: "center", padding: 16 }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: B.red, fontFamily: F }}>{value}</div>
    <div style={{ fontSize: 11, color: "#888", fontFamily: F, marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#aaa", fontFamily: F, marginTop: 2 }}>{sub}</div>}
  </Card>
);

const fmt = (s) => {
  if (!s && s !== 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/* ── Date helpers ── */
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const getMonday = (d) => {
  const x = new Date(d); x.setHours(0,0,0,0);
  const day = x.getDay(); const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff); return x;
};
const startOfMonth = (d) => { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(1); return x; };

const PERIODS = [
  { key: "today", label: "Today", fn: () => startOfDay(new Date()) },
  { key: "wtd", label: "Week to Date", fn: () => getMonday(new Date()) },
  { key: "mtd", label: "Month to Date", fn: () => startOfMonth(new Date()) },
  { key: "all", label: "All Time", fn: () => new Date(0) },
];

/* ── CSV Export ── */
const downloadCSV = (rows) => {
  if (!rows.length) return;
  const headers = [
    "Date","Salesperson","Customer","Stock","Vehicle Year","Vehicle Make","Vehicle Model",
    "Motivation","Has Trade","Trade Vehicle","Trade Likes","Trade Dislikes",
    "Trade Lender","Trade Balance","Trade Payment",
    "Recent Vehicle","Recent Likes","Recent Dislikes",
    "Lifestyle","Walkaround Focus","Primary Driver","Decision Influencers",
    "Must Haves","Notes","Duration (sec)"
  ];
  const esc = (v) => {
    if (v == null) return "";
    const s = Array.isArray(v) ? v.join(", ") : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  rows.forEach(r => {
    lines.push([
      new Date(r.submitted_at).toLocaleDateString(), r.salesperson, r.customer, r.stock,
      r.vehicle_year, r.vehicle_make, r.vehicle_model,
      r.motivation, r.has_trade ? "Yes" : "No", r.trade_vehicle, r.trade_like, r.trade_dislike,
      r.trade_lender, r.trade_balance, r.trade_payment,
      r.recent_vehicle, r.recent_like, r.recent_dislike,
      r.lifestyle, r.hot_buttons?.map(h => walkaroundLabels[h] || h), r.primary_driver, r.decision_influencers,
      r.must_haves, r.notes, r.duration,
    ].map(esc).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `discovery-assessments-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

export default function Dashboard() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("");
  const [period, setPeriod] = useState("today");

  const load = async (p) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard", { headers: { "x-pin": p } });
      if (!res.ok) throw new Error(res.status === 401 ? "Invalid PIN" : "Failed to load");
      const json = await res.json();
      setData(json);
      setAuthed(true);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  const handlePin = (e) => { e.preventDefault(); load(pin); };

  useEffect(() => {
    if (!authed) return;
    const i = setInterval(() => load(pin), 30000);
    return () => clearInterval(i);
  }, [authed, pin]);

  if (!authed) {
    return (
      <div style={{ fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: B.lg }}>
        <form onSubmit={handlePin} style={{ background: B.w, padding: 40, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: 360 }}>
          <div style={{ background: B.red, width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: B.w, fontSize: 24 }}>&#128202;</span>
          </div>
          <h2 style={{ margin: "0 0 8px", color: B.blk, fontSize: 20 }}>Manager Dashboard</h2>
          <p style={{ margin: "0 0 20px", color: "#888", fontSize: 13 }}>Fred Anderson Toyota of Cape Coral</p>
          <input
            type="password" value={pin} onChange={e => setPin(e.target.value)}
            placeholder="Enter PIN"
            style={{ fontFamily: F, fontSize: 24, textAlign: "center", padding: "12px 16px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box", letterSpacing: 8, outline: "none" }}
            autoFocus
          />
          <button type="submit" disabled={loading} style={{
            fontFamily: F, fontSize: 14, fontWeight: 700, padding: "12px 24px", borderRadius: 8,
            background: B.red, color: B.w, border: "none", cursor: "pointer", width: "100%", marginTop: 12,
          }}>
            {loading ? "Loading..." : "View Dashboard"}
          </button>
          {err && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{err}</p>}
        </form>
      </div>
    );
  }

  const { submissions: allSubs, stats: allStats, bySp: allBySp, byDay } = data;

  /* ── Filter by time period ── */
  const cutoff = PERIODS.find(p => p.key === period).fn();
  const submissions = allSubs.filter(s => new Date(s.submitted_at) >= cutoff);

  /* ── Compute stats for filtered period ── */
  const total = submissions.length;
  const avgDur = total > 0 ? Math.round(submissions.reduce((a, s) => a + (s.duration || 0), 0) / total) : 0;

  const spMap = {};
  submissions.forEach(s => {
    if (!s.salesperson) return;
    if (!spMap[s.salesperson]) spMap[s.salesperson] = { count: 0, totalDur: 0 };
    spMap[s.salesperson].count++;
    spMap[s.salesperson].totalDur += s.duration || 0;
  });
  const bySp = Object.entries(spMap)
    .map(([name, d]) => ({ salesperson: name, count: d.count, avg_dur: Math.round(d.totalDur / d.count) }))
    .sort((a, b) => b.count - a.count);

  const activeSp = bySp.length;
  const notSubmitted = ALL_SALESPEOPLE.filter(n => !spMap[n]);
  const maxCount = bySp.length > 0 ? Math.max(...bySp.map(s => s.count)) : 1;

  // Hot buttons for period
  const hotCounts = {};
  submissions.forEach(s => {
    (s.hot_buttons || []).forEach(h => { hotCounts[h] = (hotCounts[h] || 0) + 1; });
  });
  const topHot = Object.entries(hotCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Filtered by salesperson
  const filtered = filter
    ? submissions.filter(s => s.salesperson?.toLowerCase().includes(filter.toLowerCase()))
    : submissions;

  /* ── Detail view ── */
  if (selected) {
    const s = selected;
    const Row = ({ label, value }) => value ? (
      <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 14, fontFamily: F }}>
        <span style={{ color: "#888", minWidth: 120, fontWeight: 600 }}>{label}</span>
        <span style={{ color: "#333", flex: 1 }}>{value}</span>
      </div>
    ) : null;
    return (
      <div style={{ fontFamily: F, maxWidth: 700, margin: "0 auto", padding: 20, background: B.lg, minHeight: "100vh" }}>
        <button onClick={() => setSelected(null)} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: B.red, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>&larr; Back to Dashboard</button>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, color: B.blk }}>{s.customer || "Customer"}</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>{s.salesperson} &bull; {new Date(s.submitted_at).toLocaleString()}</p>
            </div>
            <span style={{ background: B.red, color: B.w, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{fmt(s.duration)}</span>
          </div>
          {s.stock && <Row label="Stock #" value={s.stock} />}
          <Row label="Vehicle" value={[s.vehicle_year, s.vehicle_make, s.vehicle_model].filter(Boolean).join(" ")} />
          <Row label="Motivation" value={s.motivation} />
        </Card>
        {s.has_trade && s.trade_vehicle && (
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase" }}>Trade-In</h4>
            <Row label="Vehicle" value={s.trade_vehicle} />
            <Row label="Loves" value={s.trade_like} />
            <Row label="Wishes Different" value={s.trade_dislike} />
            <Row label="Lender" value={s.trade_lender} />
            <Row label="Balance" value={s.trade_balance} />
            <Row label="Payment" value={s.trade_payment} />
          </Card>
        )}
        {!s.has_trade && s.recent_vehicle && (
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase" }}>Recent Vehicle</h4>
            <Row label="Driving" value={s.recent_vehicle} />
            <Row label="Liked" value={s.recent_like} />
            <Row label="Didn't Work" value={s.recent_dislike} />
          </Card>
        )}
        {s.lifestyle?.length > 0 && (
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase" }}>Lifestyle</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {s.lifestyle.map(l => <span key={l} style={{ background: "#F0F0F0", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#555" }}>{l}</span>)}
            </div>
          </Card>
        )}
        {s.hot_buttons?.length > 0 && (
          <Card style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#1E3A5F", textTransform: "uppercase" }}>Walkaround Focus</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {s.hot_buttons.map(h => <span key={h} style={{ background: B.red, color: B.w, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{walkaroundLabels[h] || h}</span>)}
            </div>
          </Card>
        )}
        {(s.must_haves || s.notes) && (
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase" }}>Key Notes</h4>
            <Row label="Must-Haves" value={s.must_haves} />
            <Row label="Notes" value={s.notes} />
          </Card>
        )}
        {(s.primary_driver || s.decision_influencers) && (
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase" }}>Decision Makers</h4>
            <Row label="Primary Driver" value={s.primary_driver} />
            <Row label="Influencers" value={s.decision_influencers} />
          </Card>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, maxWidth: 900, margin: "0 auto", padding: 20, background: B.lg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: B.blk }}>Manager Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Fred Anderson Toyota of Cape Coral</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => downloadCSV(filtered)} style={{
            fontFamily: F, fontSize: 12, fontWeight: 600, color: B.w, background: B.red,
            border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer",
          }}>
            Download CSV
          </button>
          <button onClick={() => load(pin)} style={{
            fontFamily: F, fontSize: 12, fontWeight: 600, color: "#888", background: "#f0f0f0",
            border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
          }}>
            Refresh
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: B.w, borderRadius: 10, padding: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={{
            fontFamily: F, fontSize: 13, fontWeight: 600, flex: 1, padding: "10px 8px",
            borderRadius: 8, border: "none", cursor: "pointer",
            background: period === p.key ? B.red : "transparent",
            color: period === p.key ? B.w : "#888",
            transition: "all 0.15s",
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Stat label="Assessments" value={total} sub={period !== "all" ? `${allStats.total} all time` : undefined} />
        <Stat label="Avg Discovery" value={fmt(avgDur)} />
        <Stat label="Active Salespeople" value={activeSp} sub={`of ${ALL_SALESPEOPLE.length}`} />
        <Stat label="Haven't Submitted" value={notSubmitted.length} sub={notSubmitted.length === 0 ? "Everyone's in!" : "Need follow-up"} />
      </div>

      {/* Salesperson Leaderboard */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: B.blk }}>Salesperson Leaderboard</h3>
          <span style={{ fontSize: 11, color: "#888" }}>{PERIODS.find(p => p.key === period).label}</span>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#888" }}>Ranked by assessments completed</p>

        {bySp.length === 0 && <p style={{ fontSize: 13, color: "#888" }}>No submissions this period.</p>}
        {bySp.map((s, i) => (
          <div key={s.salesperson} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
            borderBottom: "1px solid #f0f0f0", cursor: "pointer",
          }} onClick={() => setFilter(filter === s.salesperson ? "" : s.salesperson)}>
            <span style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: B.w, fontFamily: F,
              background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#ddd",
              ...(i > 2 ? { color: "#888" } : {}),
            }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: filter === s.salesperson ? B.red : B.blk }}>{s.salesperson}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                <div style={{ flex: 1, maxWidth: 180, height: 6, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(s.count / maxCount) * 100}%`, background: B.grn, borderRadius: 3 }} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.blk }}>{s.count}</div>
              <div style={{ fontSize: 11, color: "#888" }}>Avg {fmt(s.avg_dur)}</div>
            </div>
          </div>
        ))}

        {notSubmitted.length > 0 && (
          <>
            <div style={{ margin: "16px 0 10px", padding: "8px 12px", background: "#FEF3C7", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>&#9888;&#65039;</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>
                {notSubmitted.length} salesperson{notSubmitted.length !== 1 ? "s" : ""} with zero submissions
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {notSubmitted.map(n => (
                <span key={n} style={{
                  background: "#FEE2E2", color: "#991B1B", padding: "4px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600,
                }}>{n}</span>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Top Hot Buttons */}
      {topHot.length > 0 && (
        <Card>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, color: B.blk }}>Top Walkaround Focus Areas</h3>
          {topHot.map(([key, count]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{walkaroundLabels[key] || key}</div>
              <div style={{ width: 140, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / total) * 100}%`, background: B.red, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, color: "#888", minWidth: 30, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Daily Activity */}
      {byDay.length > 0 && (
        <Card>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, color: B.blk }}>Daily Activity</h3>
          {byDay.slice(0, 14).map(d => (
            <div key={d.day} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#888", minWidth: 90, fontFamily: F }}>{new Date(d.day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              <div style={{ flex: 1, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(d.count / Math.max(...byDay.map(x => x.count))) * 100}%`, background: B.red, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, color: "#888", minWidth: 20, textAlign: "right" }}>{d.count}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Recent Submissions */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: B.blk }}>
            {filter ? `${filter}'s Assessments` : "Assessments"}
          </h3>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {filter && (
              <button onClick={() => setFilter("")} style={{ fontFamily: F, fontSize: 11, color: B.red, background: "none", border: `1px solid ${B.red}`, borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
                Clear Filter
              </button>
            )}
            <span style={{ fontSize: 11, color: "#888" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        {filtered.length === 0 && <p style={{ fontSize: 13, color: "#888" }}>No assessments this period.</p>}
        {filtered.slice(0, 50).map(s => (
          <div key={s.id} onClick={() => setSelected(s)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0",
            borderBottom: "1px solid #f0f0f0", cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.blk }}>{s.customer || "\u2014"}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {s.salesperson} &bull; {new Date(s.submitted_at).toLocaleString()}
                {s.stock ? ` \u2022 #${s.stock}` : ""}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {s.hot_buttons?.length > 0 && (
                <span style={{ fontSize: 11, color: "#1E3A5F", background: "#E0F2FE", padding: "2px 8px", borderRadius: 10 }}>
                  {s.hot_buttons.length} focus
                </span>
              )}
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>{fmt(s.duration)}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
