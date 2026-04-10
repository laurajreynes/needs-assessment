import { useState, useEffect, useRef } from "react";
import { Clock, Printer, BarChart3, Send, RotateCcw, CheckCircle2, Star, User, Car, Users, Heart, MapPin, Map, Truck, Compass, Shield, Gauge, Sparkles, Smartphone, Fuel, Sofa, Mic, MicOff, Info, TrendingDown, Mail } from "lucide-react";

const LOGO = "/logo.png";
const SAVE_KEY = "fatcc-needs-assessment";

const B = { red: "#C8102E", dk: "#A50D24", blk: "#1A1A1A", dg: "#2D2D2D", lg: "#F5F5F5", w: "#FFF" };
const F = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/* ── STAFF DIRECTORY ── */
const SALESPEOPLE = [
  { name: "Nick Plank", email: "nplank@anderson-auto.net" },
  { name: "Kojak McKown", email: "pmckown@anderson-auto.net" },
  { name: "Bailey Hilt", email: "bhilt@anderson-auto.net" },
  { name: "D'Marcus Anthony", email: "danthony@anderson-auto.net" },
  { name: "Jody Scharping", email: "jscharping@anderson-auto.net" },
  { name: "Mario Aguilera", email: "maguilera@anderson-auto.net" },
  { name: "Will Thermidor", email: "lthermidor@anderson-auto.net" },
  { name: "Miguel Medina", email: "mmedina@anderson-auto.net" },
  { name: "Zak Banwart", email: "zbanwart@anderson-auto.net" },
  { name: "Carlos Tamayo", email: "ctamayo@anderson-auto.net" },
  { name: "Alain Pino", email: "apino@anderson-auto.net" },
  { name: "Kelly Floyd", email: "kfloyd@anderson-auto.net" },
  { name: "Damian Flores", email: "dflores@anderson-auto.net" },
  { name: "Alex Coolen", email: "acoolen@anderson-auto.net" },
  { name: "Sean Rowland", email: "srowland@anderson-auto.net" },
  { name: "Jeff Princile", email: "jprincile@anderson-auto.net" },
  { name: "Manuel Fernandez Segui", email: "mfernandezsegui@anderson-auto.net" },
  { name: "Luis Ferrer Jimenez", email: "lferrerjimenez@anderson-auto.net" },
  { name: "Jayden Hodges", email: "jayden.hodges@anderson-auto.net" },
  { name: "Louis Mazzaro", email: "lmazzaro@anderson-auto.net" },
  { name: "Matt Smith", email: "matthew.smith@anderson-auto.net" },
  { name: "Henry Rosales Guerrero", email: "henry.rosalesguerrero@anderson-auto.net" },
  { name: "Lazaro Garcia", email: "lazaro.garcia@anderson-auto.net" },
  { name: "Arlex Lacayo", email: "alacayo@anderson-auto.net" },
  { name: "Steven Herrera", email: "steven.herrera@anderson-auto.net" },
  { name: "Christian Odio", email: "christian.odio@anderson-auto.net" },
  { name: "Jessica Dykstra", email: "jdykstra@anderson-auto.net" },
  { name: "Renny Ontiveros", email: "ROntiveros@anderson-auto.net" },
  { name: "Peter Esposito", email: "PEsposito@anderson-auto.net" },
  { name: "Charles Leigh", email: "cleigh@anderson-auto.net" },
  { name: "Cody Thompson", email: "cody.thompson@anderson-auto.net" },
  { name: "Troy Sanchez", email: "tsanchez@anderson-auto.net" },
];

const MANAGER_EMAILS = [
  "jpisano@anderson-auto.net",
  "asanchez@anderson-auto.net",
  "kdepiano@anderson-auto.net",
  "mgelsleichter@anderson-auto.net",
  "kcarter@anderson-auto.net",
  "gcatalanotto@anderson-auto.net",
  "blortz@anderson-auto.net",
  "lreynes@anderson-auto.net",
];

const LIFE_ITEMS = [
  { label: "Daily Commute", icon: MapPin },
  { label: "Family", icon: Users },
  { label: "Road Trips", icon: Map },
  { label: "Towing / Hauling", icon: Truck },
  { label: "Off-Road", icon: Compass },
  { label: "Safety First", icon: Shield },
  { label: "Performance", icon: Gauge },
  { label: "Style / Looks", icon: Sparkles },
  { label: "Tech & Features", icon: Smartphone },
  { label: "Fuel Economy", icon: Fuel },
  { label: "Comfort / Space", icon: Sofa },
  { label: "Downsizing", icon: TrendingDown },
];

/* ── WALKAROUND VALUE BUILDING ──
   short = pill phrase shown by default (4-6 words)
   tip   = expanded coaching detail (tap ⓘ to reveal) */
