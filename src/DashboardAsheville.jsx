import { useState, useEffect } from "react";
import { Search, PackageCheck, Compass, Clock, CheckCircle2, AlertTriangle, X } from "lucide-react";

const LOGO = "/logo-asheville.png";
const B = { red: "#C8102E", blk: "#1A1A1A", w: "#FFF", lg: "#F5F5F5", amber: "#B45309", grn: "#15803D", blue: "#2563EB" };
const F = "'Helvetica Neue',Helvetica,Arial,sans-serif";

const AVAIL = {
  locate:   { label: "Dealer Trade", icon: Search,       tone: B.amber, bg: "#FFF7ED", br: "#FED7AA" },
  instock:  { label: "In Stock",     icon: PackageCheck, tone: B.grn,   bg: "#F0FDF4", br: "#BBF7D0" },
  shopping: { label: "Still Shopping", icon: Compass,    tone: B.blue,  bg: "#EFF6FF", br: "#BFDBFE" },
};

const FLEX = { yes: "Color flexible", no: "Color is FIRM", depends: "Depends on equipment" };
const COMMIT = { yes: "Ready to commit", think: "Needs to think", no: "Not ready" };
const PRIO = { color: "Color matters more", equipment: "Equipment matters more" };

const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const startOfYesterday = () => { const x = startOfDay(new Date()); x.setDate(x.getDate() - 1); return x; };
const getMonday = d => { const x = startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() - (day === 0 ? 6 : day - 1)); return x; };
const startOfMonth = d => { const x = startOfDay(d); x.setDate(1); return x; };
const FAR_FUTURE = new Date(8640000000000000);

const PERIODS = [
  { key: "today",     label: "Today",         range: () => ({ start: startOfDay(new Date()), end: FAR_FUTURE }) },
  { key: "yesterday", label: "Yesterday",     range: () => ({ start: startOfYesterday(), end: startOfDay(new Date()) }) },
  { key: "wtd",       label: "Week to Date",  range: () => ({ start: getMonday(new Date()), end: FAR_FUTURE }) },
  { key: "mtd",       label: "Month to Date", range: () => ({ start: startOfMonth(new Date()), end: FAR_FUTURE }) },
  { key: "all",       label: "All Time",      range: () => ({ start: new Date(0), end: FAR_FUTURE }) },
];

const fmt = s => `${Math.floor((s || 0) / 60)}:${String((s || 0) % 60).padStart(2, "0")}`;

/* ── DEMO DATA (?demo=1) — fake submissions for showing the tool before it's live ── */
const hrsAgo = h => new Date(Date.now() - h * 3600e3).toISOString();
let _id = 100;
const L = (sp, cn, stk, hrs, dur, o1, o1c, o1alt, o1e, o1no, o2, o2c, o2n, o3, o3c, o3n, flex, prio, time, commit, notes, extra = {}) => ({
  id: _id++, salesperson: sp, customer: cn, stock: stk, availability: "locate", has_trade: !!extra.tv, duration: dur, submitted_at: hrsAgo(hrs),
  data: { o1model: o1[0], o1trim: o1[1], o1colors: o1c, o1alt, o1equip: o1e, o1no, o2model: o2[0], o2trim: o2[1], o2colors: o2c, o2note: o2n,
          o3model: o3[0], o3trim: o3[1], o3colors: o3c, o3note: o3n, flexColor: flex, priority: prio, timeline: time, commit, locnotes: notes, ...extra },
});
const S = (sp, cn, stk, hrs, dur, vy, vmod, vtrim, vcolor, seen, extra = {}) => ({
  id: _id++, salesperson: sp, customer: cn, stock: stk, availability: "instock", has_trade: !!extra.tv, duration: dur, submitted_at: hrsAgo(hrs),
  data: { vy, vmod, vtrim, vcolor, seen, ...extra },
});
const W = (sp, cn, hrs, dur, extra = {}) => ({
  id: _id++, salesperson: sp, customer: cn, stock: "", availability: "shopping", has_trade: !!extra.tv, duration: dur, submitted_at: hrsAgo(hrs),
  data: { ...extra },
});

