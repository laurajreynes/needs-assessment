import { useState, useEffect, useRef } from "react";
import { Clock, Printer, BarChart3, Send, RotateCcw, CheckCircle2, Star, User, Car, Users, Heart, MapPin, Map, Truck, Compass, Shield, Gauge, Sparkles, Smartphone, Fuel, Sofa, Mic, MicOff, Info, TrendingDown, Mail } from "lucide-react";

const LOGO = "/logo.png";
const SAVE_KEY = "fatcc-needs-assessment-es";

const B = { red: "#C8102E", dk: "#A50D24", blk: "#1A1A1A", dg: "#2D2D2D", lg: "#F5F5F5", w: "#FFF" };
const F = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/* ── DIRECTORIO DE PERSONAL ── */
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
  { label: "Traslado Diario", icon: MapPin },
  { label: "Familia", icon: Users },
  { label: "Viajes por Carretera", icon: Map },
  { label: "Remolque / Carga", icon: Truck },
  { label: "Todo Terreno", icon: Compass },
  { label: "Seguridad Primero", icon: Shield },
  { label: "Rendimiento", icon: Gauge },
  { label: "Estilo / Apariencia", icon: Sparkles },
  { label: "Tecnologia y Funciones", icon: Smartphone },
  { label: "Economia de Combustible", icon: Fuel },
  { label: "Confort / Espacio", icon: Sofa },
  { label: "Reduccion de Tamano", icon: TrendingDown },
];

/* ── GUIA DE RECORRIDO DEL VEHICULO ──
   short = frase corta mostrada por defecto (4-6 palabras)
   tip   = detalle de coaching expandido (tocar i para revelar) */
const walkaroundGuide = {
  safety:      { label: "Sistemas de Seguridad",     short: "Sensores, camaras, calificaciones",   tip: "Senale cada sensor y camara en el recorrido. Muestre la calificacion de seguridad en la etiqueta de la ventana." },
  fuel:        { label: "Eficiencia de Combustible",  short: "MPG, modo eco, ahorro",              tip: "Resalte el MPG en la etiqueta. Demuestre el modo eco si esta disponible. Hable del costo por milla." },
  space:       { label: "Carga y Versatilidad",       short: "Cajuela, asientos, espacio",         tip: "Abra la cajuela, recline los asientos, dejelos ver y sentir el espacio." },
  tech:        { label: "Tecnologia y Conectividad",  short: "Pantalla, CarPlay, audio",           tip: "Encienda la pantalla. Conecte su telefono con CarPlay o Android Auto." },
  comfort:     { label: "Comodidad y Conduccion",     short: "Asientos calefactados, cabina",      tip: "Sientelos adentro. Muestre asientos calefactados/ventilados, soporte lumbar, silencio de cabina." },
  towing:      { label: "Capacidad de Remolque",      short: "Capacidad, enganche, modo remolque", tip: "Senale la capacidad de remolque en la etiqueta. Muestre el enganche y el modo remolque." },
  performance: { label: "Rendimiento y Potencia",     short: "Motor, modo sport, prueba de manejo",tip: "Revise las especificaciones del motor en la etiqueta. Demuestre el modo sport. Deje que el manejo hable." },
  style:       { label: "Diseno y Estilo",            short: "Exterior, rines, luces, pintura",    tip: "Alejese y dejelos admirarlo. Senale los LEDs, rines, pintura." },
  offroad:     { label: "Capacidad Todo Terreno",     short: "Altura, AWD/4WD, placas protectoras",tip: "Muestre la altura al suelo, controles AWD/4WD, caracteristicas todo terreno." },
  family:      { label: "Para la Familia",            short: "Anclajes de silla, espacio, camaras",tip: "Muestre anclajes LATCH, espacio trasero, camara de reversa. Dejelos imaginar a la familia." },
};

/* ── DETECCION INTELIGENTE DE PUNTOS CLAVE ──
   Tile de estilo de vida = senal fuerte (3 pts). Palabra clave = 1 pt.
   Umbral = 2 pts para activar. Una sola palabra generica no se activa. */
