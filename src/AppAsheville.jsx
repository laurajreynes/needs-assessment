import { useState, useEffect, useRef } from "react";
import { Clock, Printer, Send, RotateCcw, CheckCircle2, Star, User, Car, Users, Heart, MapPin, Map, Truck, Compass, Shield, Gauge, Sparkles, Smartphone, Fuel, Sofa, Mic, MicOff, Info, TrendingDown, Mail, PackageCheck, Search, AlertTriangle, Palette, Wrench } from "lucide-react";

const LOGO = "/logo-asheville.png";
const SAVE_KEY = "fata-needs-assessment";

const B = { red: "#C8102E", dk: "#A50D24", blk: "#1A1A1A", dg: "#2D2D2D", lg: "#F5F5F5", w: "#FFF", amber: "#B45309", grn: "#15803D" };
const F = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/* ── SAMPLE: send only to Laura until the Asheville roster is wired in ── */
const RECIPIENTS = ["lreynes@anderson-auto.net"];

const MODELS = [
  "Camry", "Corolla", "Corolla Cross", "RAV4", "RAV4 Hybrid", "RAV4 Prime",
  "Highlander", "Grand Highlander", "4Runner", "Tacoma", "Tundra", "Sequoia",
  "Sienna", "Prius", "Crown", "bZ4X", "Venza", "Land Cruiser", "GR86", "Supra",
];

const COLORS = [
  { name: "Super White", hex: "#FFFFFF" },
  { name: "Wind Chill Pearl", hex: "#F2F3F4" },
  { name: "Ice Cap", hex: "#E6EBED" },
  { name: "Celestial Silver", hex: "#B7BBBD" },
  { name: "Lunar Rock", hex: "#C3C7C2" },
  { name: "Magnetic Gray", hex: "#5A5E60" },
  { name: "Heavy Metal", hex: "#6D7175" },
  { name: "Midnight Black", hex: "#12131A" },
  { name: "Supersonic Red", hex: "#C8102E" },
  { name: "Ruby Flare Pearl", hex: "#8E1B24" },
  { name: "Barcelona Red", hex: "#A32035" },
  { name: "Blueprint", hex: "#4A5D6E" },
  { name: "Cavalry Blue", hex: "#5C6E7D" },
  { name: "Blue Crush", hex: "#2B5C8A" },
  { name: "Army Green", hex: "#5A5B45" },
  { name: "Underground", hex: "#5E5B52" },
  { name: "Bronze Oxide", hex: "#7A5C42" },
  { name: "Solar Octane", hex: "#D9541E" },
];