const walkaroundGuide = {
  safety:      { label: "Safety Systems",       short: "Sensors, cameras, crash ratings",    tip: "Point out every sensor and camera on the walkaround. Show the safety rating on the window sticker." },
  fuel:        { label: "Fuel Efficiency",       short: "MPG, eco mode, cost savings",       tip: "Highlight the MPG on the sticker. Demo eco mode if available. Talk cost per mile." },
  space:       { label: "Cargo & Versatility",   short: "Trunk, fold seats, cargo room",     tip: "Pop the trunk, fold the seats, let them see and feel the space." },
  tech:        { label: "Tech & Connectivity",   short: "Touchscreen, CarPlay, audio",       tip: "Fire up the screen. Pair their phone with CarPlay or Android Auto." },
  comfort:     { label: "Ride & Comfort",        short: "Heated seats, cabin, ride quality",  tip: "Seat them inside. Show heated/cooled seats, lumbar, cabin quiet." },
  towing:      { label: "Towing Capability",     short: "Tow rating, hitch, tow mode",       tip: "Point to the tow rating on the sticker. Show hitch and tow/haul mode." },
  performance: { label: "Performance & Power",   short: "Engine, sport mode, test drive",     tip: "Review engine specs on the sticker. Demo sport mode. Let the drive speak." },
  style:       { label: "Design & Style",         short: "Exterior, wheels, lights, paint",    tip: "Step back and let them take it in. Point out LEDs, wheels, paint." },
  offroad:     { label: "Off-Road Capability",   short: "Clearance, AWD/4WD, skid plates",   tip: "Show ground clearance, AWD/4WD controls, off-road features." },
  family:      { label: "Family Friendly",       short: "Car seat anchors, space, cameras",   tip: "Show LATCH anchors, rear legroom, backup cam. Let them picture the family." },
};

/* ── SMARTER HOT BUTTON DETECTION ──
   Lifestyle tile = strong signal (3 pts).  Keyword match = 1 pt.
   Threshold = 2 pts to trigger.  So a single generic keyword alone won't fire. */
const hotBtnRules = {
  safety:      { words: ["airbag", "crash", "blind spot", "collision", "safety"],                                tiles: ["Safety First"] },
  fuel:        { words: ["gas", "fuel", "mpg", "mileage", "hybrid", "electric", "ev", "fuel economy"],          tiles: ["Daily Commute", "Fuel Economy", "Downsizing"] },
  space:       { words: ["room", "space", "cargo", "trunk", "storage", "legroom", "third row"],                  tiles: ["Comfort / Space"] },
  tech:        { words: ["tech", "screen", "carplay", "android", "bluetooth", "navigation", "wireless"],         tiles: ["Tech & Features"] },
  comfort:     { words: ["comfort", "ride", "smooth", "quiet", "leather", "heated", "cooled", "long drive"],     tiles: ["Road Trips", "Comfort / Space"] },
  towing:      { words: ["tow", "haul", "trailer", "boat", "hitch", "towing"],                                   tiles: ["Towing / Hauling"] },
  performance: { words: ["power", "engine", "fast", "turbo", "v6", "v8", "acceleration", "horsepower"],          tiles: ["Performance"] },
  style:       { words: ["look", "color", "style", "sporty", "sharp", "design", "appearance"],                   tiles: ["Style / Looks"] },
  offroad:     { words: ["off-road", "off road", "4x4", "4wd", "awd", "trail", "mud", "terrain"],               tiles: ["Off-Road"] },
  family:      { words: ["family", "kid", "children", "car seat", "stroller", "growing", "baby", "toddler"],    tiles: ["Family"] },
};