const DEMO_SUBS = [
  // ── Today ──
  L("Reid Callahan", "Sarah Whitfield", "T26-1044", 2, 512,
    ["Grand Highlander", "Limited"], ["Midnight Black"], ["Magnetic Gray", "Blueprint"], ["3rd Row", "AWD / 4WD", "Leather Seats"], "No cloth seats. Will not take white.",
    ["Highlander", "XLE"], ["Blueprint"], "Same 3rd row, saves about $60/mo",
    ["RAV4", "XLE Premium"], ["Army Green"], "Smaller, but has every feature she listed",
    "no", "equipment", "This week", "yes", "Third kid due in October — needs it before then",
    { mot: "Third kid on the way, Pilot is too tight", tv: "2019 Honda Pilot EX-L, 78k", tlike: "Reliable, easy to park", tdis: "Third row is useless", tlen: "Honda Financial", tbal: "$14,200", tpay: "$465/mo", life: ["Family", "Road Trips", "Safety First"], mh: "Third row is non-negotiable", pd: "Sarah", di: "Husband Kevin — wants to see it Saturday" }),
  S("Marisol Vega", "Marcus Doyle", "T26-2210", 3, 341, "2026", "Tacoma", "TRD Off-Road", "Solar Octane", "Yes — walked it",
    { mot: "Weekend truck, hunting lease in Madison County", rv: "2015 Tundra", rl: "Never let him down", rd: "Too big for the driveway", life: ["Off-Road", "Towing / Hauling"], mh: "Needs a bed liner and tow package" }),
  L("Trent Boykin", "Priya Raman", "T26-3387", 5, 638,
    ["4Runner", "TRD Pro"], ["Army Green"], ["Underground"], ["AWD / 4WD", "Sunroof / Moonroof", "Roof Rails"], "No 2WD. No beige interior.",
    ["4Runner", "Limited"], ["Midnight Black"], "Softer ride — her husband prefers it",
    ["Grand Highlander", "Platinum"], ["Magnetic Gray"], "If they decide they want more room",
    "depends", "equipment", "2-4 weeks", "think", "Cross-shopping a Bronco. Get her in the TRD Pro this week.",
    { mot: "Moving to Black Mountain, wants something for the snow", tv: "2021 Subaru Outback", life: ["Off-Road", "Road Trips"], mh: "Must handle the mountain in winter" }),
  W("Reid Callahan", "Ellen Park", 6, 218,
    { mot: "Lease ends next month, just starting to look", tv: "2022 Corolla LE", life: ["Daily Commute", "Fuel Economy"], mh: "Wants payment under $400" }),
  S("Devin Oakley", "Curtis Lyle", "T26-1877", 8, 402, "2026", "Camry", "SE", "Celestial Silver", "Yes — walked it",
    { mot: "Old Altima finally died", tv: "2012 Nissan Altima, 190k", life: ["Daily Commute", "Fuel Economy"], mh: "CarPlay and good gas mileage" }),

  // ── Yesterday ──
  L("Marisol Vega", "Dana Cho", "T26-1190", 26, 727,
    ["RAV4 Hybrid", "XSE"], ["Blueprint"], ["Midnight Black", "Ice Cap"], ["AWD / 4WD", "Sunroof / Moonroof", "Blind Spot Monitor"], "Won't take Super White",
    ["RAV4", "XLE Premium"], ["Blueprint", "Magnetic Gray"], "Non-hybrid if the payment works better",
    ["Corolla Cross", "XSE"], ["Ice Cap"], "Cheaper option if she has to stretch",
    "yes", "equipment", "Flexible", "yes", "Ready to sign. Just needs the right one — will wait.",
    { mot: "Commuting to Hendersonville daily, gas is killing her", tv: "2017 Ford Escape", tlike: "Cargo space", tdis: "Terrible mileage", tbal: "$3,100", tpay: "$310/mo", life: ["Daily Commute", "Fuel Economy", "Safety First"], mh: "Hybrid if the numbers work" }),
  S("Hank Wexler", "Roy Ferrante", "T26-2044", 28, 289, "2026", "Tundra", "SR5", "Midnight Black", "No — online only",
    { mot: "Contractor, needs to tow a skid steer", life: ["Towing / Hauling", "Performance"], mh: "Must tow 10k lbs" }),
  L("Trent Boykin", "Alicia Warrick", "T26-4120", 30, 594,
    ["Sienna", "XSE"], ["Midnight Black"], ["Celestial Silver"], ["3rd Row", "Power Liftgate", "Wireless Charging"], "No captain's chairs — needs the bench",
    ["Sienna", "XLE"], ["Celestial Silver", "Midnight Black"], "Same van, less money",
    ["Grand Highlander", "XLE"], ["Magnetic Gray"], "If she'll trade sliding doors for an SUV",
    "yes", "color", "This week", "yes", "Twins. She is buying this week — do not lose her over color.",
    { mot: "Twins arriving, needs sliding doors", tv: "2018 Highlander", life: ["Family", "Safety First"], mh: "Sliding doors, 8 seats" }),
  W("Devin Oakley", "Nathan Briggs", 32, 176,
    { mot: "Son turns 16 in the spring", life: ["Safety First"], mh: "Safe and cheap to insure" }),
  S("Sofia Mendes", "Grace Tolliver", "T26-1533", 34, 355, "2026", "Corolla Cross", "XLE", "Wind Chill Pearl", "Yes — walked it",
    { mot: "Downsizing after retirement", tv: "2016 4Runner", tlike: "Sat up high", tdis: "Too much truck now", life: ["Downsizing", "Fuel Economy", "Comfort / Space"], mh: "Easy to get in and out of" }),

  // ── Earlier this week ──
  L("Reid Callahan", "Miguel Ortega", "T26-2901", 50, 681,
    ["Tacoma", "TRD Sport"], ["Underground"], ["Magnetic Gray", "Solar Octane"], ["AWD / 4WD", "Tow Package", "Bed Liner"], "No white, no red",
    ["Tacoma", "SR5"], ["Magnetic Gray"], "Same truck, fewer options, better payment",
    ["Tundra", "SR5"], ["Midnight Black"], "If he decides he wants the bigger bed",
    "depends", "equipment", "2-4 weeks", "yes", "Tow package is the whole deal. Don't trade for one without it.",
    { mot: "Started a landscaping business", life: ["Towing / Hauling", "Performance"], mh: "Must tow the trailer" }),
  S("Hank Wexler", "Beth Ann Sizemore", "T26-1701", 54, 298, "2026", "Highlander", "XLE", "Magnetic Gray", "Yes — walked it",
    { mot: "Carpool for three kids", tv: "2019 Pilot", life: ["Family", "Safety First"], mh: "Third row, easy to load kids" }),
  S("Marisol Vega", "Jonah Pruitt", "T26-3055", 58, 244, "2026", "Prius", "XLE", "Supersonic Red", "No — online only",
    { mot: "Wants the best mileage he can get", life: ["Daily Commute", "Fuel Economy"], mh: "50+ mpg" }),
  L("Sofia Mendes", "Karen Dillard", "T26-2288", 72, 559,
    ["Grand Highlander", "Platinum"], ["Wind Chill Pearl"], ["Celestial Silver"], ["Leather Seats", "Panoramic Roof", "JBL Audio", "3rd Row"], "Nothing with cloth. No dark interior.",
    ["Highlander", "Platinum"], ["Wind Chill Pearl"], "Same luxury level, smaller",
    ["Sequoia", "Limited"], ["Celestial Silver"], "If she wants more presence",
    "no", "color", "Flexible", "think", "Very particular. Wants white on light interior — hard to find.",
    { mot: "Empty nesters, want something nice for road trips", tv: "2020 Lexus RX", life: ["Road Trips", "Comfort / Space", "Style / Looks"], mh: "Panoramic roof is a must" }),
  W("Trent Boykin", "Sam Whitaker", 76, 198,
    { mot: "Just looking, timeline is fuzzy", life: ["Style / Looks"], mh: "Something sporty" }),
  S("Devin Oakley", "Tara Nunnally", "T26-1466", 80, 321, "2026", "RAV4", "XLE", "Blueprint", "Yes — walked it",
    { mot: "First new car ever", tv: "2011 Civic", life: ["Daily Commute", "Safety First"], mh: "Backup camera and blind spot" }),

  // ── Earlier this month ──
  L("Hank Wexler", "Doug Rainey", "T26-3712", 170, 622,
    ["Sequoia", "TRD Pro"], ["Army Green"], ["Midnight Black"], ["AWD / 4WD", "Tow Package", "3rd Row", "JBL Audio"], "Will not take a Limited",
    ["Tundra", "TRD Pro"], ["Army Green"], "If he can live without the third row",
    ["Land Cruiser", "1958"], ["Midnight Black"], "Different vibe but he liked it online",
    "depends", "equipment", "Flexible", "yes", "Big ticket. Worth calling around the region for.",
    { mot: "Tows a camper to the Outer Banks twice a year", tv: "2018 Expedition", life: ["Towing / Hauling", "Road Trips", "Family"], mh: "Must tow 9k+" }),
  S("Sofia Mendes", "Rachel Bumgarner", "T26-1122", 196, 276, "2026", "Camry", "XSE", "Supersonic Red", "Yes — walked it",
    { mot: "Promotion, wants to treat herself", life: ["Style / Looks", "Performance"], mh: "Wants it to look sharp" }),
  L("Reid Callahan", "Terrance Hobbs", "T26-2655", 220, 704,
    ["Tundra", "Limited"], ["Magnetic Gray"], ["Midnight Black", "Underground"], ["Tow Package", "Leather Seats", "Running Boards"], "No short bed",
    ["Tundra", "SR5"], ["Magnetic Gray"], "Cheaper, still tows what he needs",
    ["Tacoma", "Limited"], ["Underground"], "If the Tundra payment is too high",
    "yes", "equipment", "2-4 weeks", "yes", "Long bed is the sticking point.",
    { mot: "Hauling equipment for work", tv: "2016 Silverado", life: ["Towing / Hauling"], mh: "Long bed, tow package" }),
  S("Marisol Vega", "Lena Cortez", "T26-1988", 244, 312, "2026", "Corolla", "SE", "Ice Cap", "Yes — walked it",
    { mot: "Daughter starting at UNCA", life: ["Daily Commute", "Safety First", "Fuel Economy"], mh: "Safe, cheap, reliable" }),
  W("Sofia Mendes", "Cliff Hendricks", 268, 187,
    { mot: "Truck is paid off, wondering if now is the time", tv: "2014 Tacoma", life: ["Off-Road"], mh: "Only if the numbers make sense" }),
  L("Devin Oakley", "Yvonne Brashear", "T26-4401", 292, 588,
    ["RAV4 Prime", "XSE"], ["Supersonic Red"], ["Midnight Black", "Blueprint"], ["AWD / 4WD", "Sunroof / Moonroof", "Wireless Charging"], "Not interested in a regular hybrid",
    ["RAV4 Hybrid", "XSE"], ["Supersonic Red"], "If the Prime is impossible to find",
    ["Corolla Cross", "XSE"], ["Blueprint"], "Backup if she wants to spend less",
    "depends", "equipment", "Flexible", "think", "Prime is scarce. Set expectations early.",
    { mot: "Wants to plug in at home, has solar", tv: "2019 CR-V", life: ["Fuel Economy", "Tech & Features", "Daily Commute"], mh: "Plug-in capability" }),
  S("Trent Boykin", "Owen Falkner", "T26-2377", 316, 265, "2026", "4Runner", "SR5 Premium", "Underground", "No — online only",
    { mot: "Outdoor guide, needs clearance", life: ["Off-Road", "Road Trips"], mh: "Ground clearance and roof rack" }),
];