const hotBtnRules = {
  safety:      { words: ["airbag", "choque", "punto ciego", "colision", "seguridad", "crash", "blind spot", "collision", "safety"],                                tiles: ["Seguridad Primero"] },
  fuel:        { words: ["gasolina", "combustible", "mpg", "millaje", "hibrido", "electrico", "ev", "economia", "gas", "fuel", "mileage", "hybrid", "electric"],   tiles: ["Traslado Diario", "Economia de Combustible", "Reduccion de Tamano"] },
  space:       { words: ["espacio", "carga", "cajuela", "almacenamiento", "tercera fila", "room", "space", "cargo", "trunk", "storage", "legroom", "third row"],    tiles: ["Confort / Espacio"] },
  tech:        { words: ["tecnologia", "pantalla", "carplay", "android", "bluetooth", "navegacion", "inalambrico", "tech", "screen", "wireless"],                   tiles: ["Tecnologia y Funciones"] },
  comfort:     { words: ["confort", "comodidad", "suave", "silencioso", "piel", "calefactado", "ventilado", "viaje largo", "comfort", "ride", "smooth", "quiet", "leather", "heated"], tiles: ["Viajes por Carretera", "Confort / Espacio"] },
  towing:      { words: ["remolque", "remolcar", "trailer", "bote", "enganche", "carga", "tow", "haul", "trailer", "boat", "hitch", "towing"],                     tiles: ["Remolque / Carga"] },
  performance: { words: ["potencia", "motor", "rapido", "turbo", "v6", "v8", "aceleracion", "caballos", "power", "engine", "fast", "horsepower"],                   tiles: ["Rendimiento"] },
  style:       { words: ["apariencia", "color", "estilo", "deportivo", "diseno", "look", "style", "sporty", "sharp", "design"],                                     tiles: ["Estilo / Apariencia"] },
  offroad:     { words: ["todo terreno", "4x4", "4wd", "awd", "sendero", "lodo", "terreno", "off-road", "off road", "trail", "mud", "terrain"],                    tiles: ["Todo Terreno"] },
  family:      { words: ["familia", "nino", "hijos", "silla de bebe", "carriola", "creciendo", "bebe", "family", "kid", "children", "car seat", "baby"],           tiles: ["Familia"] },
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

/* ── CONSTRUCTOR DE EMAIL HTML ── */
const buildEmailHTML = (sub) => {
  const hotLabels = (sub.hot || []).map(h => walkaroundGuide[h]?.label || h);
  const r = (label, value) => value ? `<tr><td style="padding:6px 8px;font-weight:600;color:#888;width:130px;vertical-align:top">${label}</td><td style="padding:6px 8px;color:#333">${value}</td></tr>` : "";
  const section = (title, rows) => {
    const filtered = rows.filter(Boolean).join("");
    return filtered ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">${title}</h3><table style="width:100%;border-collapse:collapse">${filtered}</table>` : "";
  };
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#C8102E;color:white;padding:16px 20px;border-radius:8px 8px 0 0;text-align:center">
      <h2 style="margin:0;font-size:18px">Evaluacion de Necesidades</h2>
      <p style="margin:6px 0 0;opacity:0.8;font-size:13px">Fred Anderson Toyota of Cape Coral</p>
    </div>
    <div style="padding:16px 20px;background:#f5f5f5;border-radius:0 0 8px 8px">
      <table style="width:100%;border-collapse:collapse">
        ${r("Cliente", sub.cn)}
        ${r("Vendedor/a", sub.sp)}
        ${r("Fecha", new Date(sub.ts).toLocaleString())}
      </table>
      ${(sub.stk || sub.vm || sub.vmod) ? section("Vehiculo de Interes", [r("Stock #", sub.stk), r("Vehiculo", [sub.vy, sub.vm, sub.vmod].filter(Boolean).join(" "))]) : ""}
      ${sub.mot ? section("Motivacion", [r("", sub.mot)]) : ""}
      ${sub.hasTrade && sub.tv ? section("Vehiculo de Intercambio", [r("Vehiculo", sub.tv), r("Le Encanta", sub.tlike), r("Quisiera Diferente", sub.tdis), r("Prestamista", sub.tlen), r("Saldo", sub.tbal), r("Pago", sub.tpay)]) : ""}
      ${!sub.hasTrade && sub.rv ? section("Vehiculo Reciente", [r("Conduciendo", sub.rv), r("Le Gusto", sub.rl), r("No Funciono", sub.rd)]) : ""}
      ${sub.life?.length > 0 ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Estilo de Vida</h3><p style="margin:0;font-size:14px">${sub.life.join(", ")}</p>` : ""}
      ${hotLabels.length > 0 ? `<h3 style="color:#C8102E;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Enfoque del Recorrido</h3><p style="margin:0;font-size:14px">${hotLabels.join(", ")}</p>` : ""}
      ${(sub.mh || sub.nn) ? section("Notas Clave", [r("Requisitos Indispensables", sub.mh), r("Notas", sub.nn)]) : ""}
      ${(sub.pd || sub.di) ? section("Tomadores de Decision", [r("Conductor Principal", sub.pd), r("Influencias", sub.di)]) : ""}
    </div></div>`;
};

/* ── ENTRADA DE VOZ ── */
const hasVoice = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const VoiceBtn = ({ onResult }) => {
  const [on, setOn] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    if (on && recRef.current) { recRef.current.stop(); setOn(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = "es-US";
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

/* ── REVELACION PROGRESIVA ── las secciones aparecen al hacer scroll */
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
        <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>Comienza cuando empieces</span>
      </div>
    );
  }
  const d = Math.floor((n - t0) / 1000), m = Math.floor(d / 60), s = d % 60;
  const c = m < 5 ? "#22c55e" : m < 10 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color={c} />
      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: c }}>{m}:{String(s).padStart(2, "0")}</span>
      {m < 5 && <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>Tomate tu tiempo</span>}
      {m >= 10 && <span style={{ fontFamily: F, fontSize: 10, color: "#ef4444" }}>Sigue avanzando</span>}
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

/* ── PASTILLA DE PUNTO CLAVE (vista de formulario — con i expandible) ── */
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

/* ── CARGAR ESTADO GUARDADO ── */
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

  /* ── AUTO-GUARDADO (con retraso) ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ data: d, hasTrade, t0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [d, hasTrade, t0]);

  /* ── PERSISTIR ENVIOS ── */
  useEffect(() => {
    localStorage.setItem(SAVE_KEY + "-subs", JSON.stringify(subs));
  }, [subs]);

  /* ── OCULTAR BANNER DE REANUDACION ── */
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

  /* ── ENVIAR EMAIL AUTOMATICAMENTE ── */
  const sendEmail = async (submission) => {
    const spInfo = SALESPEOPLE.find(p => p.name === submission.sp);
    const recipients = [...MANAGER_EMAILS];
    if (spInfo) recipients.push(spInfo.email);
    const html = buildEmailHTML(submission);
    const subject = `Evaluacion: ${submission.cn || "Cliente"} — ${submission.sp || "Vendedor/a"}`;
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
    // Enviar ambas llamadas API inmediatamente antes de cambios de estado
    const dbSave = fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }).catch(err => console.error("Error de envio:", err));
    const emailSend = sendEmail(submission);
    // Ahora actualizar la UI
    setSubs(p => [...p, submission]);
    setView("done");
    // Esperar a que ambos terminen
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
    if (!confirm("Borrar esta evaluacion y empezar de nuevo?")) return;
    localStorage.removeItem(SAVE_KEY);
    setT0(null);
    setD({ ...defaultData, sp: d.sp });
    setHasTrade(true);
    setExpandedHot({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── VISTA DE RESUMEN ENVIADO ── */
  if (view === "done") {
    const l = subs[subs.length - 1];
    const dur = `${Math.floor(l.dur / 60)}m ${l.dur % 60}s`;
    const hasVehicle = l.stk || l.vm || l.vmod;

    return (
      <div style={{ fontFamily: F, maxWidth: 600, margin: "0 auto", padding: 20, background: B.lg, minHeight: "100vh" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <img src={LOGO} alt="Fred Anderson Toyota of Cape Coral" style={{ height: 50, objectFit: "contain" }} />
        </div>

        {/* Encabezado del Cliente */}
        <div style={{ background: B.red, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center", color: B.w }}>
          <CheckCircle2 size={32} color="#fff" />
          <h2 style={{ margin: "8px 0 4px", fontSize: 20 }}>{l.cn || "Cliente"}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            {new Date(l.ts).toLocaleDateString()} a las {new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            Vendedor/a: {l.sp || "\u2014"} &bull; Duracion: {dur}
          </p>
        </div>

        {/* Estado del email */}
        {emailStatus && (
          <div style={{
            padding: "10px 16px", borderRadius: 8, marginBottom: 12, textAlign: "center", fontSize: 13, fontFamily: F, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: emailStatus === "sent" ? "#DCFCE7" : emailStatus === "sending" ? "#E0F2FE" : "#FEE2E2",
            color: emailStatus === "sent" ? "#166534" : emailStatus === "sending" ? "#0C4A6E" : "#991B1B",
          }}>
            <Mail size={14} />
            {emailStatus === "sending" && "Enviando email a gerentes..."}
            {emailStatus === "sent" && "Email enviado a todos los gerentes y vendedor/a"}
            {emailStatus === "error" && "Error de email — verifica las credenciales de Gmail en Vercel"}
          </div>
        )}

        {/* Construccion de Valor en el Recorrido — esquema azul */}
        {l.hot.length > 0 && (
          <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1E3A5F", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5 }}>Construir Valor en el Recorrido</h4>
            {l.hot.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: B.red, color: B.w, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>{walkaroundGuide[b]?.label}</span>
                <span style={{ fontSize: 12, color: "#555", fontFamily: F }}>{walkaroundGuide[b]?.short}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vehiculo de Interes */}
        {hasVehicle && (
          <SumCard title="Vehiculo de Interes">
            <SumRow label="Stock #" value={l.stk} />
            <SumRow label="Vehiculo" value={[l.vy, l.vm, l.vmod].filter(Boolean).join(" ")} />
          </SumCard>
        )}

        {/* Motivacion */}
        {l.mot && (
          <SumCard title="Motivacion">
            <p style={{ margin: 0, fontSize: 14, color: "#333", lineHeight: 1.5 }}>{l.mot}</p>
          </SumCard>
        )}

        {/* Vehiculo de Intercambio */}
        {l.hasTrade && (l.tv || l.ty || l.tlen) && (
          <SumCard title="Vehiculo de Intercambio">
            <SumRow label="Vehiculo" value={l.tv || [l.ty, l.tm, l.tmod].filter(Boolean).join(" ")} />
            <SumRow label="Millaje" value={l.tmi} />
            <SumRow label="Prestamista" value={l.tlen} />
            <SumRow label="Saldo" value={l.tbal} />
            <SumRow label="Pago" value={l.tpay} />
            <SumRow label="Le Encanta" value={l.tlike} />
            <SumRow label="Quisiera Diferente" value={l.tdis} />
          </SumCard>
        )}

        {/* Vehiculo Reciente (sin intercambio) */}
        {!l.hasTrade && (l.rv || l.rl || l.rd) && (
          <SumCard title="Vehiculo Reciente">
            <SumRow label="Conduciendo" value={l.rv} />
            <SumRow label="Le Gusto" value={l.rl} />
            <SumRow label="No Funciono" value={l.rd} />
          </SumCard>
        )}

        {/* Estilo de Vida */}
        {l.life.length > 0 && (
          <SumCard title="Estilo de Vida y Necesidades">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {l.life.map(li => <span key={li} style={{ background: "#F0F0F0", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#555" }}>{li}</span>)}
            </div>
          </SumCard>
        )}

        {/* Tomadores de Decision */}
        {(l.pd || l.di) && (
          <SumCard title="Tomadores de Decision">
            <SumRow label="Conductor Principal" value={l.pd} />
            <SumRow label="Influencias" value={l.di} />
          </SumCard>
        )}

        {/* Notas Clave */}
        {(l.mh || l.nn) && (
          <SumCard title="Notas Clave" subtitle="Copiar y pegar en DriveCentric">
            <SumRow label="Requisitos Indispensables" value={l.mh} />
            <SumRow label="Notas" value={l.nn} />
          </SumCard>
        )}

        {/* Acciones */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Btn primary onClick={() => window.print()}><Printer size={16} /> Imprimir</Btn>
          <Btn onClick={startNew}><RotateCcw size={16} /> Nuevo</Btn>
          <Btn onClick={() => setView("stats")}><BarChart3 size={16} /> Estadisticas</Btn>
        </div>
      </div>
    );
  }

  /* ── VISTA DE ESTADISTICAS ── */
  if (view === "stats") {
    const avg = subs.length ? Math.round(subs.reduce((a, x) => a + x.dur, 0) / subs.length) : 0;
    const hb = {}; subs.flatMap(x => x.hot).forEach(h => { hb[h] = (hb[h] || 0) + 1 });
    const sorted = Object.entries(hb).sort((a, b) => b[1] - a[1]);

    const spMap = {};
    subs.forEach(x => {
      const name = x.sp || "Desconocido";
      if (!spMap[name]) spMap[name] = { count: 0, totalDur: 0 };
      spMap[name].count++;
      spMap[name].totalDur += x.dur;
    });
    const spList = Object.entries(spMap).sort((a, b) => b[1].count - a[1].count);

    return (
      <div style={{ fontFamily: F, maxWidth: 600, margin: "0 auto", padding: 20 }}>
        <h2 style={{ color: B.blk, marginBottom: 16 }}>Estadisticas del Gerente</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{subs.length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Enviados</div>
          </div>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{Math.floor(avg / 60)}:{String(avg % 60).padStart(2, "0")}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Prom. Minutos</div>
          </div>
          <div style={{ background: B.w, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.red }}>{Object.keys(spMap).length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Vendedores</div>
          </div>
        </div>

        {spList.length > 0 && (
          <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>Por Vendedor/a</h3>
            {spList.map(([name, data]) => {
              const avgDur = Math.round(data.totalDur / data.count);
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.blk }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{data.count} evaluacion{data.count !== 1 ? "es" : ""}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>
                    Prom. {Math.floor(avgDur / 60)}:{String(avgDur % 60).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subs.length > 0 && (
          <div style={{ background: B.w, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>Envios Recientes</h3>
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
            <h3 style={{ fontSize: 15, margin: "0 0 12px", color: B.blk }}>Areas de Enfoque del Recorrido</h3>
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

        <Btn onClick={() => setView("form")}>Volver</Btn>
      </div>
    );
  }

  /* ── VISTA DEL FORMULARIO ── */
  return (
    <div style={{ fontFamily: F, background: B.lg, minHeight: "100vh" }}>

      {/* ENCABEZADO FIJO: LOGO + TEMPORIZADOR + PROGRESO */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: B.w, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={LOGO} alt="Fred Anderson Toyota of Cape Coral" style={{ height: 36, objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Timer t0={t0} />
            <button onClick={resetForm} title="Reiniciar formulario" style={{ background: "none", border: "1.5px solid #ddd", cursor: "pointer", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <RotateCcw size={13} color="#888" /><span style={{ color: "#888", fontSize: 11, fontFamily: F, fontWeight: 600 }}>Reiniciar</span>
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
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: B.dg }}>Progreso de la Evaluacion</span>
            <span style={{ fontFamily: F, fontSize: 10, color: "#888" }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: B.red, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      {/* BANNER DE COACHING */}
      <div style={{ background: B.red, padding: "6px 16px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 11, color: B.w, margin: 0, fontStyle: "italic", letterSpacing: 0.3 }}>
          Los clientes no compran vehiculos. Compran soluciones a sus problemas.
        </p>
      </div>

      {/* BANNER DE REANUDACION */}
      {resumed && (
        <div style={{ background: "#E0F2FE", padding: "8px 16px", textAlign: "center", borderBottom: "1px solid #38BDF8" }}>
          <p style={{ fontFamily: F, fontSize: 12, color: "#0C4A6E", margin: 0, fontWeight: 600 }}>
            Continuando desde donde lo dejaste
          </p>
        </div>
      )}

      {/* FORMULARIO */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* 1. INFORMACION DEL CLIENTE */}
        <FadeIn>
          <Sec title="Informacion del Cliente" icon={User}>
            <Fl label="Vendedor/a">
              <select style={{ ...sIn, background: B.w }} value={d.sp} onChange={e => s("sp")(e.target.value)}
                onFocus={e => { e.target.style.borderColor = B.red }} onBlur={e => { e.target.style.borderColor = "#ddd" }}>
                <option value="">Selecciona tu nombre</option>
                {SALESPEOPLE.map(p => <option key={p.email} value={p.name}>{p.name}</option>)}
              </select>
            </Fl>
            <Fl label="Nombre del Cliente"><In value={d.cn} onChange={s("cn")} placeholder="Nombre" /></Fl>
          </Sec>
        </FadeIn>

        {/* 2. VEHICULO DE INTERES */}
        <FadeIn>
          <Sec title="Vehiculo de Interes" icon={Car} accent>
            <p style={{ fontFamily: F, fontSize: 12, color: "#666", margin: "0 0 12px" }}>Si llegaron por un numero de stock o vehiculo especifico, ingresalo aqui.</p>
            <Fl label="Stock #"><In value={d.stk} onChange={s("stk")} placeholder="ej. T24-1234" style={{ fontSize: 18, fontWeight: 700, padding: "12px 16px" }} /></Fl>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Fl label="Ano"><In value={d.vy} onChange={s("vy")} placeholder="2025" /></Fl>
              <Fl label="Marca"><In value={d.vm} onChange={s("vm")} placeholder="Toyota" /></Fl>
              <Fl label="Modelo"><In value={d.vmod} onChange={s("vmod")} placeholder="Camry" /></Fl>
            </div>
          </Sec>
        </FadeIn>

        {/* 3. MOTIVACION */}
        <FadeIn>
          <Sec title="Motivacion" icon={Heart}>
            <Fl label={hasVOI ? "Que les atrajo de este vehiculo en especifico?" : "Que los trae a buscar un vehiculo hoy?"} hint="Los clientes no compran vehiculos. Compran soluciones a sus problemas.">
              <TA value={d.mot} onChange={s("mot")} placeholder={hasVOI ? "Que les llamo la atencion? En linea? Pasaron por aqui? Referidos?" : "Que cambio? Nuevo trabajo, familia creciendo, problemas de confiabilidad?"} rows={3} />
            </Fl>
          </Sec>
        </FadeIn>

        {/* 4. INTERCAMBIO TOGGLE + INTERCAMBIO O VEHICULO RECIENTE */}
        <FadeIn>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { startTimer(); setHasTrade(!hasTrade); }}>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: hasTrade ? B.red : "#ccc", position: "relative", flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: B.w, position: "absolute", top: 2, left: hasTrade ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: B.blk }}>El cliente tiene un vehiculo de intercambio</span>
          </div>

          {hasTrade ? (
            <Sec title="Descubrimiento del Intercambio" icon={Car}>
              <Fl label="Vehiculo de intercambio"><In value={d.tv} onChange={s("tv")} placeholder="Ano, Marca, Modelo, Millaje" voice /></Fl>
              <Fl label="Que es lo que MAS LE GUSTA de su vehiculo actual?"><TA value={d.tlike} onChange={s("tlike")} placeholder="Funciones, comodidad, confiabilidad..." /></Fl>
              <Fl label="Que QUISIERA que fuera diferente?"><TA value={d.tdis} onChange={s("tdis")} placeholder="Espacio, tecnologia, economia de combustible..." /></Fl>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Fl label="Prestamista"><In value={d.tlen} onChange={s("tlen")} /></Fl>
                <Fl label="Saldo"><In value={d.tbal} onChange={s("tbal")} placeholder="$" /></Fl>
                <Fl label="Pagos"><In value={d.tpay} onChange={s("tpay")} placeholder="$/mes" /></Fl>
              </div>
            </Sec>
          ) : (
            <Sec title="Experiencia con Vehiculo Reciente" icon={Car}>
              <p style={{ fontFamily: F, fontSize: 12, color: "#666", margin: "0 0 10px" }}>Sin intercambio — aprendamos sobre lo que han estado manejando.</p>
              <Fl label="Que has estado manejando recientemente?"><In value={d.rv} onChange={s("rv")} placeholder="Ano, Marca, Modelo" voice /></Fl>
              <Fl label="Que te gusto de ese vehiculo?"><TA value={d.rl} onChange={s("rl")} placeholder="Funciones, manejo, confiabilidad..." /></Fl>
              <Fl label="Que no te funciono?"><TA value={d.rd} onChange={s("rd")} placeholder="Problemas, frustraciones..." /></Fl>
            </Sec>
          )}
        </FadeIn>

        {/* 5. ESTILO DE VIDA */}
        <FadeIn>
          <Sec title="Estilo de Vida y Necesidades" icon={Heart}>
            <Fl label="Como usaras este vehiculo?" hint="Toca todos los que apliquen — ayuda a identificar que resaltar en el recorrido.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {LIFE_ITEMS.map(o => (
                  <LifeCard key={o.label} label={o.label} icon={o.icon} sel={d.life.includes(o.label)} onClick={() => togLife(o.label)} />
                ))}
              </div>
            </Fl>
          </Sec>
        </FadeIn>

        {/* 6. SIGUIENTE VEHICULO / QUE MAS IMPORTA */}
        <FadeIn>
          <Sec title={hasVOI ? "Que Mas Importa" : "Prioridades para el Siguiente Vehiculo"} icon={Star}>
            {hasVOI && (
              <div style={{ background: "#E0F2FE", border: "1px solid #38BDF8", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                <p style={{ fontFamily: F, fontSize: 12, color: "#0C4A6E", margin: 0 }}>Tienen un vehiculo en mente — confirma que sea el adecuado y descubre posibles objeciones.</p>
              </div>
            )}
            <Fl label={hasVOI ? "Ademas de este vehiculo, cuales son tus requisitos indispensables?" : "Cuales son los requisitos indispensables para tu proximo vehiculo?"}>
              <TA value={d.mh} onChange={s("mh")} placeholder={hasVOI ? "Algo que este vehiculo DEBE tener para ser el indicado?" : "Funciones, tamano, tipo, preferencia de marca..."} />
            </Fl>
            <Fl label={hasVOI ? "Alguna preocupacion sobre este vehiculo?" : "Alguna otra nota?"}>
              <TA value={d.nn} onChange={s("nn")} placeholder={hasVOI ? "Dudas, preguntas, cosas por resolver..." : "Preferencias de color, nuevo vs usado, modelos especificos..."} />
            </Fl>
          </Sec>
        </FadeIn>

        {/* 7. TOMADORES DE DECISION */}
        <FadeIn>
          <Sec title="Tomadores de Decision" icon={Users}>
            <Fl label="Quien es el conductor principal?"><In value={d.pd} onChange={s("pd")} placeholder="Nombre / relacion" /></Fl>
            <Fl label="Quien mas esta involucrado en esta decision?"><TA value={d.di} onChange={s("di")} placeholder="Esposo/a, padre/madre, amigo/a, mecanico..." voice={false} /></Fl>
          </Sec>
        </FadeIn>

        {/* CONSTRUCCION DE VALOR EN EL RECORRIDO — esquema azul, pastilla + frase + i */}
        {hot.length > 0 && (
          <FadeIn>
            <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1E3A5F", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5 }}>Construir Valor en el Recorrido</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {hot.map(b => <HotPill key={b} cat={b} guide={walkaroundGuide[b]} expanded={!!expandedHot[b]} onToggle={toggleHotInfo} />)}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ENVIAR */}
        <FadeIn>
          <div ref={bottomRef} style={{ display: "flex", justifyContent: "center" }}>
            <Btn primary onClick={submit} style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}><Send size={18} /> Enviar Evaluacion</Btn>
          </div>
        </FadeIn>
      </div>

    </div>
  );
}