const getHot = (d) => {
  const texts = Object.entries(d).filter(([k]) => k !== "life").map(([, v]) => typeof v === "string" ? v : "").join(" ");
  const lifeSelections = d.life || [];
  const t = texts.toLowerCase();
  const scores = {};
  Object.entries(hotBtnRules).forEach(([cat, { words, tiles }]) => {
    let score = 0;
    tiles.forEach(tile => { if (lifeSelections.includes(tile)) score += 3; });
    let kwHits = 0;
    words.forEach(w => { if (t.includes(w) && kwHits < 3) { score += 1; kwHits++; } });
    if (score >= 2) scores[cat] = score;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 5);
};

const defaultData = {
  sp: "", cn: "", stk: "", vy: "", vm: "", vmod: "",
  mot: "",
  tv: "", tlike: "", tdis: "",
  tlen: "", tbal: "", tpay: "",
  rv: "", rl: "", rd: "",
  life: [], pd: "", di: "",
  mh: "", nn: "",
};

const sIn = { fontFamily: F, fontSize: 14, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box", outline: "none" };

/* ── EMAIL HTML BUILDER ── */
const buildEmailHTML = (sub) => {
  const hotLabels = (sub.hot || []).map(h => walkaroundGuide[h]?.label || h);
  const r = (label, value) => value ? `<tr><td style="padding:6px 8px;font-weight:600;color:#888;width:130px;vertical-align:top">${label}</td><td style="padding:6px 8px;color:#333">${value}</td></tr>` : "";
  const section = (title, rows) => {
    const filtered = rows.filter(Boolean).join("");
    return filtered ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">${title}</h3><table style="width:100%;border-collapse:collapse">${filtered}</table>` : "";
  };
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#C8102E;color:white;padding:16px 20px;border-radius:8px 8px 0 0;text-align:center">
      <h2 style="margin:0;font-size:18px">Discovery Assessment</h2>
      <p style="margin:6px 0 0;opacity:0.8;font-size:13px">Fred Anderson Toyota of Cape Coral</p>
    </div>
    <div style="padding:16px 20px;background:#f5f5f5;border-radius:0 0 8px 8px">
      <table style="width:100%;border-collapse:collapse">
        ${r("Customer", sub.cn)}
        ${r("Salesperson", sub.sp)}
        ${r("Date", new Date(sub.ts).toLocaleString())}
      </table>
      ${(sub.stk || sub.vm || sub.vmod) ? section("Vehicle of Interest", [r("Stock #", sub.stk), r("Vehicle", [sub.vy, sub.vm, sub.vmod].filter(Boolean).join(" "))]) : ""}
      ${sub.mot ? section("Motivation", [r("", sub.mot)]) : ""}
      ${sub.hasTrade && sub.tv ? section("Trade-In", [r("Vehicle", sub.tv), r("Loves", sub.tlike), r("Wishes Different", sub.tdis), r("Lender", sub.tlen), r("Balance", sub.tbal), r("Payment", sub.tpay)]) : ""}
      ${!sub.hasTrade && sub.rv ? section("Recent Vehicle", [r("Driving", sub.rv), r("Liked", sub.rl), r("Didn't Work", sub.rd)]) : ""}
      ${sub.life?.length > 0 ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Lifestyle</h3><p style="margin:0;font-size:14px">${sub.life.join(", ")}</p>` : ""}
      ${hotLabels.length > 0 ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Walkaround Focus</h3><p style="margin:0;font-size:14px">${hotLabels.join(", ")}</p>` : ""}
      ${(sub.mh || sub.nn) ? section("Key Notes", [r("Must-Haves", sub.mh), r("Notes", sub.nn)]) : ""}
      ${(sub.pd || sub.di) ? section("Decision Makers", [r("Primary Driver", sub.pd), r("Influencers", sub.di)]) : ""}
    </div></div>`;
};

/* ── VOICE INPUT ── */
const hasVoice = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const VoiceBtn = ({ onResult }) => {
  const [on, setOn] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    if (on && recRef.current) { recRef.current.stop(); setOn(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = "en-US";
    recRef.current = rec; setOn(true);
    rec.onresult = (e) => { onResult(e.results[0][0].transcript); setOn(false); };
    rec.onerror = () => setOn(false);
    rec.onend = () => setOn(false);
    rec.start();
  };
  if (!hasVoice) return null;
  return (
    <button onClick={toggle} type="button" style={{
      position: "absolute", right: 8, top: 8,
      background: on ? B.red : "#f0f0f0", border: "none", cursor: "pointer",
      borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background 0.2s",
    }}>
      {on ? <MicOff size={14} color={B.w} /> : <Mic size={14} color="#888" />}
    </button>
  );
};

const In = ({ value, onChange, placeholder, style: s, voice }) => (
  <div style={{ position: "relative" }}>
    <input style={{ ...sIn, ...s, ...(voice ? { paddingRight: 42 } : {}) }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={e => { e.target.style.borderColor = B.red }} onBlur={e => { e.target.style.borderColor = "#ddd" }} />
    {voice && <VoiceBtn onResult={t => onChange(value ? value + " " + t : t)} />}
  </div>
);

const TA = ({ value, onChange, placeholder, rows = 3, voice = true }) => (
  <div style={{ position: "relative" }}>
    <textarea style={{ ...sIn, minHeight: rows * 24, resize: "vertical", ...(voice ? { paddingRight: 42 } : {}) }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={e => { e.target.style.borderColor = B.red }} onBlur={e => { e.target.style.borderColor = "#ddd" }} />
    {voice && <VoiceBtn onResult={t => onChange(value ? value + " " + t : t)} />}
  </div>
);

/* ── PROGRESSIVE REVEAL ── sections fade in as they scroll into view */
const FadeIn = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      {children}
    </div>
  );
};

const Sec = ({ title, icon: Ic, children, accent }) => (
  <div style={{ marginBottom: 20, background: B.w, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    {accent && <div style={{ height: 4, background: B.red }} />}
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: B.red, borderRadius: 8, padding: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={16} color={B.w} /></div>
        <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: B.blk, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const Fl = ({ label, hint, children }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: B.dg, display: "block", marginBottom: 3 }}>{label}</label>
    {hint && <p style={{ fontFamily: F, fontSize: 11, color: "#888", margin: "0 0 3px", fontStyle: "italic" }}>{hint}</p>}
    {children}
  </div>
);

const LifeCard = ({ label, icon: Ic, sel, onClick }) => (
  <button onClick={onClick} style={{
    fontFamily: F, fontSize: 12, fontWeight: 600, padding: "14px 8px", borderRadius: 12,
    border: sel ? `2px solid ${B.red}` : "1.5px solid #e0e0e0",
    background: sel ? "#FFF0F0" : B.w, color: sel ? B.red : "#666",
    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 6, minWidth: 0, transition: "all 0.15s ease",
  }}>
    <Ic size={20} color={sel ? B.red : "#999"} strokeWidth={1.5} />
    <span style={{ lineHeight: 1.2, textAlign: "center" }}>{label}</span>
  </button>
);

const Btn = ({ children, onClick, primary, style: s }) => (
  <button onClick={onClick} style={{
    fontFamily: F, fontSize: 14, fontWeight: 700, padding: "10px 20px", borderRadius: 8,
    cursor: "pointer", border: primary ? "none" : `2px solid ${B.red}`,
    background: primary ? B.red : B.w, color: primary ? B.w : B.red,
    display: "flex", alignItems: "center", gap: 8, ...s,
  }}>{children}</button>
);

const Timer = ({ t0 }) => {
  const [n, sN] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => sN(Date.now()), 1000); return () => clearInterval(i) }, []);
  if (!t0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Clock size={14} color="#888" />
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "#888" }}>0:00</span>
        <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>Starts when you begin</span>
      </div>
    );
  }
  const d = Math.floor((n - t0) / 1000), m = Math.floor(d / 60), s = d % 60;
  const c = m < 5 ? "#22c55e" : m < 10 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color={c} />
      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: c }}>{m}:{String(s).padStart(2, "0")}</span>
      {m < 5 && <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>Take your time</span>}
      {m >= 10 && <span style={{ fontFamily: F, fontSize: 10, color: "#ef4444" }}>Keep moving</span>}
    </div>
  );
};

const SumCard = ({ title, subtitle, children }) => (
  <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 }}>
    <h4 style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: B.red, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>{title}</h4>
    {subtitle && <p style={{ margin: "0 0 8px", fontSize: 11, color: "#888", fontFamily: F, fontStyle: "italic" }}>{subtitle}</p>}
    {!subtitle && <div style={{ marginBottom: 8 }} />}
    {children}
  </div>
);

const SumRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 14, fontFamily: F }}>
      <span style={{ color: "#888", minWidth: 110, fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#333", flex: 1 }}>{value}</span>
    </div>
  );
};

/* ── HOT BUTTON PILL (form view — with expandable ⓘ) ── */
const HotPill = ({ cat, guide, expanded, onToggle }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: B.red, color: B.w, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>{guide.label}</span>
      <span style={{ fontSize: 12, color: "#555", fontFamily: F, flex: 1 }}>{guide.short}</span>
      <button onClick={() => onToggle(cat)} type="button" style={{
        background: expanded ? "#DBEAFE" : "none", border: "1.5px solid #93C5FD", cursor: "pointer",
        borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, padding: 0,
      }}>
        <Info size={12} color="#3B82F6" />
      </button>
    </div>
    {expanded && (
      <div style={{ marginTop: 6, marginLeft: 8, padding: "8px 12px", background: "#DBEAFE", borderRadius: 8, fontSize: 12, color: "#1E3A5F", fontFamily: F, lineHeight: 1.5 }}>
        {guide.tip}
      </div>
    )}
  </div>
);

/* ── LOAD SAVED STATE ── */
function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function NeedsAssessment() {
  const saved = useRef(loadSaved());

  const [view, setView] = useState("form");
  const [t0, setT0] = useState(() => saved.current?.t0 || null);
  const [hasTrade, setHasTrade] = useState(() => saved.current?.hasTrade ?? true);
  const [subs, setSubs] = useState(() => {
    try { const raw = localStorage.getItem(SAVE_KEY + "-subs"); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [d, setD] = useState(() => saved.current?.data ? { ...defaultData, ...saved.current.data } : { ...defaultData });
  const [resumed, setResumed] = useState(!!saved.current?.data?.cn);
  const [expandedHot, setExpandedHot] = useState({});
  const [emailStatus, setEmailStatus] = useState(null);

  const startTimer = () => { if (!t0) setT0(Date.now()); };
  const s = k => v => { startTimer(); setD(p => ({ ...p, [k]: v })); };
  const togLife = i => { startTimer(); setD(p => ({ ...p, life: p.life.includes(i) ? p.life.filter(x => x !== i) : [...p.life, i] })); };
  const toggleHotInfo = (key) => setExpandedHot(p => ({ ...p, [key]: !p[key] }));
  const hasVOI = d.stk.trim() !== "";
  const hot = getHot(d);
  const bottomRef = useRef(null);

  /* ── AUTO-SAVE (debounced) ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ data: d, hasTrade, t0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [d, hasTrade, t0]);

  /* ── PERSIST SUBMISSIONS ── */
  useEffect(() => {
    localStorage.setItem(SAVE_KEY + "-subs", JSON.stringify(subs));
  }, [subs]);

  /* ── DISMISS RESUME BANNER ── */
  useEffect(() => {
    if (resumed) {
      const t = setTimeout(() => setResumed(false), 4000);
      return () => clearTimeout(t);
    }
  }, [resumed]);

  const fields = [
    [d.sp, d.cn], [d.stk, d.vm, d.vmod], [d.mot],
    hasTrade ? [d.tv] : [d.rv, d.rl],
    [d.life.length > 0 ? "y" : ""], [d.pd],
    [d.mh],
  ];
  const pct = Math.round(fields.filter(g => g.some(v => v && v.toString().trim())).length / fields.length * 100);

  /* ── SEND EMAIL AUTOMATICALLY ── */
  const sendEmail = async (submission) => {
    const spInfo = SALESPEOPLE.find(p => p.name === submission.sp);
    const recipients = [...MANAGER_EMAILS];
    if (spInfo) recipients.push(spInfo.email);
    const html = buildEmailHTML(submission);
    const subject = `Discovery: ${submission.cn || "Customer"} — ${submission.sp || "Salesperson"}`;
    try {
      setEmailStatus("sending");
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject, html }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch {
      setEmailStatus("error");
    }
  };

  const submit = async () => {
    const rawDur = t0 ? Math.floor((Date.now() - t0) / 1000) : 0;
    const submission = { ...d, hasTrade, hot, ts: new Date().toISOString(), dur: Math.min(rawDur, 1800) };
    localStorage.removeItem(SAVE_KEY);
    // Fire both API calls immediately before any state changes
    const dbSave = fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }).catch(err => console.error("Submit fetch error:", err));
    const emailSend = sendEmail(submission);
    // Now update UI
    setSubs(p => [...p, submission]);
    setView("done");
    // Wait for both to finish
    await Promise.allSettled([dbSave, emailSend]);
  };

  const startNew = () => {
    localStorage.removeItem(SAVE_KEY);
    setView("form");
    setT0(null);
    setD({ ...defaultData, sp: d.sp });
    setHasTrade(true);
    setExpandedHot({});
    setEmailStatus(null);
  };

  const resetForm = () => {
    if (!confirm("Clear this assessment and start fresh?")) return;
    localStorage.removeItem(SAVE_KEY);
    setT0(null);
    setD({ ...defaultData, sp: d.sp });
    setHasTrade(true);
    setExpandedHot({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── SUBMITTED SUMMARY VIEW ── */
  if (view === "done") {
    const l = subs[subs.length - 1];
    const dur = `${Math.floor(l.dur / 60)}m ${l.dur % 60}s`;
    const hasVehicle = l.stk || l.vm || l.vmod;

    return (
      <div style={{ fontFamily: F, maxWidth: 600, margin: "0 auto", padding: 20, background: B.lg, minHeight: "100vh" }}>
        {/* Logo — clean on white */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <img src={LOGO} alt="Fred Anderson Toyota of Cape Coral" style={{ height: 50, objectFit: "contain" }} />
        </div>

        {/* Customer Header — brand red */}
        <div style={{ background: B.red, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center", color: B.w }}>
          <CheckCircle2 size={32} color="#fff" />
          <h2 style={{ margin: "8px 0 4px", fontSize: 20 }}>{l.cn || "Customer"}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            {new Date(l.ts).toLocaleDateString()} at {new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            Salesperson: {l.sp || "\u2014"} &bull; Duration: {dur}
          </p>
        </div>

        {/* Email status */}
        {emailStatus && (
          <div style={{
            padding: "10px 16px", borderRadius: 8, marginBottom: 12, textAlign: "center", fontSize: 13, fontFamily: F, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: emailStatus === "sent" ? "#DCFCE7" : emailStatus === "sending" ? "#E0F2FE" : "#FEE2E2",
            color: emailStatus === "sent" ? "#166534" : emailStatus === "sending" ? "#0C4A6E" : "#991B1B",
          }}>
            <Mail size={14} />
            {emailStatus === "sending" && "Emailing managers..."}
            {emailStatus === "sent" && "Emailed to all managers and salesperson"}
            {emailStatus === "error" && "Email failed — check Gmail credentials in Vercel"}
          </div>
        )}

        {/* Walkaround Value Builders — blue scheme */}
        {l.hot.length > 0 && (
          <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1E3A5F", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5 }}>Build Value on the Walkaround</h4>
            {l.hot.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: B.red, color: B.w, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>{walkaroundGuide[b]?.label}</span>
                <span style={{ fontSize: 12, color: "#555", fontFamily: F }}>{walkaroundGuide[b]?.short}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle of Interest */}
        {hasVehicle && (
          <SumCard title="Vehicle of Interest">
            <SumRow label="Stock #" value={l.stk} />
            <SumRow label="Vehicle" value={[l.vy, l.vm, l.vmod].filter(Boolean).join(" ")} />
          </SumCard>
        )}

        {/* Motivation */}
        {l.mot && (
          <SumCard title="Motivation">
            <p style={{ margin: 0, fontSize: 14, color: "#333", lineHeight: 1.5 }}>{l.mot}</p>
          </SumCard>
        )}

        {/* Trade-In */}
        {l.hasTrade && (l.tv || l.ty || l.tlen) && (
          <SumCard title="Trade-In">
            <SumRow label="Vehicle" value={l.tv || [l.ty, l.tm, l.tmod].filter(Boolean).join(" ")} />
            <SumRow label="Miles" value={l.tmi} />
            <SumRow label="Lender" value={l.tlen} />
            <SumRow label="Balance" value={l.tbal} />
            <SumRow label="Payment" value={l.tpay} />
            <SumRow label="Loves" value={l.tlike} />
            <SumRow label="Wishes Different" value={l.tdis} />
          </SumCard>
        )}

        {/* Recent Vehicle (no trade) */}
        {!l.hasTrade && (l.rv || l.rl || l.rd) && (
          <SumCard title="Recent Vehicle">
            <SumRow label="Driving" value={l.rv} />
            <SumRow label="Liked" value={l.rl} />
            <SumRow label="Didn't Work" value={l.rd} />
          </SumCard>
        )}

        {/* Lifestyle */}
        {l.life.length > 0 && (
          <SumCard title="Lifestyle & Needs">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {l.life.map(li => <span key={li} style={{ background: "#F0F0F0", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#555" }}>{li}</span>)}
            </div>
          </SumCard>
        )}

        {/* Decision Makers */}
        {(l.pd || l.di) && (
          <SumCard title="Decision Makers">
            <SumRow label="Primary Driver" value={l.pd} />
            <SumRow label="Influencers" value={l.di} />
          </SumCard>
        )}

        {/* Key Notes */}
        {(l.mh || l.nn) && (
          <SumCard title="Key Notes" subtitle="Copy and paste to DriveCentric">
            <SumRow label="Must-Haves" value={l.mh} />
            <SumRow label="Notes" value={l.nn} />
          </SumCard>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Btn primary onClick={() => window.print()}><Printer size={16} /> Print</Btn>
          <Btn onClick={startNew}><RotateCcw size={16} /> New</Btn>
          <Btn onClick={() => setView("stats")}><BarChart3 size={16} /> Analytics</Btn>
        </div>
      </div>
    );
  }

  /* ── ANALYTICS VIEW ── */
  if (view === "stats") {
    const avg = subs.length ? Math.round(subs.reduce((a, x) => a + x.dur, 0) / subs.length) : 0;
    const hb = {}; subs.flatMap(x => x.hot).forEach(h => { hb[h] = (hb[h] || 0) + 1 });
    const sorted = Object.entries(hb).sort((a, b) => b[1] - a[1]);

    const spMap = {};
    subs.forEach(x => {
      const name = x.sp || "Unknown";
      if (!spMap[name]) spMap[name] = { count: 0, totalDur: 0 };
      spMap[name].count++;
      spMap[name].totalDur += x.dur;
    });
    const spList = Object.entries(spMap).sort((a, b) => b[1].count - a[1].count);

    return (
      <div style={{ fontFamily: F, maxWidth: 600, margin: "0 auto", padding: 20 }}>
        <h2 style={{ color: B.blk, marginBottom: 16 }}>Manager Analytics</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{subs.length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Submitted</div>
          </div>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{Math.floor(avg / 60)}:{String(avg % 60).padStart(2, "0")}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Avg Minutes</div>
          </div>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{Object.keys(spMap).length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Salespeople</div>
          </div>
        </div>

        {spList.length > 0 && (
          <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>By Salesperson</h3>
            {spList.map(([name, data]) => {
              const avgDur = Math.round(data.totalDur / data.count);
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.blk }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{data.count} assessment{data.count !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>
                    Avg {Math.floor(avgDur / 60)}:{String(avgDur % 60).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subs.length > 0 && (
          <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>Recent Submissions</h3>
            {[...subs].reverse().slice(0, 10).map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{x.cn || "\u2014"}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{x.sp} &bull; {new Date(x.ts).toLocaleString()}</div>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>{Math.floor(x.dur / 60)}:{String(x.dur % 60).padStart(2, "0")}</div>
              </div>
            ))}
          </div>
        )}

        {sorted.length > 0 && (
          <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>Top Walkaround Focus Areas</h3>
            {sorted.slice(0, 6).map(([c, n]) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{walkaroundGuide[c]?.label || c}</div>
                <div style={{ width: 120, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(n / subs.length) * 100}%`, background: B.red, borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", minWidth: 24 }}>{n}</span>
              </div>
            ))}
          </div>
        )}

        <Btn onClick={() => setView("form")}>Back</Btn>
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div style={{ fontFamily: F, background: B.lg, minHeight: "100vh" }}>

      {/* STICKY HEADER: LOGO + TIMER + PROGRESS */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: B.w, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={LOGO} alt="Fred Anderson Toyota of Cape Coral" style={{ height: 36, objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Timer t0={t0} />
            <button onClick={resetForm} title="Reset form" style={{ background: "none", border: "1.5px solid #ddd", cursor: "pointer", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <RotateCcw size={13} color="#888" /><span style={{ color: "#888", fontSize: 11, fontFamily: F, fontWeight: 600 }}>Reset</span>
            </button>
            {subs.length > 0 && (
              <button onClick={() => setView("stats")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <BarChart3 size={16} color="#aaa" /><span style={{ color: "#aaa", fontSize: 12, fontFamily: F }}>{subs.length}</span>
              </button>
            )}
          </div>
        </div>
        <div style={{ padding: "0 16px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: B.dg }}>Discovery Progress</span>
            <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: B.red, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      {/* COACHING BANNER */}
      <div style={{ background: B.red, padding: "6px 16px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 11, color: B.w, margin: 0, fontStyle: "italic", letterSpacing: 0.3 }}>
          Customers don't buy vehicles. They buy solutions to problems.
        </p>
      </div>

      {/* RESUMED BANNER */}
      {resumed && (
        <div style={{ background: "#E0F2FE", padding: "8px 16px", textAlign: "center", borderBottom: "1px solid #38BDF8" }}>
          <p style={{ fontFamily: F, fontSize: 12, color: "#0C4A6E", margin: 0, fontWeight: 600 }}>
            Resumed from where you left off
          </p>
        </div>
      )}

      {/* FORM */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* 1. CUSTOMER INFO */}
        <FadeIn>
          <Sec title="Customer Information" icon={User}>
            <Fl label="Salesperson">
              <select style={{ ...sIn, background: B.w }} value={d.sp} onChange={e => s("sp")(e.target.value)}
                onFocus={e => { e.target.style.borderColor = B.red }} onBlur={e => { e.target.style.borderColor = "#ddd" }}>
                <option value="">Select your name</option>
                {SALESPEOPLE.map(p => <option key={p.email} value={p.name}>{p.name}</option>)}
              </select>
            </Fl>
            <Fl label="Customer First Name"><In value={d.cn} onChange={s("cn")} placeholder="First name" /></Fl>
          </Sec>
        </FadeIn>

        {/* 2. VEHICLE OF INTEREST */}
        <FadeIn>
          <Sec title="Vehicle of Interest" icon={Car} accent>
            <p style={{ fontFamily: F, fontSize: 12, color: "#666", margin: "0 0 12px" }}>If they came in on a specific stock number or vehicle, enter it here.</p>
            <Fl label="Stock #"><In value={d.stk} onChange={s("stk")} placeholder="e.g. T24-1234" style={{ fontSize: 18, fontWeight: 700, padding: "12px 16px" }} /></Fl>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Fl label="Year"><In value={d.vy} onChange={s("vy")} placeholder="2025" /></Fl>
              <Fl label="Make"><In value={d.vm} onChange={s("vm")} placeholder="Toyota" /></Fl>
              <Fl label="Model"><In value={d.vmod} onChange={s("vmod")} placeholder="Camry" /></Fl>
            </div>
          </Sec>
        </FadeIn>

        {/* 3. MOTIVATION */}
        <FadeIn>
          <Sec title="Motivation" icon={Heart}>
            <Fl label={hasVOI ? "What drew them to this specific vehicle?" : "What has you looking for a vehicle today?"} hint="Customers don't buy vehicles. They buy solutions to problems.">
              <TA value={d.mot} onChange={s("mot")} placeholder={hasVOI ? "What caught their eye? Online? Drive by? Referred?" : "What's changed? New job, growing family, reliability issues?"} rows={3} />
            </Fl>
          </Sec>
        </FadeIn>

        {/* 4. TRADE TOGGLE + TRADE OR RECENT VEHICLE */}
        <FadeIn>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { startTimer(); setHasTrade(!hasTrade); }}>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: hasTrade ? B.red : "#ccc", position: "relative", flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: B.w, position: "absolute", top: 2, left: hasTrade ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: B.blk }}>Customer has a trade-in</span>
          </div>

          {hasTrade ? (
            <Sec title="Trade Discovery" icon={Car}>
              <Fl label="Trade vehicle"><In value={d.tv} onChange={s("tv")} placeholder="Year, Make, Model, Mileage" voice /></Fl>
              <Fl label="What do you LOVE about your current vehicle?"><TA value={d.tlike} onChange={s("tlike")} placeholder="Features, comfort, reliability..." /></Fl>
              <Fl label="What do you WISH was different?"><TA value={d.tdis} onChange={s("tdis")} placeholder="Space, tech, fuel economy..." /></Fl>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Fl label="Lender"><In value={d.tlen} onChange={s("tlen")} /></Fl>
                <Fl label="Balance"><In value={d.tbal} onChange={s("tbal")} placeholder="$" /></Fl>
                <Fl label="Payments"><In value={d.tpay} onChange={s("tpay")} placeholder="$/mo" /></Fl>
              </div>
            </Sec>
          ) : (
            <Sec title="Recent Vehicle Experience" icon={Car}>
              <p style={{ fontFamily: F, fontSize: 12, color: "#666", margin: "0 0 10px" }}>No trade — let's learn about what they've been driving.</p>
              <Fl label="What have you been driving most recently?"><In value={d.rv} onChange={s("rv")} placeholder="Year, Make, Model" voice /></Fl>
              <Fl label="What did you like about it?"><TA value={d.rl} onChange={s("rl")} placeholder="Features, ride, reliability..." /></Fl>
              <Fl label="What didn't work for you?"><TA value={d.rd} onChange={s("rd")} placeholder="Pain points, frustrations..." /></Fl>
            </Sec>
          )}
        </FadeIn>

        {/* 5. LIFESTYLE */}
        <FadeIn>
          <Sec title="Lifestyle & Needs" icon={Heart}>
            <Fl label="How will you use this vehicle?" hint="Tap all that apply — helps identify what to highlight on the walkaround.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {LIFE_ITEMS.map(o => (
                  <LifeCard key={o.label} label={o.label} icon={o.icon} sel={d.life.includes(o.label)} onClick={() => togLife(o.label)} />
                ))}
              </div>
            </Fl>
          </Sec>
        </FadeIn>

        {/* 6. NEXT VEHICLE / WHAT ELSE MATTERS */}
        <FadeIn>
          <Sec title={hasVOI ? "What Else Matters" : "Next Vehicle Priorities"} icon={Star}>
            {hasVOI && (
              <div style={{ background: "#E0F2FE", border: "1px solid #38BDF8", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                <p style={{ fontFamily: F, fontSize: 12, color: "#0C4A6E", margin: 0 }}>They have a vehicle in mind — confirm fit and uncover any deal-breakers.</p>
              </div>
            )}
            <Fl label={hasVOI ? "Beyond this vehicle, what are your absolute must-haves?" : "What are the must-haves for your next vehicle?"}>
              <TA value={d.mh} onChange={s("mh")} placeholder={hasVOI ? "Anything this vehicle MUST have to be the one?" : "Features, size, type, brand preferences..."} />
            </Fl>
            <Fl label={hasVOI ? "Any concerns about this vehicle?" : "Any other notes?"}>
              <TA value={d.nn} onChange={s("nn")} placeholder={hasVOI ? "Hesitations, questions, things to address..." : "Color preferences, new vs used, specific models..."} />
            </Fl>
          </Sec>
        </FadeIn>

        {/* 7. DECISION MAKERS */}
        <FadeIn>
          <Sec title="Decision Makers" icon={Users}>
            <Fl label="Who is the primary driver?"><In value={d.pd} onChange={s("pd")} placeholder="Name / relationship" /></Fl>
            <Fl label="Who else is involved in this decision?"><TA value={d.di} onChange={s("di")} placeholder="Spouse, parent, friend, mechanic..." voice={false} /></Fl>
          </Sec>
        </FadeIn>

        {/* WALKAROUND VALUE BUILDERS — blue scheme, pill + phrase + ⓘ */}
        {hot.length > 0 && (
          <FadeIn>
            <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1E3A5F", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5 }}>Build Value on the Walkaround</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {hot.map(b => <HotPill key={b} cat={b} guide={walkaroundGuide[b]} expanded={!!expandedHot[b]} onToggle={toggleHotInfo} />)}
              </div>
            </div>
          </FadeIn>
        )}

        {/* SUBMIT */}
        <FadeIn>
          <div ref={bottomRef} style={{ display: "flex", justifyContent: "center" }}>
            <Btn primary onClick={submit} style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}><Send size={18} /> Submit Assessment</Btn>
          </div>
        </FadeIn>
      </div>

    </div>
  );
}