const EQUIPMENT = [
  "AWD / 4WD", "Sunroof / Moonroof", "Panoramic Roof", "Leather Seats",
  "Heated Seats", "Ventilated Seats", "3rd Row", "Tow Package", "JBL Audio",
  "Blind Spot Monitor", "Power Liftgate", "Remote Start", "Wireless Charging",
  "Navigation", "Roof Rails", "Running Boards", "Bed Liner", "TRD Package",
  "Premium Package", "Technology Package",
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

const walkaroundGuide = {
  safety:      { label: "Safety Systems",       short: "Sensors, cameras, crash ratings",   tip: "Point out every sensor and camera on the walkaround. Show the safety rating on the window sticker." },
  fuel:        { label: "Fuel Efficiency",      short: "MPG, eco mode, cost savings",       tip: "Highlight the MPG on the sticker. Demo eco mode if available. Talk cost per mile." },
  space:       { label: "Cargo & Versatility",  short: "Trunk, fold seats, cargo room",     tip: "Pop the trunk, fold the seats, let them see and feel the space." },
  tech:        { label: "Tech & Connectivity",  short: "Touchscreen, CarPlay, audio",       tip: "Fire up the screen. Pair their phone with CarPlay or Android Auto." },
  comfort:     { label: "Ride & Comfort",       short: "Heated seats, cabin, ride quality", tip: "Seat them inside. Show heated/cooled seats, lumbar, cabin quiet." },
  towing:      { label: "Towing Capability",    short: "Tow rating, hitch, tow mode",       tip: "Point to the tow rating on the sticker. Show hitch and tow/haul mode." },
  performance: { label: "Performance & Power",  short: "Engine, sport mode, test drive",    tip: "Review engine specs on the sticker. Demo sport mode. Let the drive speak." },
  style:       { label: "Design & Style",       short: "Exterior, wheels, lights, paint",   tip: "Step back and let them take it in. Point out LEDs, wheels, paint." },
  offroad:     { label: "Off-Road Capability",  short: "Clearance, AWD/4WD, skid plates",   tip: "Show ground clearance, AWD/4WD controls, off-road features." },
  family:      { label: "Family Friendly",      short: "Car seat anchors, space, cameras",  tip: "Show LATCH anchors, rear legroom, backup cam. Let them picture the family." },
};

const hotBtnRules = {
  safety:      { words: ["airbag", "crash", "blind spot", "collision", "safety"],                           tiles: ["Safety First"] },
  fuel:        { words: ["gas", "fuel", "mpg", "mileage", "hybrid", "electric", "ev"],                      tiles: ["Daily Commute", "Fuel Economy", "Downsizing"] },
  space:       { words: ["room", "space", "cargo", "trunk", "storage", "legroom", "third row"],             tiles: ["Comfort / Space"] },
  tech:        { words: ["tech", "screen", "carplay", "android", "bluetooth", "navigation", "wireless"],    tiles: ["Tech & Features"] },
  comfort:     { words: ["comfort", "ride", "smooth", "quiet", "leather", "heated", "cooled"],              tiles: ["Road Trips", "Comfort / Space"] },
  towing:      { words: ["tow", "haul", "trailer", "boat", "hitch", "towing"],                              tiles: ["Towing / Hauling"] },
  performance: { words: ["power", "engine", "fast", "turbo", "v6", "v8", "acceleration", "horsepower"],     tiles: ["Performance"] },
  style:       { words: ["look", "color", "style", "sporty", "sharp", "design", "appearance"],              tiles: ["Style / Looks"] },
  offroad:     { words: ["off-road", "off road", "4x4", "4wd", "awd", "trail", "mud", "terrain"],           tiles: ["Off-Road"] },
  family:      { words: ["family", "kid", "children", "car seat", "stroller", "growing", "baby"],           tiles: ["Family"] },
};

const getHot = (d) => {
  const texts = Object.entries(d)
    .filter(([k]) => !["life", "o1colors", "o1alt", "o1equip", "o2colors", "o3colors"].includes(k))
    .map(([, v]) => typeof v === "string" ? v : "").join(" ");
  const equipText = [...(d.o1equip || [])].join(" ");
  const t = (texts + " " + equipText).toLowerCase();
  const lifeSelections = d.life || [];
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
  sp: "", cn: "",
  stk: "", avail: "",
  vy: "", vmod: "", vtrim: "", vcolor: "", seen: "",
  shown: "", whyNot: "", triedStock: false, explainedWait: false,
  o1model: "", o1trim: "", o1colors: [], o1alt: [], o1equip: [], o1no: "",
  o2model: "", o2trim: "", o2colors: [], o2note: "",
  o3model: "", o3trim: "", o3colors: [], o3note: "",
  flexColor: "", priority: "", timeline: "", commit: "", locnotes: "",
  mot: "",
  tv: "", tlike: "", tdis: "", tlen: "", tbal: "", tpay: "",
  rv: "", rl: "", rd: "",
  life: [], pd: "", di: "", mh: "", nn: "",
};

const sIn = { fontFamily: F, fontSize: 14, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box", outline: "none" };

/* ── EMAIL HTML ── */
const buildEmailHTML = (sub) => {
  const hotLabels = (sub.hot || []).map(h => walkaroundGuide[h]?.label || h);
  const r = (label, value) => value ? `<tr><td style="padding:6px 8px;font-weight:600;color:#888;width:140px;vertical-align:top">${label}</td><td style="padding:6px 8px;color:#333">${value}</td></tr>` : "";
  const section = (title, rows) => {
    const filtered = rows.filter(Boolean).join("");
    return filtered ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">${title}</h3><table style="width:100%;border-collapse:collapse">${filtered}</table>` : "";
  };
  const list = a => (a && a.length ? a.join(", ") : "");
  const FLEX = { yes: "Yes — color is flexible", no: "No — color is firm", depends: "Depends on equipment" };
  const COMMIT = { yes: "Ready to commit if located", think: "Needs to think it over", no: "Not ready" };
  const PRIO = { color: "Color matters more", equipment: "Equipment matters more" };

  const locateBlock = sub.avail === "locate" ? `
    <div style="background:#FFF7ED;border:2px solid #F59E0B;border-radius:8px;padding:14px;margin:16px 0">
      <h3 style="color:#B45309;margin:0 0 4px;font-size:15px">DEALER TRADE / LOCATE REQUEST</h3>
      <p style="margin:0 0 10px;font-size:12px;color:#92400E">Customer wants a unit we do not have on the ground. Locate profile below.</p>
      <div style="background:#FFF;border:1px solid #FCD34D;border-radius:6px;padding:10px;margin-bottom:10px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#B45309;text-transform:uppercase;letter-spacing:0.5px">Worked the lot first?</p>
        <table style="width:100%;border-collapse:collapse">
          ${r("Units shown", sub.shown)}
          ${r("Why they failed", sub.whyNot)}
          ${r("Worked the lot", sub.triedStock ? "Yes — confirmed" : "NOT CONFIRMED")}
          ${r("Set expectations", sub.explainedWait ? "Yes — told them it may take time" : "No")}
        </table>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${r("Option 1", [sub.o1model, sub.o1trim].filter(Boolean).join(" "))}
        ${r("Preferred color", list(sub.o1colors))}
        ${r("Will also take", list(sub.o1alt))}
        ${r("Must have", list(sub.o1equip))}
        ${r("Will NOT accept", sub.o1no)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${r("Option 2", [sub.o2model, sub.o2trim].filter(Boolean).join(" "))}
        ${r("Colors OK", list(sub.o2colors))}
        ${r("Why it works", sub.o2note)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${r("Option 3", [sub.o3model, sub.o3trim].filter(Boolean).join(" "))}
        ${r("Colors OK", list(sub.o3colors))}
        ${r("Why it works", sub.o3note)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${r("Color flexible?", FLEX[sub.flexColor] || "")}
        ${r("Bigger priority", PRIO[sub.priority] || "")}
        ${r("Timeline", sub.timeline)}
        ${r("Commitment", COMMIT[sub.commit] || "")}
        ${r("Locate notes", sub.locnotes)}
      </table>
    </div>` : "";

  const stockBlock = sub.avail === "instock" ? section("In-Stock Unit", [
    r("Stock #", sub.stk),
    r("Vehicle", [sub.vy, sub.vmod, sub.vtrim].filter(Boolean).join(" ")),
    r("Color", sub.vcolor),
    r("Seen in person", sub.seen),
  ]) : "";

  const shoppingBlock = sub.avail === "shopping"
    ? `<div style="background:#EFF6FF;border:1px solid #93C5FD;border-radius:8px;padding:12px;margin:16px 0"><p style="margin:0;font-size:13px;color:#1E3A5F"><strong>Still shopping</strong> — no specific unit selected yet.</p></div>`
    : "";

  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
    <div style="background:#C8102E;color:white;padding:16px 20px;border-radius:8px 8px 0 0;text-align:center">
      <h2 style="margin:0;font-size:18px">Needs Assessment</h2>
      <p style="margin:6px 0 0;opacity:0.85;font-size:13px">Fred Anderson Toyota of Asheville</p>
    </div>
    <div style="padding:16px 20px;background:#f5f5f5;border-radius:0 0 8px 8px">
      <table style="width:100%;border-collapse:collapse">
        ${r("Customer", sub.cn)}
        ${r("Salesperson", sub.sp)}
        ${r("Stock #", sub.stk)}
        ${r("Date", new Date(sub.ts).toLocaleString())}
      </table>
      ${locateBlock}
      ${stockBlock}
      ${shoppingBlock}
      ${sub.mot ? section("Motivation", [r("", sub.mot)]) : ""}
      ${sub.hasTrade && sub.tv ? section("Trade-In", [r("Vehicle", sub.tv), r("Loves", sub.tlike), r("Wishes Different", sub.tdis), r("Lender", sub.tlen), r("Balance", sub.tbal), r("Payment", sub.tpay)]) : ""}
      ${!sub.hasTrade && sub.rv ? section("Recent Vehicle", [r("Driving", sub.rv), r("Liked", sub.rl), r("Didn't Work", sub.rd)]) : ""}
      ${sub.life?.length ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Lifestyle</h3><p style="margin:0;font-size:14px">${sub.life.join(", ")}</p>` : ""}
      ${hotLabels.length ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Walkaround Focus</h3><p style="margin:0;font-size:14px">${hotLabels.join(", ")}</p>` : ""}
      ${(sub.mh || sub.nn) ? section("Key Notes", [r("Must-Haves", sub.mh), r("Notes", sub.nn)]) : ""}
      ${(sub.pd || sub.di) ? section("Decision Makers", [r("Primary Driver", sub.pd), r("Influencers", sub.di)]) : ""}
    </div></div>`;
};

/* ── VOICE ── */
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
    rec.onresult = e => { onResult(e.results[0][0].transcript); setOn(false); };
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
    }}>
      {on ? <MicOff size={14} color={B.w} /> : <Mic size={14} color="#888" />}
    </button>
  );
};

const In = ({ value, onChange, placeholder, style: s, voice, list }) => (
  <div style={{ position: "relative" }}>
    <input list={list} style={{ ...sIn, ...s, ...(voice ? { paddingRight: 42 } : {}) }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {children}
    </div>
  );
};

const Sec = ({ title, icon: Ic, children, accent, tone }) => (
  <div style={{ marginBottom: 20, background: B.w, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    {accent && <div style={{ height: 4, background: tone || B.red }} />}
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: tone || B.red, borderRadius: 8, padding: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={16} color={B.w} /></div>
        <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: B.blk, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const Fl = ({ label, hint, children, req }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: B.dg, display: "block", marginBottom: 3 }}>
      {label}{req && <span style={{ color: B.red, marginLeft: 4 }}>*</span>}
    </label>
    {hint && <p style={{ fontFamily: F, fontSize: 11, color: "#888", margin: "0 0 3px", fontStyle: "italic" }}>{hint}</p>}
    {children}
  </div>
);

const Chip = ({ label, sel, onClick, hex }) => (
  <button onClick={onClick} type="button" style={{
    fontFamily: F, fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 20,
    border: sel ? `2px solid ${B.red}` : "1.5px solid #e0e0e0",
    background: sel ? "#FFF0F0" : B.w, color: sel ? B.red : "#666",
    cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
  }}>
    {hex && <span style={{ width: 13, height: 13, borderRadius: "50%", background: hex, border: "1px solid rgba(0,0,0,0.2)", flexShrink: 0 }} />}
    {label}
  </button>
);

const ChipRow = ({ options, selected, onToggle, colors }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {options.map(o => {
      const label = colors ? o.name : o;
      return <Chip key={label} label={label} hex={colors ? o.hex : null} sel={selected.includes(label)} onClick={() => onToggle(label)} />;
    })}
  </div>
);

/* ── SEGMENTED CHOICE (single-select, big touch targets) ── */
const Choice = ({ options, value, onChange }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
    {options.map(o => {
      const sel = value === o.key;
      return (
        <button key={o.key} type="button" onClick={() => onChange(o.key)} style={{
          fontFamily: F, fontSize: 13, fontWeight: 700, padding: "10px 8px", borderRadius: 10,
          border: sel ? `2px solid ${B.red}` : "1.5px solid #e0e0e0",
          background: sel ? "#FFF0F0" : B.w, color: sel ? B.red : "#666",
          cursor: "pointer", transition: "all 0.15s", lineHeight: 1.3,
        }}>{o.label}</button>
      );
    })}
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

const Btn = ({ children, onClick, primary, disabled, style: s }) => (
  <button onClick={onClick} disabled={disabled} style={{
    fontFamily: F, fontSize: 14, fontWeight: 700, padding: "10px 20px", borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer", border: primary ? "none" : `2px solid ${B.red}`,
    background: disabled ? "#ccc" : primary ? B.red : B.w, color: disabled ? "#777" : primary ? B.w : B.red,
    display: "flex", alignItems: "center", gap: 8, ...s,
  }}>{children}</button>
);

const Timer = ({ t0 }) => {
  const [n, sN] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => sN(Date.now()), 1000); return () => clearInterval(i) }, []);
  if (!t0) return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color="#888" />
      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "#888" }}>0:00</span>
    </div>
  );
  const d = Math.floor((n - t0) / 1000), m = Math.floor(d / 60), s = d % 60;
  const c = m < 5 ? "#22c55e" : m < 10 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color={c} />
      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: c }}>{m}:{String(s).padStart(2, "0")}</span>
    </div>
  );
};

const SumCard = ({ title, subtitle, children, tone }) => (
  <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 }}>
    <h4 style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: tone || B.red, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>{title}</h4>
    {subtitle && <p style={{ margin: "0 0 8px", fontSize: 11, color: "#888", fontFamily: F, fontStyle: "italic" }}>{subtitle}</p>}
    {!subtitle && <div style={{ marginBottom: 8 }} />}
    {children}
  </div>
);

const SumRow = ({ label, value }) => {
  if (!value || (Array.isArray(value) && !value.length)) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 14, fontFamily: F }}>
      <span style={{ color: "#888", minWidth: 120, fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#333", flex: 1 }}>{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
};

const HotPill = ({ cat, guide, expanded, onToggle }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: B.red, color: B.w, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>{guide.label}</span>
      <span style={{ fontSize: 12, color: "#555", fontFamily: F, flex: 1 }}>{guide.short}</span>
      <button onClick={() => onToggle(cat)} type="button" style={{
        background: expanded ? "#DBEAFE" : "none", border: "1.5px solid #93C5FD", cursor: "pointer",
        borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0,
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

/* Logo with text fallback — falls back cleanly if the image isn't uploaded yet */
const Wordmark = ({ size = "md" }) => {
  const [imgOk, setImgOk] = useState(true);
  const big = size === "lg";
  if (imgOk) {
    return (
      <img
        src={LOGO}
        alt="Fred Anderson Toyota of Asheville"
        onError={() => setImgOk(false)}
        style={{ height: big ? 76 : 46, objectFit: "contain", display: "block" }}
      />
    );
  }
  return (
    <div style={{ fontFamily: F, lineHeight: 1 }}>
      <div style={{ fontSize: big ? 20 : 15, fontWeight: 800, color: B.blk, letterSpacing: 0.5 }}>FRED ANDERSON TOYOTA</div>
      <div style={{ fontSize: big ? 13 : 10, fontWeight: 700, color: B.red, letterSpacing: 2.5, marginTop: 3 }}>OF ASHEVILLE</div>
    </div>
  );
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function AshevilleAssessment() {
  const saved = useRef(loadSaved());

  const [view, setView] = useState("form");
  const [t0, setT0] = useState(() => saved.current?.t0 || null);
  const [hasTrade, setHasTrade] = useState(() => saved.current?.hasTrade ?? true);
  const [subs, setSubs] = useState([]);
  const [d, setD] = useState(() => saved.current?.data ? { ...defaultData, ...saved.current.data } : { ...defaultData });
  const [expandedHot, setExpandedHot] = useState({});
  const [emailStatus, setEmailStatus] = useState(null);
  const [showGate, setShowGate] = useState(false);

  const startTimer = () => { if (!t0) setT0(Date.now()); };
  const s = k => v => { startTimer(); setD(p => ({ ...p, [k]: v })); };
  const togArr = (k, i) => { startTimer(); setD(p => ({ ...p, [k]: p[k].includes(i) ? p[k].filter(x => x !== i) : [...p[k], i] })); };
  const toggleHotInfo = key => setExpandedHot(p => ({ ...p, [key]: !p[key] }));
  const hot = getHot(d);

  const isLocate = d.avail === "locate";
  const isStock = d.avail === "instock";

  /* ── LOCATE GATE — this is what forces the salesperson to open the customer up ── */
  const gaps = [];
  if (isLocate) {
    if (!d.triedStock) gaps.push("Confirm you worked the lot first");
    if (!d.shown.trim()) gaps.push("Which in-stock units you showed");
    if (!d.whyNot.trim()) gaps.push("Why those didn't work");
    if (!d.o1model.trim()) gaps.push("Option 1 — model");
    if (!d.o1colors.length) gaps.push("Option 1 — preferred color");
    if (!d.o1equip.length) gaps.push("Option 1 — must-have equipment");
    if (!d.o2model.trim()) gaps.push("Option 2 — backup vehicle");
    if (!d.o3model.trim()) gaps.push("Option 3 — backup vehicle");
    if (!d.flexColor) gaps.push("Is color flexible?");
    if (!d.priority) gaps.push("Color vs. equipment priority");
    if (!d.commit) gaps.push("Commitment level");
  }
  const locateReady = gaps.length === 0;
  const canSubmit = !isLocate || locateReady;

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ data: d, hasTrade, t0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [d, hasTrade, t0]);

  const fields = [
    [d.sp, d.cn], [d.stk], [d.avail], [d.mot],
    hasTrade ? [d.tv] : [d.rv, d.rl],
    [d.life.length ? "y" : ""], [d.mh],
    isLocate ? [locateReady ? "y" : ""] : ["y"],
  ];
  const pct = Math.round(fields.filter(g => g.some(v => v && v.toString().trim())).length / fields.length * 100);

  const sendEmail = async (submission) => {
    const html = buildEmailHTML(submission);
    const tag = submission.avail === "locate" ? "LOCATE REQUEST" : "Needs Assessment";
    const subject = `${tag}: ${submission.cn || "Customer"} — ${submission.sp || "Salesperson"}${submission.stk ? ` (#${submission.stk})` : ""}`;
    try {
      setEmailStatus("sending");
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: RECIPIENTS, subject, html }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch {
      setEmailStatus("error");
    }
  };

  const submit = async () => {
    if (!canSubmit) {
      setShowGate(true);
      document.getElementById("locate-gate")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const rawDur = t0 ? Math.floor((Date.now() - t0) / 1000) : 0;
    const submission = { ...d, hasTrade, hot, ts: new Date().toISOString(), dur: Math.min(rawDur, 1800), store: "asheville" };
    localStorage.removeItem(SAVE_KEY);
    const dbSave = fetch("/api/submit-asheville", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }).catch(err => console.error("Submit error:", err));
    const emailSend = sendEmail(submission);
    setSubs(p => [...p, submission]);
    setView("done");
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
    setShowGate(false);
    window.scrollTo({ top: 0 });
  };

  const resetForm = () => {
    if (!confirm("Clear this assessment and start fresh?")) return;
    localStorage.removeItem(SAVE_KEY);
    setT0(null);
    setD({ ...defaultData, sp: d.sp });
    setHasTrade(true);
    setShowGate(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── SUMMARY VIEW ── */
  if (view === "done") {
    const l = subs[subs.length - 1];
    const dur = `${Math.floor(l.dur / 60)}m ${l.dur % 60}s`;
    const FLEX = { yes: "Yes — color is flexible", no: "No — color is firm", depends: "Depends on equipment" };
    const COMMIT = { yes: "Ready to commit if located", think: "Needs to think it over", no: "Not ready" };
    const PRIO = { color: "Color matters more", equipment: "Equipment matters more" };

    return (
      <div style={{ fontFamily: F, maxWidth: 640, margin: "0 auto", padding: 20, background: B.lg, minHeight: "100vh" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}><Wordmark size="lg" /></div>

        <div style={{ background: B.red, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center", color: B.w }}>
          <CheckCircle2 size={32} color="#fff" />
          <h2 style={{ margin: "8px 0 4px", fontSize: 20 }}>{l.cn || "Customer"}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
            {l.stk ? `Stock #${l.stk} • ` : ""}{new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {l.sp || "—"} &bull; {dur}
          </p>
        </div>

        {emailStatus && (
          <div style={{
            padding: "10px 16px", borderRadius: 8, marginBottom: 12, textAlign: "center", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: emailStatus === "sent" ? "#DCFCE7" : emailStatus === "sending" ? "#E0F2FE" : "#FEE2E2",
            color: emailStatus === "sent" ? "#166534" : emailStatus === "sending" ? "#0C4A6E" : "#991B1B",
          }}>
            <Mail size={14} />
            {emailStatus === "sending" && "Sending..."}
            {emailStatus === "sent" && "Sent to management"}
            {emailStatus === "error" && "Email failed"}
          </div>
        )}

        {/* LOCATE REQUEST — front and center */}
        {l.avail === "locate" && (
          <div style={{ background: "#FFF7ED", border: `2px solid #F59E0B`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Search size={16} color={B.amber} />
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: B.amber, textTransform: "uppercase", letterSpacing: 0.5 }}>Dealer Trade / Locate Request</h4>
            </div>
            <SumRow label="Units shown" value={l.shown} />
            <SumRow label="Why they failed" value={l.whyNot} />
            <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
            <SumRow label="Option 1" value={[l.o1model, l.o1trim].filter(Boolean).join(" ")} />
            <SumRow label="Preferred color" value={l.o1colors} />
            <SumRow label="Will also take" value={l.o1alt} />
            <SumRow label="Must have" value={l.o1equip} />
            <SumRow label="Will NOT accept" value={l.o1no} />
            <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
            <SumRow label="Option 2" value={[l.o2model, l.o2trim].filter(Boolean).join(" ")} />
            <SumRow label="Colors OK" value={l.o2colors} />
            <SumRow label="Why it works" value={l.o2note} />
            <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
            <SumRow label="Option 3" value={[l.o3model, l.o3trim].filter(Boolean).join(" ")} />
            <SumRow label="Colors OK" value={l.o3colors} />
            <SumRow label="Why it works" value={l.o3note} />
            <div style={{ height: 1, background: "#FCD34D", margin: "10px 0" }} />
            <SumRow label="Color flexible?" value={FLEX[l.flexColor]} />
            <SumRow label="Bigger priority" value={PRIO[l.priority]} />
            <SumRow label="Timeline" value={l.timeline} />
            <SumRow label="Commitment" value={COMMIT[l.commit]} />
            <SumRow label="Locate notes" value={l.locnotes} />
          </div>
        )}

        {l.avail === "instock" && (
          <SumCard title="In-Stock Unit" tone={B.grn}>
            <SumRow label="Stock #" value={l.stk} />
            <SumRow label="Vehicle" value={[l.vy, l.vmod, l.vtrim].filter(Boolean).join(" ")} />
            <SumRow label="Color" value={l.vcolor} />
            <SumRow label="Seen in person" value={l.seen} />
          </SumCard>
        )}

        {l.hot.length > 0 && (
          <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1E3A5F", textTransform: "uppercase", letterSpacing: 0.5 }}>Build Value on the Walkaround</h4>
            {l.hot.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: B.red, color: B.w, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{walkaroundGuide[b]?.label}</span>
                <span style={{ fontSize: 12, color: "#555" }}>{walkaroundGuide[b]?.short}</span>
              </div>
            ))}
          </div>
        )}

        {l.mot && <SumCard title="Motivation"><p style={{ margin: 0, fontSize: 14, color: "#333", lineHeight: 1.5 }}>{l.mot}</p></SumCard>}

        {l.hasTrade && l.tv && (
          <SumCard title="Trade-In">
            <SumRow label="Vehicle" value={l.tv} />
            <SumRow label="Loves" value={l.tlike} />
            <SumRow label="Wishes Different" value={l.tdis} />
            <SumRow label="Lender" value={l.tlen} />
            <SumRow label="Balance" value={l.tbal} />
            <SumRow label="Payment" value={l.tpay} />
          </SumCard>
        )}

        {!l.hasTrade && l.rv && (
          <SumCard title="Recent Vehicle">
            <SumRow label="Driving" value={l.rv} />
            <SumRow label="Liked" value={l.rl} />
            <SumRow label="Didn't Work" value={l.rd} />
          </SumCard>
        )}

        {l.life.length > 0 && (
          <SumCard title="Lifestyle & Needs">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {l.life.map(li => <span key={li} style={{ background: "#F0F0F0", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#555" }}>{li}</span>)}
            </div>
          </SumCard>
        )}

        {(l.mh || l.nn) && (
          <SumCard title="Key Notes" subtitle="Copy into the CRM">
            <SumRow label="Must-Haves" value={l.mh} />
            <SumRow label="Notes" value={l.nn} />
          </SumCard>
        )}

        {(l.pd || l.di) && (
          <SumCard title="Decision Makers">
            <SumRow label="Primary Driver" value={l.pd} />
            <SumRow label="Influencers" value={l.di} />
          </SumCard>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Btn primary onClick={() => window.print()}><Printer size={16} /> Print</Btn>
          <Btn onClick={startNew}><RotateCcw size={16} /> New</Btn>
        </div>
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div style={{ fontFamily: F, background: B.lg, minHeight: "100vh" }}>

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: B.w, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Timer t0={t0} />
            <button onClick={resetForm} title="Reset" style={{ background: "none", border: "1.5px solid #ddd", cursor: "pointer", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <RotateCcw size={13} color="#888" /><span style={{ color: "#888", fontSize: 11, fontFamily: F, fontWeight: 600 }}>Reset</span>
            </button>
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

      <div style={{ background: B.red, padding: "6px 16px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 11, color: B.w, margin: 0, fontStyle: "italic", letterSpacing: 0.3 }}>
          Sell what's on the ground first. A dealer trade is the last resort, not the opening move.
        </p>
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* 1. CUSTOMER */}
        <FadeIn>
          <Sec title="Customer Information" icon={User}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Fl label="Salesperson"><In value={d.sp} onChange={s("sp")} placeholder="Your name" /></Fl>
              <Fl label="Customer First Name"><In value={d.cn} onChange={s("cn")} placeholder="First name" /></Fl>
            </div>
          </Sec>
        </FadeIn>

        {/* 2. STOCK # + AVAILABILITY — the core of this version */}
        <FadeIn>
          <Sec title="Vehicle of Interest" icon={Car} accent>
            <Fl label="Stock #" hint="Start here. Every deal begins with a unit.">
              <In value={d.stk} onChange={s("stk")} placeholder="e.g. T26-1234" style={{ fontSize: 22, fontWeight: 800, padding: "14px 16px", letterSpacing: 1 }} />
            </Fl>

            <Fl label="Do we have it?" hint="Be honest here — this drives everything that follows.">
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {[
                  { key: "instock", label: "In Stock", sub: "Best outcome. It's on the ground — go sell it.", icon: PackageCheck, tone: B.grn, bg: "#F0FDF4", br: "#BBF7D0" },
                  { key: "shopping", label: "Still Shopping", sub: "No unit picked yet. Land them on one from the lot.", icon: Compass, tone: "#2563EB", bg: "#EFF6FF", br: "#BFDBFE" },
                  { key: "locate", label: "Dealer Trade / Locate", sub: "Last resort. Only after the lot has failed them.", icon: Search, tone: B.amber, bg: "#FFF7ED", br: "#FED7AA" },
                ].map(o => {
                  const sel = d.avail === o.key;
                  const Ic = o.icon;
                  return (
                    <button key={o.key} type="button" onClick={() => s("avail")(o.key)} style={{
                      display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                      padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                      border: sel ? `2px solid ${o.tone}` : "1.5px solid #e0e0e0",
                      background: sel ? o.bg : B.w, transition: "all 0.15s", fontFamily: F,
                    }}>
                      <div style={{ background: sel ? o.tone : "#eee", borderRadius: 8, padding: 8, display: "flex", flexShrink: 0 }}>
                        <Ic size={18} color={sel ? B.w : "#999"} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: sel ? o.tone : B.blk }}>{o.label}</div>
                        <div style={{ fontSize: 12, color: "#777", marginTop: 1 }}>{o.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Fl>

            {/* IN-STOCK PATH */}
            {isStock && (
              <div style={{ marginTop: 14, padding: 14, background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 10 }}>
                  <Fl label="Year"><In value={d.vy} onChange={s("vy")} placeholder="2026" /></Fl>
                  <Fl label="Model"><In value={d.vmod} onChange={s("vmod")} placeholder="RAV4" list="models-a" /></Fl>
                  <Fl label="Trim"><In value={d.vtrim} onChange={s("vtrim")} placeholder="XLE" /></Fl>
                </div>
                <Fl label="Color on the unit"><In value={d.vcolor} onChange={s("vcolor")} placeholder="Magnetic Gray" list="colors-a" /></Fl>
                <Fl label="Have they seen it in person yet?">
                  <Choice value={d.seen} onChange={s("seen")} options={[
                    { key: "Yes — walked it", label: "Yes" },
                    { key: "No — online only", label: "Online only" },
                    { key: "Not yet", label: "Not yet" },
                  ]} />
                </Fl>
              </div>
            )}

            {/* SHOPPING PATH */}
            {d.avail === "shopping" && (
              <div style={{ marginTop: 14, padding: 12, background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 10 }}>
                <p style={{ fontFamily: F, fontSize: 12, color: "#1E3A5F", margin: 0 }}>
                  No unit yet — work the needs assessment below and land them on a stock number before they leave.
                </p>
              </div>
            )}
          </Sec>
        </FadeIn>

        {/* 3. LOCATE PROFILE — the dynamic dealer-trade panel */}
        {isLocate && (
          <FadeIn>
            <div id="locate-gate" style={{ marginBottom: 20, background: B.w, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "2px solid #F59E0B" }}>
              <div style={{ background: "#FFF7ED", padding: "12px 20px", borderBottom: "1.5px solid #FED7AA" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: B.amber, borderRadius: 8, padding: 6, display: "flex" }}><Search size={16} color={B.w} /></div>
                  <div>
                    <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: B.amber, margin: 0 }}>Locate Profile</h3>
                    <p style={{ fontFamily: F, fontSize: 12, color: "#92400E", margin: "2px 0 0" }}>
                      A trade costs us margin, time, and a unit off someone else's lot. Justify it.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 20px" }}>

                {/* GATE 0 — did you actually work the lot? */}
                <div style={{ marginBottom: 20, padding: 14, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <AlertTriangle size={15} color={B.red} />
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.red, fontFamily: F }}>Before we chase a car</h4>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 12, color: "#991B1B", margin: "0 0 12px" }}>
                    Most "we don't have it" is really "I didn't sell what we have." Show your work.
                  </p>

                  <Fl label="Which units on our lot did you show them?" hint="Stock numbers or models. If the answer is none, go do that first." req>
                    <TA value={d.shown} onChange={s("shown")} placeholder="T26-1044 Highlander XLE, T26-2210 Grand Highlander XLE..." rows={2} />
                  </Fl>

                  <Fl label="Why didn't those work?" hint="Be specific. 'Wrong color' is a reason to keep selling, not a reason to trade." req>
                    <TA value={d.whyNot} onChange={s("whyNot")} placeholder="Needed a third row bench, ours are all captain's chairs..." rows={2} />
                  </Fl>

                  {[
                    { k: "triedStock", label: "I showed them comparable units on our lot and worked to earn the sale here.", req: true },
                    { k: "explainedWait", label: "I told them a trade takes time and isn't guaranteed.", req: false },
                  ].map(c => (
                    <div key={c.k} onClick={() => { startTimer(); setD(p => ({ ...p, [c.k]: !p[c.k] })); }} style={{
                      display: "flex", alignItems: "flex-start", gap: 9, cursor: "pointer", marginBottom: 8,
                      padding: "9px 11px", borderRadius: 8,
                      background: d[c.k] ? "#F0FDF4" : B.w,
                      border: `1.5px solid ${d[c.k] ? "#BBF7D0" : "#eee"}`,
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                        background: d[c.k] ? B.grn : B.w,
                        border: `1.5px solid ${d[c.k] ? B.grn : "#ccc"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {d[c.k] && <CheckCircle2 size={12} color={B.w} />}
                      </div>
                      <span style={{ fontFamily: F, fontSize: 12.5, color: d[c.k] ? "#166534" : "#555", lineHeight: 1.4, fontWeight: d[c.k] ? 600 : 400 }}>
                        {c.label}{c.req && <span style={{ color: B.red, marginLeft: 3 }}>*</span>}
                      </span>
                    </div>
                  ))}
                </div>

                {/* OPTION 1 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ background: B.red, color: B.w, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: F }}>1</span>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.blk, fontFamily: F }}>The vehicle they want</h4>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                    <Fl label="Model" req><In value={d.o1model} onChange={s("o1model")} placeholder="Grand Highlander" list="models-a" /></Fl>
                    <Fl label="Trim"><In value={d.o1trim} onChange={s("o1trim")} placeholder="Limited" /></Fl>
                  </div>

                  <Fl label="Preferred color" hint="What do they actually want? Tap all they'd be happy with." req>
                    <ChipRow options={COLORS} colors selected={d.o1colors} onToggle={i => togArr("o1colors", i)} />
                  </Fl>

                  <Fl label="What else would they take?" hint="Push here. If we can't find the first color, what's the fallback?">
                    <ChipRow options={COLORS} colors selected={d.o1alt} onToggle={i => togArr("o1alt", i)} />
                  </Fl>

                  <Fl label="Must-have equipment" hint="Non-negotiable. If it doesn't have this, don't trade for it." req>
                    <ChipRow options={EQUIPMENT} selected={d.o1equip} onToggle={i => togArr("o1equip", i)} />
                  </Fl>

                  <Fl label="What will they NOT accept?" hint="Deal-breakers. Cloth seats? No sunroof? White?">
                    <TA value={d.o1no} onChange={s("o1no")} placeholder="Won't take a base model, no white, must not have a spoiler..." rows={2} />
                  </Fl>
                </div>

                <div style={{ height: 1, background: "#eee", margin: "0 0 18px" }} />

                {/* OPTION 2 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: B.dg, color: B.w, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: F }}>2</span>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.blk, fontFamily: F }}>If we can't get #1...</h4>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 12, color: "#888", margin: "0 0 10px", fontStyle: "italic" }}>
                    Ask it out loud: "If that exact one is gone, what's the next one you'd drive home today?"
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                    <Fl label="Model" req><In value={d.o2model} onChange={s("o2model")} placeholder="Highlander" list="models-a" /></Fl>
                    <Fl label="Trim"><In value={d.o2trim} onChange={s("o2trim")} placeholder="XLE" /></Fl>
                  </div>
                  <Fl label="Colors they'd accept">
                    <ChipRow options={COLORS} colors selected={d.o2colors} onToggle={i => togArr("o2colors", i)} />
                  </Fl>
                  <Fl label="Why does this one work for them?">
                    <In value={d.o2note} onChange={s("o2note")} placeholder="Same 3rd row, saves $60/mo" voice />
                  </Fl>
                </div>

                <div style={{ height: 1, background: "#eee", margin: "0 0 18px" }} />

                {/* OPTION 3 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: B.dg, color: B.w, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: F }}>3</span>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.blk, fontFamily: F }}>And if we can't get #2...</h4>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 12, color: "#888", margin: "0 0 10px", fontStyle: "italic" }}>
                    Three options means three chances to close. One option means one chance to lose.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                    <Fl label="Model" req><In value={d.o3model} onChange={s("o3model")} placeholder="RAV4" list="models-a" /></Fl>
                    <Fl label="Trim"><In value={d.o3trim} onChange={s("o3trim")} placeholder="XLE Premium" /></Fl>
                  </div>
                  <Fl label="Colors they'd accept">
                    <ChipRow options={COLORS} colors selected={d.o3colors} onToggle={i => togArr("o3colors", i)} />
                  </Fl>
                  <Fl label="Why does this one work for them?">
                    <In value={d.o3note} onChange={s("o3note")} placeholder="Smaller but has every feature they asked for" voice />
                  </Fl>
                </div>

                <div style={{ height: 1, background: "#eee", margin: "0 0 18px" }} />

                {/* FLEXIBILITY + COMMITMENT */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Palette size={15} color={B.amber} />
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.blk, fontFamily: F }}>Flexibility & Commitment</h4>
                </div>

                <Fl label="If we can't get the exact color, would they take another?" req>
                  <Choice value={d.flexColor} onChange={s("flexColor")} options={[
                    { key: "yes", label: "Yes" },
                    { key: "depends", label: "Depends on equipment" },
                    { key: "no", label: "No — color is firm" },
                  ]} />
                </Fl>

                <Fl label="What matters MORE to them?" req>
                  <Choice value={d.priority} onChange={s("priority")} options={[
                    { key: "color", label: "Exact color" },
                    { key: "equipment", label: "Exact equipment" },
                  ]} />
                </Fl>

                <Fl label="How soon do they need it?">
                  <Choice value={d.timeline} onChange={s("timeline")} options={[
                    { key: "Today", label: "Today" },
                    { key: "This week", label: "This week" },
                    { key: "2-4 weeks", label: "2–4 weeks" },
                    { key: "Flexible", label: "Flexible" },
                  ]} />
                </Fl>

                <Fl label="If we find this exact vehicle, are they ready to move forward?" hint="This is the trial close. Ask it before you go get the car." req>
                  <Choice value={d.commit} onChange={s("commit")} options={[
                    { key: "yes", label: "Yes — ready" },
                    { key: "think", label: "Needs to think" },
                    { key: "no", label: "Not ready" },
                  ]} />
                </Fl>

                <Fl label="Anything else the desk needs to know?">
                  <TA value={d.locnotes} onChange={s("locnotes")} placeholder="Willing to wait 2 weeks for the right one, wants payment under $650..." rows={2} />
                </Fl>

                {/* GATE STATUS */}
                <div style={{
                  marginTop: 6, padding: "12px 14px", borderRadius: 10,
                  background: locateReady ? "#F0FDF4" : "#FEF2F2",
                  border: `1.5px solid ${locateReady ? "#BBF7D0" : "#FECACA"}`,
                }}>
                  {locateReady ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={16} color={B.grn} />
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: B.grn }}>Locate profile complete — the desk can act on this.</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <AlertTriangle size={16} color={B.red} />
                        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: B.red }}>
                          {gaps.length} question{gaps.length !== 1 ? "s" : ""} still unanswered
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {gaps.map(g => (
                          <span key={g} style={{ background: B.w, border: "1px solid #FECACA", color: "#B91C1C", padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, fontFamily: F }}>{g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 4. MOTIVATION */}
        <FadeIn>
          <Sec title="Motivation" icon={Heart}>
            <Fl label="What brought them in today?" hint="The WHY — what changed in their life that's driving this visit?">
              <TA value={d.mot} onChange={s("mot")} placeholder="New job, growing family, lease ending, car broke down..." rows={3} />
            </Fl>
          </Sec>
        </FadeIn>

        {/* 5. TRADE */}
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
              <Fl label="What have you been driving most recently?"><In value={d.rv} onChange={s("rv")} placeholder="Year, Make, Model" voice /></Fl>
              <Fl label="What did you like about it?"><TA value={d.rl} onChange={s("rl")} placeholder="Features, ride, reliability..." /></Fl>
              <Fl label="What didn't work for you?"><TA value={d.rd} onChange={s("rd")} placeholder="Pain points, frustrations..." /></Fl>
            </Sec>
          )}
        </FadeIn>

        {/* 6. LIFESTYLE */}
        <FadeIn>
          <Sec title="Lifestyle & Needs" icon={Heart}>
            <Fl label="How will you use this vehicle?" hint="Tap all that apply — drives what to highlight on the walkaround.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {LIFE_ITEMS.map(o => (
                  <LifeCard key={o.label} label={o.label} icon={o.icon} sel={d.life.includes(o.label)} onClick={() => togArr("life", o.label)} />
                ))}
              </div>
            </Fl>
          </Sec>
        </FadeIn>

        {/* 7. MUST-HAVES */}
        <FadeIn>
          <Sec title="What Else Matters" icon={Star}>
            <Fl label="What does this vehicle need to have to be the one?" hint="The WHAT — features, specs, deal-breakers.">
              <TA value={d.mh} onChange={s("mh")} placeholder="Third row? AWD? Under $650/mo? What's non-negotiable?" />
            </Fl>
            <Fl label="Notes"><TA value={d.nn} onChange={s("nn")} placeholder="Anything else worth capturing" rows={2} /></Fl>
          </Sec>
        </FadeIn>

        {/* 8. DECISION MAKERS */}
        <FadeIn>
          <Sec title="Decision Makers" icon={Users}>
            <Fl label="Who is the primary driver?"><In value={d.pd} onChange={s("pd")} placeholder="Name / relationship" /></Fl>
            <Fl label="Who else is involved in this decision?"><TA value={d.di} onChange={s("di")} placeholder="Spouse, parent, friend, mechanic..." voice={false} rows={2} /></Fl>
          </Sec>
        </FadeIn>

        {/* WALKAROUND */}
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

        {/* SUBMIT GATE WARNING */}
        {showGate && !canSubmit && (
          <div style={{ background: "#FEF2F2", border: "2px solid #FECACA", borderRadius: 10, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={18} color={B.red} />
            <span style={{ fontFamily: F, fontSize: 13, color: "#B91C1C", fontWeight: 600 }}>
              Finish the Locate Profile above. A dealer trade without a full profile is a guess.
            </span>
          </div>
        )}

        <FadeIn>
          <Btn primary onClick={submit} style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}>
            <Send size={18} /> {isLocate ? "Submit Locate Request" : "Submit Assessment"}
          </Btn>
        </FadeIn>
      </div>

      {/* datalists for quick model/color entry */}
      <datalist id="models-a">{MODELS.map(m => <option key={m} value={m} />)}</datalist>
      <datalist id="colors-a">{COLORS.map(c => <option key={c.name} value={c.name} />)}</datalist>
    </div>
  );
}