const Card = ({ children, style: s }) => (
  <div style={{ background: B.w, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 16, ...s }}>{children}</div>
);

const Stat = ({ label, value, sub, tone }) => (
  <Card style={{ textAlign: "center", padding: 16, marginBottom: 0 }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: tone || B.red, fontFamily: F }}>{value}</div>
    <div style={{ fontSize: 11, color: "#888", fontFamily: F, marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#aaa", fontFamily: F, marginTop: 2 }}>{sub}</div>}
  </Card>
);

const Badge = ({ avail }) => {
  const a = AVAIL[avail];
  if (!a) return null;
  const Ic = a.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, background: a.bg, color: a.tone,
      border: `1px solid ${a.br}`, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: F, whiteSpace: "nowrap",
    }}>
      <Ic size={11} /> {a.label}
    </span>
  );
};

/* Ranked bar list — used for most-requested models / colors / equipment */
const RankList = ({ items, empty }) => {
  if (!items.length) return <p style={{ fontSize: 13, color: "#888", fontFamily: F, margin: 0 }}>{empty}</p>;
  const max = items[0][1];
  return items.map(([name, n]) => (
    <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, fontFamily: F, color: B.blk }}>{name}</div>
      <div style={{ width: 120, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(n / max) * 100}%`, background: B.amber, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, color: "#888", minWidth: 22, textAlign: "right", fontFamily: F }}>{n}</span>
    </div>
  ));
};

const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1";

export default function DashboardAsheville() {
  const [allSubs, setAllSubs] = useState(isDemo ? DEMO_SUBS : []);
  const [loading, setLoading] = useState(!isDemo);
  const [err, setErr] = useState(null);
  const [period, setPeriod] = useState("wtd");
  const [availFilter, setAvailFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [logoOk, setLogoOk] = useState(true);

  useEffect(() => {
    if (isDemo) return;
    fetch("/api/dashboard-asheville")
      .then(r => r.json())
      .then(j => {
        if (j.error) setErr(j.error);
        else setAllSubs(j.submissions || []);
        setLoading(false);
      })
      .catch(e => { setErr(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ fontFamily: F, padding: 40, textAlign: "center", color: "#888" }}>Loading...</div>;
  if (err) return <div style={{ fontFamily: F, padding: 40, textAlign: "center", color: B.red }}>Error: {err}</div>;

  const { start, end } = PERIODS.find(p => p.key === period).range();
  const subs = allSubs.filter(s => {
    const d = new Date(s.submitted_at);
    return d >= start && d < end;
  });

  const total = subs.length;
  const locates = subs.filter(s => s.availability === "locate");
  const instock = subs.filter(s => s.availability === "instock");
  const shopping = subs.filter(s => s.availability === "shopping");
  const pct = n => total > 0 ? Math.round((n / total) * 100) : 0;
  const avgDur = total ? Math.round(subs.reduce((a, x) => a + (x.duration || 0), 0) / total) : 0;

  /* ── What locate customers are asking for — this is the stocking signal ── */
  const tally = (arr) => Object.entries(arr.reduce((m, k) => { if (k) m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]);
  const D = s => s.data || {};
  const topModels = tally(locates.flatMap(s => [D(s).o1model, D(s).o2model, D(s).o3model].filter(Boolean).map(m => m.trim())));
  const topColors = tally(locates.flatMap(s => D(s).o1colors || []));
  const topEquip  = tally(locates.flatMap(s => D(s).o1equip || []));

  /* Commitment quality on locate requests — are we chasing cars for buyers or tire-kickers? */
  const readyCount = locates.filter(s => D(s).commit === "yes").length;
  const firmColor = locates.filter(s => D(s).flexColor === "no").length;

  /* Activity by salesperson, split by type */
  const spMap = {};
  subs.forEach(s => {
    const n = s.salesperson || "Unknown";
    if (!spMap[n]) spMap[n] = { total: 0, locate: 0, instock: 0, shopping: 0 };
    spMap[n].total++;
    if (spMap[n][s.availability] !== undefined) spMap[n][s.availability]++;
  });
  const spList = Object.entries(spMap).sort((a, b) => b[1].total - a[1].total);

  const listed = availFilter ? subs.filter(s => s.availability === availFilter) : subs;

  const SplitSeg = ({ n, tone, label }) => {
    if (!n) return null;
    return <div title={`${label}: ${n}`} style={{ width: `${(n / total) * 100}%`, background: tone, height: "100%" }} />;
  };

  return (
    <div style={{ fontFamily: F, background: B.lg, minHeight: "100vh", padding: "20px 16px 60px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          {logoOk
            ? <img src={LOGO} alt="Fred Anderson Toyota of Asheville" onError={() => setLogoOk(false)} style={{ height: 54, objectFit: "contain" }} />
            : <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: B.blk, letterSpacing: 0.5 }}>FRED ANDERSON TOYOTA</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.red, letterSpacing: 2.5, marginTop: 3 }}>OF ASHEVILLE</div>
              </div>
          }
          <h1 style={{ fontSize: 20, margin: 0, color: B.blk }}>Needs Assessment Dashboard</h1>
        </div>

        {/* DEMO BANNER */}
        {isDemo && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", marginBottom: 16,
            background: "#FEF9C3", border: "1.5px solid #FDE047", borderRadius: 10,
          }}>
            <AlertTriangle size={15} color="#854D0E" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#854D0E" }}>Sample data</span>
            <span style={{ fontSize: 12, color: "#854D0E" }}>
              These are made-up submissions for demonstration. Nothing here is a real customer.
            </span>
          </div>
        )}

        {/* PERIOD TABS */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} style={{
              fontFamily: F, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
              border: period === p.key ? `2px solid ${B.red}` : "1.5px solid #e0e0e0",
              background: period === p.key ? "#FFF0F0" : B.w, color: period === p.key ? B.red : "#666", cursor: "pointer",
            }}>{p.label}</button>
          ))}
        </div>

        {/* STATS — dealer trade vs in stock front and center */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
          <Stat label="Assessments" value={total} />
          <Stat label="Dealer Trade Requests" value={locates.length} sub={`${pct(locates.length)}% of assessments`} tone={B.amber} />
          <Stat label="In-Stock Units" value={instock.length} sub={`${pct(instock.length)}% of assessments`} tone={B.grn} />
          <Stat label="Still Shopping" value={shopping.length} sub={`${pct(shopping.length)}% of assessments`} tone={B.blue} />
          <Stat label="Avg Discovery" value={fmt(avgDur)} />
        </div>

        {/* SPLIT BAR */}
        {total > 0 && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15, color: B.blk }}>Where the business is coming from</h3>
              <span style={{ fontSize: 11, color: "#888" }}>{PERIODS.find(p => p.key === period).label}</span>
            </div>
            <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: "#eee", marginBottom: 10 }}>
              <SplitSeg n={locates.length} tone={B.amber} label="Dealer Trade" />
              <SplitSeg n={instock.length} tone={B.grn} label="In Stock" />
              <SplitSeg n={shopping.length} tone={B.blue} label="Still Shopping" />
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {[
                { n: locates.length, tone: B.amber, label: "Dealer Trade" },
                { n: instock.length, tone: B.grn, label: "In Stock" },
                { n: shopping.length, tone: B.blue, label: "Still Shopping" },
              ].map(x => (
                <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: x.tone }} />
                  <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>{x.label}</span>
                  <span style={{ fontSize: 12, color: "#999" }}>{x.n} ({pct(x.n)}%)</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* LOCATE REQUESTS — the actionable queue */}
        <Card style={{ borderTop: `4px solid ${B.amber}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Search size={17} color={B.amber} />
              <h3 style={{ margin: 0, fontSize: 15, color: B.blk }}>Dealer Trade Requests</h3>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#666" }}>
              <span><strong style={{ color: B.grn }}>{readyCount}</strong> ready to commit</span>
              <span><strong style={{ color: B.red }}>{firmColor}</strong> color is firm</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px" }}>Cars we need to go get. Click one for the full locate profile.</p>

          {locates.length === 0 && <p style={{ fontSize: 13, color: "#888", margin: 0 }}>No dealer trade requests this period.</p>}

          {locates.map(s => {
            const d = D(s);
            const opts = [d.o1model, d.o2model, d.o3model].filter(Boolean);
            return (
              <div key={s.id} onClick={() => setSelected(s)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "10px 12px", marginBottom: 6, borderRadius: 8, cursor: "pointer",
                background: "#FFFBF5", border: "1px solid #FED7AA",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: B.blk }}>
                    {s.customer || "—"}
                    {s.stock && <span style={{ color: "#999", fontWeight: 500 }}> · #{s.stock}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                    {[d.o1model, d.o1trim].filter(Boolean).join(" ") || "—"}
                    {(d.o1colors || []).length > 0 && ` · ${d.o1colors.join(" / ")}`}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    {s.salesperson} · {opts.length} option{opts.length !== 1 ? "s" : ""} · {new Date(s.submitted_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {d.commit === "yes" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0FDF4", color: B.grn, border: "1px solid #BBF7D0", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  )}
                  {d.flexColor === "no" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF2F2", color: B.red, border: "1px solid #FECACA", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      <AlertTriangle size={11} /> Color firm
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{fmt(s.duration)}</span>
                </div>
              </div>
            );
          })}
        </Card>

        {/* WHAT LOCATE CUSTOMERS WANT — stocking signal */}
        {locates.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 16 }}>
            <Card style={{ marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, color: B.blk }}>Most Requested Models</h3>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 12px" }}>Across all three options — what we keep having to chase.</p>
              <RankList items={topModels.slice(0, 8)} empty="No models yet." />
            </Card>
            <Card style={{ marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, color: B.blk }}>Most Requested Colors</h3>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 12px" }}>First-choice colors on locate requests.</p>
              <RankList items={topColors.slice(0, 8)} empty="No colors yet." />
            </Card>
            <Card style={{ marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, color: B.blk }}>Must-Have Equipment</h3>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 12px" }}>What customers won't do without.</p>
              <RankList items={topEquip.slice(0, 8)} empty="No equipment yet." />
            </Card>
          </div>
        )}

        {/* SALESPERSON ACTIVITY — split by type */}
        {spList.length > 0 && (
          <Card>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, color: B.blk }}>Activity by Salesperson</h3>
            {spList.map(([name, x]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: B.blk, minWidth: 160 }}>{name}</div>
                <div style={{ flex: 1, display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "#eee" }}>
                  {x.locate > 0 &&   <div style={{ width: `${(x.locate / x.total) * 100}%`, background: B.amber }} />}
                  {x.instock > 0 &&  <div style={{ width: `${(x.instock / x.total) * 100}%`, background: B.grn }} />}
                  {x.shopping > 0 && <div style={{ width: `${(x.shopping / x.total) * 100}%`, background: B.blue }} />}
                </div>
                <span style={{ fontSize: 11, color: B.amber, fontWeight: 700, minWidth: 60, textAlign: "right" }}>{x.locate} trade</span>
                <span style={{ fontSize: 11, color: B.grn, fontWeight: 700, minWidth: 60, textAlign: "right" }}>{x.instock} stock</span>
                <span style={{ fontSize: 12, color: "#666", fontWeight: 700, minWidth: 28, textAlign: "right" }}>{x.total}</span>
              </div>
            ))}
          </Card>
        )}

        {/* ALL ASSESSMENTS */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: B.blk }}>All Assessments</h3>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ k: "", l: "All" }, { k: "locate", l: "Dealer Trade" }, { k: "instock", l: "In Stock" }, { k: "shopping", l: "Shopping" }].map(o => (
                <button key={o.k} onClick={() => setAvailFilter(o.k)} style={{
                  fontFamily: F, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                  border: availFilter === o.k ? `1.5px solid ${B.red}` : "1px solid #e0e0e0",
                  background: availFilter === o.k ? "#FFF0F0" : B.w, color: availFilter === o.k ? B.red : "#777", cursor: "pointer",
                }}>{o.l}</button>
              ))}
            </div>
          </div>
          {listed.length === 0 && <p style={{ fontSize: 13, color: "#888" }}>No assessments this period.</p>}
          {listed.map(s => (
            <div key={s.id} onClick={() => setSelected(s)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0",
              borderBottom: "1px solid #f0f0f0", cursor: "pointer", gap: 10,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.blk }}>
                  {s.customer || "—"}{s.stock && <span style={{ color: "#999", fontWeight: 500 }}> · #{s.stock}</span>}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{s.salesperson} · {new Date(s.submitted_at).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <Badge avail={s.availability} />
                <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>{fmt(s.duration)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "flex-start", justifyContent: "center", padding: 20, overflowY: "auto", zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ background: B.w, borderRadius: 12, maxWidth: 620, width: "100%", padding: 24, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, color: B.blk }}>{selected.customer || "Customer"}</h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                  {selected.salesperson} · {new Date(selected.submitted_at).toLocaleString()}
                  {selected.stock && ` · Stock #${selected.stock}`}
                </p>
                <div style={{ marginTop: 8 }}><Badge avail={selected.availability} /></div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} color="#888" />
              </button>
            </div>

            {(() => {
              const d = selected.data || {};
              const Row = ({ label, value }) => {
                if (!value || (Array.isArray(value) && !value.length)) return null;
                return (
                  <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: "#888", minWidth: 130, fontWeight: 600, flexShrink: 0 }}>{label}</span>
                    <span style={{ color: "#333", flex: 1 }}>{Array.isArray(value) ? value.join(", ") : value}</span>
                  </div>
                );
              };
              const H = ({ children }) => (
                <h4 style={{ margin: "16px 0 8px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</h4>
              );

              return (
                <>
                  {selected.availability === "locate" && (
                    <div style={{ background: "#FFF7ED", border: "2px solid #F59E0B", borderRadius: 10, padding: 14, marginTop: 10 }}>
                      <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: B.amber, textTransform: "uppercase", letterSpacing: 0.5 }}>Locate Profile</h4>
                      <Row label="Option 1" value={[d.o1model, d.o1trim].filter(Boolean).join(" ")} />
                      <Row label="Preferred color" value={d.o1colors} />
                      <Row label="Will also take" value={d.o1alt} />
                      <Row label="Must have" value={d.o1equip} />
                      <Row label="Will NOT accept" value={d.o1no} />
                      <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
                      <Row label="Option 2" value={[d.o2model, d.o2trim].filter(Boolean).join(" ")} />
                      <Row label="Colors OK" value={d.o2colors} />
                      <Row label="Why it works" value={d.o2note} />
                      <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
                      <Row label="Option 3" value={[d.o3model, d.o3trim].filter(Boolean).join(" ")} />
                      <Row label="Colors OK" value={d.o3colors} />
                      <Row label="Why it works" value={d.o3note} />
                      <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
                      <Row label="Color flexible?" value={FLEX[d.flexColor]} />
                      <Row label="Bigger priority" value={PRIO[d.priority]} />
                      <Row label="Timeline" value={d.timeline} />
                      <Row label="Commitment" value={COMMIT[d.commit]} />
                      <Row label="Locate notes" value={d.locnotes} />
                    </div>
                  )}

                  {selected.availability === "instock" && (
                    <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 10, padding: 14, marginTop: 10 }}>
                      <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: B.grn, textTransform: "uppercase", letterSpacing: 0.5 }}>In-Stock Unit</h4>
                      <Row label="Vehicle" value={[d.vy, d.vmod, d.vtrim].filter(Boolean).join(" ")} />
                      <Row label="Color" value={d.vcolor} />
                      <Row label="Seen in person" value={d.seen} />
                    </div>
                  )}

                  {d.mot && <><H>Motivation</H><p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.5 }}>{d.mot}</p></>}

                  {selected.has_trade && d.tv && (
                    <>
                      <H>Trade-In</H>
                      <Row label="Vehicle" value={d.tv} />
                      <Row label="Loves" value={d.tlike} />
                      <Row label="Wishes different" value={d.tdis} />
                      <Row label="Lender" value={d.tlen} />
                      <Row label="Balance" value={d.tbal} />
                      <Row label="Payment" value={d.tpay} />
                    </>
                  )}

                  {!selected.has_trade && d.rv && (
                    <>
                      <H>Recent Vehicle</H>
                      <Row label="Driving" value={d.rv} />
                      <Row label="Liked" value={d.rl} />
                      <Row label="Didn't work" value={d.rd} />
                    </>
                  )}

                  {(d.life || []).length > 0 && (
                    <>
                      <H>Lifestyle</H>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {d.life.map(li => <span key={li} style={{ background: "#F0F0F0", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#555" }}>{li}</span>)}
                      </div>
                    </>
                  )}

                  {(d.mh || d.nn) && (<><H>Key Notes</H><Row label="Must-haves" value={d.mh} /><Row label="Notes" value={d.nn} /></>)}
                  {(d.pd || d.di) && (<><H>Decision Makers</H><Row label="Primary driver" value={d.pd} /><Row label="Influencers" value={d.di} /></>)}

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, color: "#888", fontSize: 12 }}>
                    <Clock size={13} /> Discovery time: {fmt(selected.duration)}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
