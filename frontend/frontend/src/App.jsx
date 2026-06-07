import { useEffect,useState } from "react";
import { api } from "./services/api";
import { askAI } from "./services/gemini";
// ── Design tokens ──────────────────────────────────────────────
const COLORS = {
  crimson: "#C0392B",
  crimsonDark: "#922B21",
  crimsonLight: "#F5B7B1",
  crimsonBg: "#FDEDEC",
  gold: "#D4AC0D",
  goldBg: "#FEF9E7",
  teal: "#117A65",
  tealLight: "#A2D9CE",
  tealBg: "#E8F8F5",
  navy: "#1A252F",
  navyMid: "#2C3E50",
  slate: "#566573",
  slateLight: "#BDC3C7",
  bg: "#F8F9FA",
  white: "#FFFFFF",
  border: "rgba(0,0,0,0.08)",
  success: "#1E8449",
  warning: "#D68910",
  danger: "#C0392B",
  info: "#1A5276",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "patients", label: "Patient Twins", icon: "◎" },
  { id: "donors", label: "Donor Intelligence", icon: "♦" },
  { id: "coordinator", label: "AI Coordinator", icon: "◈" },
  { id: "bloodbank", label: "Blood Bank Hub", icon: "▣" },
  { id: "swarm", label: "Swarm Network", icon: "⬡" },
  { id: "eligibility", label: "Health Eligibility", icon: "✦" },
  { id: "learning", label: "Failure Learning", icon: "◉" },
  { id: "engagement", label: "Engagement Engine", icon: "★" },
  { id: "voice", label: "Voice AI", icon: "◐" },
];

function Badge({ children, color = "crimson", size = "sm" }) {
  const palettes = {
    crimson: { bg: COLORS.crimsonBg, text: COLORS.crimsonDark, border: COLORS.crimsonLight },
    teal: { bg: COLORS.tealBg, text: COLORS.teal, border: COLORS.tealLight },
    gold: { bg: COLORS.goldBg, text: "#7D6608", border: "#F9E79F" },
    navy: { bg: "#EAF2FF", text: COLORS.navy, border: "#AED6F1" },
    success: { bg: "#EAFAF1", text: COLORS.success, border: "#A9DFBF" },
    warning: { bg: "#FEF9E7", text: COLORS.warning, border: "#FAD7A0" },
    danger: { bg: COLORS.crimsonBg, text: COLORS.danger, border: COLORS.crimsonLight },
    slate: { bg: "#F2F3F4", text: COLORS.slate, border: COLORS.slateLight },
  };
  const p = palettes[color] || palettes.crimson;
  return (
    <span style={{
      background: p.bg, color: p.text, border: `1px solid ${p.border}`,
      borderRadius: 20, padding: size === "sm" ? "2px 10px" : "4px 14px",
      fontSize: size === "sm" ? 11 : 12, fontWeight: 600, letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "1.5rem",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s, transform 0.2s",
      ...style,
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = ""; } }}
    >{children}</div>
  );
}

function Stat({ label, value, sub, color = COLORS.crimson }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "1.2rem 1.4rem" }}>
      <div style={{ fontSize: 12, color: COLORS.slate, fontWeight: 500, marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.slateLight }}>{sub}</div>}
    </div>
  );
}

function Progress({ value, color = COLORS.crimson, height = 8 }) {
  return (
    <div style={{ background: "#F2F3F4", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
}

function ScoreRing({ score, size = 72, color = COLORS.crimson }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F2F3F4" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size * 0.22} fontWeight={700}
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}>
        {score}
      </text>
    </svg>
  );
}

function Avatar({ name, size = 40, color = COLORS.crimson }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "20", color, fontSize: size * 0.35,
      fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: `2px solid ${color}40`,
    }}>{initials}</div>
  );
}

function BloodGroup({ group }) {
  const colors = {
    "A+": COLORS.crimson, "A-": COLORS.crimsonDark, "B+": "#7D3C98",
    "B-": "#5B2C6F", "AB+": "#1A5276", "AB-": "#154360",
    "O+": COLORS.teal, "O-": "#0E6655",
  };
  return (
    <span style={{
      background: (colors[group] || COLORS.crimson) + "15",
      color: colors[group] || COLORS.crimson,
      border: `1.5px solid ${(colors[group] || COLORS.crimson)}40`,
      borderRadius: 8, padding: "2px 8px", fontSize: 13, fontWeight: 800,
    }}>{group}</span>
  );
}

function PulsingDot({ color = COLORS.crimson, size = 10 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: color,
        animation: "pulse-ring 1.5s ease-out infinite", opacity: 0.4,
      }} />
      <span style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
    </span>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: COLORS.slate, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: COLORS.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "12px 12px", color: COLORS.navyMid, verticalAlign: "middle" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md" }) {
  const styles = {
    primary: { bg: COLORS.crimson, text: "#fff", border: "transparent" },
    secondary: { bg: "transparent", text: COLORS.crimson, border: COLORS.crimson },
    ghost: { bg: "transparent", text: COLORS.slate, border: COLORS.border },
    teal: { bg: COLORS.teal, text: "#fff", border: "transparent" },
    navy: { bg: COLORS.navy, text: "#fff", border: "transparent" },
  };
  const s = styles[variant] || styles.primary;
  const pad = size === "sm" ? "6px 14px" : size === "lg" ? "12px 28px" : "9px 20px";
  return (
    <button onClick={onClick} style={{
      background: s.bg, color: s.text, border: `1.5px solid ${s.border}`,
      borderRadius: 10, padding: pad, fontSize: size === "sm" ? 12 : 14,
      fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
      display: "inline-flex", alignItems: "center", gap: 6,
    }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
    >{children}</button>
  );
}

function Dashboard({ setPage }) {
  const stats = [
    { label: "Active Patients", value: "2,847", sub: "+12 this week", color: COLORS.crimson },
    { label: "Registered Donors", value: "18,432", sub: "4,201 eligible today", color: COLORS.teal },
    { label: "Blood Requests Today", value: "142", sub: "96 fulfilled (68%)", color: COLORS.gold },
    { label: "AI Success Rate", value: "94.2%", sub: "↑ 2.1% this month", color: COLORS.success },
  ];

  const alerts = [
    { type: "emergency", patient: "Ravi Kumar", blood: "O-", hospital: "AIIMS Hyderabad", time: "2 min ago" },
    { type: "critical", patient: "Priya Sharma", blood: "AB+", hospital: "Nizam's Institute", time: "8 min ago" },
    { type: "shortage", patient: null, blood: "B-", hospital: "City Blood Bank", time: "15 min ago" },
  ];

  const modules = [
    { id: "patients", label: "Patient Digital Twins", desc: "AI-tracked patient profiles with transfusion history", icon: "◎", stat: "2,847 active" },
    { id: "donors", label: "Donor Intelligence", desc: "Reliability & health scoring for all donors", icon: "♦", stat: "18K+ donors" },
    { id: "coordinator", label: "AI Coordinator", desc: "Autonomous request-to-donation workflow engine", icon: "◈", stat: "142 active tasks" },
    { id: "bloodbank", label: "Blood Bank Hub", desc: "Real-time inventory & shortage prediction", icon: "▣", stat: "47 banks connected" },
    { id: "swarm", label: "Swarm Network", desc: "5-tier emergency escalation across NGOs & hospitals", icon: "⬡", stat: "12 active swarms" },
    { id: "eligibility", label: "Health Eligibility", desc: "AI medical screening before outreach", icon: "✦", stat: "98.3% accuracy" },
    { id: "learning", label: "Failure Learning", desc: "Self-improving AI from every donation outcome", icon: "◉", stat: "4.2K signals/day" },
    { id: "engagement", label: "Engagement Engine", desc: "Donor streaks, impact stories & smart reminders", icon: "★", stat: "↑ 34% retention" },
  ];

  return (
    <div>
      <style>{`
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.5);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.crimsonDark} 100%)`,
        borderRadius: 20, padding: "2.5rem", marginBottom: "2rem", color: "#fff",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <PulsingDot color="#fff" size={12} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, opacity: 0.8 }}>SYSTEM LIVE — ALL AGENTS ACTIVE</span>
        </div>
        <h3 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 8px", letterSpacing: -1 }}>AI Predictive Blood Crisis Precaution System</h3>
        <p style={{ fontSize: 16, opacity: 0.75, margin: 0 }}>India's Autonomous Blood Care Operating System · Serving Thalassemia patients across 28 states</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: "2rem" }}>
        {stats.map(s => <Stat key={s.label} {...s} />)}
      </div>
      <Card style={{ marginBottom: "2rem", borderLeft: `4px solid ${COLORS.crimson}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <PulsingDot color={COLORS.crimson} />
          <span style={{ fontWeight: 700, color: COLORS.crimson, fontSize: 14 }}>Live Emergency Feed</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: a.type === "emergency" ? COLORS.crimsonBg : a.type === "shortage" ? COLORS.goldBg : "#F4F6F7",
              borderRadius: 12, border: `1px solid ${a.type === "emergency" ? COLORS.crimsonLight : a.type === "shortage" ? "#FAD7A0" : COLORS.border}`,
            }}>
              <BloodGroup group={a.blood} />
              <div style={{ flex: 1 }}>
                {a.patient && <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.navy }}>{a.patient} · </span>}
                <span style={{ fontSize: 13, color: COLORS.slate }}>{a.hospital}</span>
              </div>
              <Badge color={a.type === "emergency" ? "danger" : a.type === "shortage" ? "warning" : "navy"}>{a.type.toUpperCase()}</Badge>
              <span style={{ fontSize: 11, color: COLORS.slateLight }}>{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
      <SectionHeader title="System Modules" subtitle="Click any module to explore" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {modules.map(m => (
          <Card key={m.id} onClick={() => setPage(m.id)} style={{ padding: "1.2rem" }}>
            <div style={{ fontSize: 28, marginBottom: 8, color: COLORS.crimson }}>{m.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 10, lineHeight: 1.5 }}>{m.desc}</div>
            <Badge color="crimson">{m.stat}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PatientsPage() {
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const donorHistory = [
  {
    donor: "Ramesh Yadav",
    blood: "B+",
    date: "12 May 2026",
    hospital: "AIIMS Delhi",
    units: 1
  },
  {
    donor: "Sunita Patel",
    blood: "B+",
    date: "18 April 2026",
    hospital: "AIIMS Delhi",
    units: 1
  },
  {
    donor: "Krishnamurti",
    blood: "B+",
    date: "02 March 2026",
    hospital: "AIIMS Delhi",
    units: 2
  }
];
  const patients = [
    { id: 1, name: "Arjun Mehta", age: 14, blood: "B+", hb: 7.2, freq: "Every 21 days", hospital: "AIIMS Delhi", nextTrans: "June 10", status: "Stable", lang: "Hindi", hbTrend: [8.1, 7.8, 7.4, 7.2], transfusions: 47, lastTrans: "May 20" },
    { id: 2, name: "Fatima Shaikh", age: 9, blood: "O-", hb: 6.8, freq: "Every 14 days", hospital: "Nizam's Institute", nextTrans: "June 8", status: "Critical", lang: "Telugu", hbTrend: [7.2, 6.9, 7.0, 6.8], transfusions: 89, lastTrans: "May 25" },
    { id: 3, name: "Priya Nair", age: 22, blood: "A+", hb: 8.4, freq: "Every 28 days", hospital: "CMC Vellore", nextTrans: "June 18", status: "Stable", lang: "Tamil", hbTrend: [8.0, 8.3, 8.5, 8.4], transfusions: 31, lastTrans: "May 21" },
    { id: 4, name: "Rahul Gupta", age: 7, blood: "AB+", hb: 6.2, freq: "Every 10 days", hospital: "SGPGI Lucknow", nextTrans: "June 7", status: "Emergency", lang: "Hindi", hbTrend: [7.0, 6.8, 6.5, 6.2], transfusions: 112, lastTrans: "May 28" },
  ];
  const p = selected !== null ? patients.find(pt => pt.id === selected) : null;
const handleRequestDonor = () => {
  if (!p) return;

  const request = {
    id: Date.now(),
    patientName: p.name,
    bloodGroup: p.blood,
    hospital: p.hospital,
    urgency: p.status,
    requestedAt: new Date().toLocaleString(),
    status: "Searching Donors"
  };

  const existing =
    JSON.parse(localStorage.getItem("bloodRequests")) || [];

  existing.push(request);

  localStorage.setItem(
    "bloodRequests",
    JSON.stringify(existing)
  );

  setRequests(existing);

  setMessage(
    `✅ AI Coordinator started donor search for ${p.name}`
  );

  setTimeout(() => {
    setMessage("");
  }, 3000);
};
  return (
    <div>
      <SectionHeader title="Patient Digital Twins" subtitle="AI-powered continuous monitoring for every thalassemia patient" />
      <div style={{ display: "grid", gridTemplateColumns: p ? "1fr 1.4fr" : "1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {patients.map(pt => (
            <Card key={pt.id} onClick={() => setSelected(pt.id === selected ? null : pt.id)}
              style={{ padding: "1rem 1.2rem", borderLeft: pt.status === "Emergency" ? `4px solid ${COLORS.danger}` : pt.status === "Critical" ? `4px solid ${COLORS.warning}` : `4px solid ${COLORS.teal}`, background: selected === pt.id ? COLORS.crimsonBg : COLORS.white }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={pt.name} color={pt.status === "Emergency" ? COLORS.danger : COLORS.teal} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy }}>{pt.name}</span>
                    <BloodGroup group={pt.blood} />
                    <Badge color={pt.status === "Emergency" ? "danger" : pt.status === "Critical" ? "warning" : "success"}>{pt.status}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.slate }}>Age {pt.age} · Hb: {pt.hb} g/dL · {pt.hospital}</div>
                  <div style={{ marginTop: 6 }}>
                    <Progress value={(pt.hb / 14) * 100} color={pt.hb < 7 ? COLORS.danger : pt.hb < 8 ? COLORS.warning : COLORS.teal} height={5} />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: COLORS.slate }}>Next Trans.</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.crimson }}>{pt.nextTrans}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {p && (
          <Card style={{ padding: "1.5rem", position: "sticky", top: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <Avatar name={p.name} size={52} color={COLORS.crimson} />
              <div>
                <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 700 }}>{p.name}</h3>
                <div style={{ fontSize: 13, color: COLORS.slate }}>{p.lang} · {p.hospital}</div>
              </div>
              <Badge color={p.status === "Emergency" ? "danger" : p.status === "Critical" ? "warning" : "success"}>{p.status}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
              {[["Blood Group", <BloodGroup group={p.blood} />], ["Hemoglobin", `${p.hb} g/dL`], ["Frequency", p.freq], ["Total Transfusions", p.transfusions], ["Last Transfusion", p.lastTrans], ["Next Scheduled", p.nextTrans]].map(([l, v]) => (
                <div key={l} style={{ background: COLORS.bg, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.slate, marginBottom: 8 }}>Hb TREND (g/dL)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
                {p.hbTrend.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: COLORS.slate }}>{v}</span>
                    <div style={{ width: "100%", height: `${(v / 14) * 70}px`, background: v < 7 ? COLORS.danger : v < 8 ? COLORS.warning : COLORS.teal, borderRadius: "4px 4px 0 0" }} />
                  </div>
                ))}
              </div>
            </div>
            {message && (
  <div
    style={{
      background: "#E8F8F5",
      color: "#117A65",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontWeight: "600",
      border: "1px solid #A2D9CE"
    }}
  >
    {message}
  </div>
)}
            <div style={{ display: "flex", gap: 8 }}>

  <input
    type="text"
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
    placeholder={`Ask in ${selectedLanguage}`}
    style={{
      flex: 1,
      padding: "10px 14px",
      borderRadius: 10,
      border: `1px solid ${COLORS.border}`
    }}
  />

  <Btn
    variant="primary"
    onClick={handleSend}
  >
    Send
  </Btn>

  <button
    onClick={() => setActive(!active)}
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: active ? "#dc2626" : COLORS.crimson,
      color: "#fff",
      border: "none",
      cursor: "pointer"
    }}
  >
    {active ? "■" : "🎤"}
  </button>

</div>
{
showHistory && (
<Card style={{ marginTop: "20px" }}>
  <h3>Past Donation History</h3>

  {donorHistory.map((d, i) => (
    <div
      key={i}
      style={{
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    >
      <strong>{d.donor}</strong>
      <br />
      Blood Group: {d.blood}
      <br />
      Date: {d.date}
      <br />
      Hospital: {d.hospital}
      <br />
      Units: {d.units}
    </div>
  ))}

  <Btn
    variant="ghost"
    onClick={() => setShowHistory(false)}
  >
    Close
  </Btn>

</Card>
)}
  {
showAlertPanel && (
<Card style={{ marginTop: "20px" }}>
  <h3>Emergency Alert Center</h3>

  <p>
    AI will notify all matching donors.
  </p>

  <div style={{ display: "flex", gap: "10px" }}>

    <Btn
      variant="teal"
      onClick={() =>
        alert(
          "WhatsApp alerts sent to nearby donors"
        )
      }
    >
      WhatsApp
    </Btn>

    <Btn
      variant="primary"
      onClick={() =>
        alert(
          "SMS alerts sent to nearby donors"
        )
      }
    >
      SMS
    </Btn>

    <Btn
      variant="navy"
      onClick={() =>
        alert(
          "AI Voice Calls initiated"
        )
      }
    >
      AI Voice Call
    </Btn>

  </div>

  <br />

  <Btn
    variant="ghost"
    onClick={() => setShowAlertPanel(false)}
  >
    Close
  </Btn>
</Card>
)}
          </Card>
        )}
      </div>
    </div>
  );
}

function DonorsPage() {
  const donors = [
  {
    name: "Ramesh Yadav",
    mobile: "9876543210",
    blood: "O+",
    city: "Hyderabad",
    reliability: 94,
    health: 98,
    response: 96,
    distance: 3.2,
    available: true,
    lastDonation: "72 days ago",
    donations: 23,
    streak: 7
  },
  {
    name: "Sunita Patel",
    mobile: "9876543211",
    blood: "B-",
    city: "Secunderabad",
    reliability: 88,
    health: 91,
    response: 84,
    distance: 7.1,
    available: false,
    lastDonation: "45 days ago",
    donations: 15,
    streak: 3
  },
  {
    name: "Krishnamurti",
    mobile: "9876543212",
    blood: "AB+",
    city: "Jubilee Hills",
    reliability: 97,
    health: 99,
    response: 98,
    distance: 5.8,
    available: true,
    lastDonation: "91 days ago",
    donations: 41,
    streak: 12
  }
];
  const finalScore = d => Math.round((d.reliability * 0.35 + d.health * 0.35 + d.response * 0.3));
  return (
    <div>
      <SectionHeader title="Donor Intelligence Engine" subtitle="AI-computed scores for optimal donor selection" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: "2rem" }}>
        {donors.filter(d => d.available).slice(0, 3).map((d, i) => (
          <Card key={d.name} style={{ borderTop: i === 0 ? `3px solid ${COLORS.gold}` : `3px solid ${COLORS.border}` }}>
            {i === 0 && <div style={{ marginBottom: 8 }}><Badge color="gold">Top Match</Badge></div>}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <ScoreRing score={finalScore(d)} size={64} color={finalScore(d) > 90 ? COLORS.teal : finalScore(d) > 80 ? COLORS.gold : COLORS.slate} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy }}>{d.name}</div>
                <BloodGroup group={d.blood} />
                <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 3 }}>{d.city} · {d.distance}km</div>
              </div>
            </div>
            {[["Reliability", d.reliability, COLORS.teal], ["Health", d.health, COLORS.success], ["Response", d.response, COLORS.gold]].map(([l, v, c]) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: COLORS.slate }}>{l}</span><span style={{ fontWeight: 700, color: c }}>{v}</span>
                </div>
                <Progress value={v} color={c} height={5} />
              </div>
            ))}
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <Btn
  size="sm"
  variant="primary"
  onClick={() => {
    alert(
      `AI Contact Center

Donor: ${d.name}
Blood Group: ${d.blood}
Mobile: ${d.mobile}

✓ WhatsApp Alert Sent
✓ SMS Alert Sent
✓ AI Voice Call Initiated`
    );
  }}
>
  Contact
</Btn>
              <Badge color="navy">🔥 {d.streak}-streak</Badge>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: "1rem" }}>All Donors</div>
        <Table
          headers={["Donor", "Blood", "City", "Final Score", "Reliability", "Health", "Response", "Status", "Donations"]}
          rows={donors.map(d => [
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={d.name} size={28} color={COLORS.crimson} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</span>
            </div>,
            <BloodGroup group={d.blood} />,
            d.city,
            <span style={{ fontWeight: 800, color: finalScore(d) > 90 ? COLORS.teal : finalScore(d) > 80 ? COLORS.gold : COLORS.slate }}>{finalScore(d)}</span>,
            <Progress value={d.reliability} color={COLORS.teal} />,
            <Progress value={d.health} color={COLORS.success} />,
            <Progress value={d.response} color={COLORS.gold} />,
            <Badge color={d.available ? "success" : "danger"}>{d.available ? "Available" : "Ineligible"}</Badge>,
            d.donations,
          ])}
        />
      </Card>
    </div>
  );
}

function CoordinatorPage() {

  const [selectedTask, setSelectedTask] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);

  const [tasks] = useState([
    { id: 1, patient: "Rahul Gupta", blood: "AB+", hospital: "SGPGI", urgency: "Emergency", stage: 4, stages: ["Patient Identified", "Donors Selected", "Outreach Sent", "Responses Tracked", "Appointment Booked"], eta: "2 hrs", donors: 3 },
    { id: 2, patient: "Fatima Shaikh", blood: "O-", hospital: "Nizam's", urgency: "Critical", stage: 2, stages: ["Patient Identified", "Donors Selected", "Outreach Sent", "Responses Tracked", "Appointment Booked"], eta: "4 hrs", donors: 1 },
    { id: 3, patient: "Arjun Mehta", blood: "B+", hospital: "AIIMS", urgency: "Scheduled", stage: 1, stages: ["Patient Identified", "Donors Selected", "Outreach Sent", "Responses Tracked", "Appointment Booked"], eta: "48 hrs", donors: 5 },
  ]);
  return (
    <div>
      <SectionHeader title="AI Care Coordinator" subtitle="Autonomous end-to-end blood request management — zero human intervention" action={<Badge color="teal">3 Active Workflows</Badge>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {tasks.map(t => (
          <Card key={t.id} style={{ borderLeft: `4px solid ${t.urgency === "Emergency" ? COLORS.danger : t.urgency === "Critical" ? COLORS.warning : COLORS.teal}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy }}>{t.patient}</span>
                  <BloodGroup group={t.blood} />
                  <Badge color={t.urgency === "Emergency" ? "danger" : t.urgency === "Critical" ? "warning" : "teal"}>{t.urgency}</Badge>
                  <span style={{ fontSize: 12, color: COLORS.slate }}>{t.hospital} · ETA: {t.eta}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: COLORS.slate }}>Donors Responding</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.donors > 2 ? COLORS.teal : t.donors === 1 ? COLORS.warning : COLORS.danger }}>{t.donors}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "0.75rem" }}>
              {t.stages.map((stage, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {i > 0 && <div style={{ flex: 1, height: 3, background: i <= t.stage ? COLORS.teal : "#E5E7E9" }} />}
                    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: i < t.stage ? COLORS.teal : i === t.stage ? COLORS.crimson : "#E5E7E9", color: i <= t.stage ? "#fff" : COLORS.slate, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: i === t.stage ? `2px solid ${COLORS.crimsonDark}` : "none" }}>
                      {i < t.stage ? "✓" : i + 1}
                    </div>
                    {i < t.stages.length - 1 && <div style={{ flex: 1, height: 3, background: i < t.stage ? COLORS.teal : "#E5E7E9" }} />}
                  </div>
                  <span style={{ fontSize: 10, color: i <= t.stage ? COLORS.teal : COLORS.slateLight, marginTop: 4, textAlign: "center", maxWidth: 80 }}>{stage}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>

  <Btn
    size="sm"
    variant="ghost"
    onClick={() => setSelectedTask(t)}
  >
    View Donors
  </Btn>

  <Btn
    size="sm"
    variant="ghost"
    onClick={() => {
      setSelectedTask(t);
      setShowUpdate(true);
    }}
  >
    Send Update
  </Btn>

  {t.stage < 4 && (
    <Btn
      size="sm"
      variant="secondary"
      onClick={() => {
        setSelectedTask(t);
        setShowEscalation(true);
      }}
    >
      Manual Escalate
    </Btn>
  )}

</div>
          </Card>
        ))}
        {
selectedTask && (
<Card style={{ marginTop: "20px" }}>
  <h3>Matched Donors</h3>

  <Table
    headers={[
      "Name",
      "Blood",
      "Distance",
      "Status"
    ]}
    rows={[
      [
        "Ramesh Yadav",
        selectedTask.blood,
        "3.2 km",
        <Badge color="success">Available</Badge>
      ],
      [
        "Sunita Patel",
        selectedTask.blood,
        "5.8 km",
        <Badge color="warning">Pending</Badge>
      ],
      [
        "Krishnamurti",
        selectedTask.blood,
        "8.1 km",
        <Badge color="success">Available</Badge>
      ]
    ]}
  />

  <Btn
    size="sm"
    variant="ghost"
    onClick={() => setSelectedTask(null)}
  >
    Close
  </Btn>
</Card>
)}
{
showUpdate && selectedTask && (
<Card style={{ marginTop: "20px" }}>
  <h3>Patient Update</h3>

  <p>
    Patient: {selectedTask.patient}
  </p>

  <p>
    Blood Group: {selectedTask.blood}
  </p>

  <p>
    Current Stage: {selectedTask.stage}
  </p>

  <div style={{ display: "flex", gap: "10px" }}>

    <Btn
      variant="teal"
      onClick={() =>
        alert(
          "WhatsApp update sent successfully"
        )
      }
    >
      WhatsApp
    </Btn>

    <Btn
      variant="primary"
      onClick={() =>
        alert(
          "SMS update sent successfully"
        )
      }
    >
      SMS
    </Btn>

    <Btn
      variant="navy"
      onClick={() =>
        alert(
          "Voice update initiated"
        )
      }
    >
      Voice Call
    </Btn>

  </div>

  <br />

  <Btn
    variant="ghost"
    onClick={() => setShowUpdate(false)}
  >
    Close
  </Btn>
</Card>
)}
{
showEscalation && selectedTask && (
<Card style={{ marginTop: "20px" }}>
  <h3>Emergency Escalation</h3>

  <p>
    Patient: {selectedTask.patient}
  </p>

  <p>
    Urgency: {selectedTask.urgency}
  </p>

  <div style={{ display: "flex", gap: "10px" }}>

    <Btn
      variant="primary"
      onClick={() =>
        alert(
          "Escalated to Swarm Network"
        )
      }
    >
      Swarm Network
    </Btn>

    <Btn
      variant="danger"
      onClick={() =>
        alert(
          "Escalated to Blood Bank Hub"
        )
      }
    >
      Blood Bank Hub
    </Btn>

    <Btn
      variant="navy"
      onClick={() =>
        alert(
          "State Emergency Network Activated"
        )
      }
    >
      Emergency Network
    </Btn>

  </div>

  <br />

  <Btn
    variant="ghost"
    onClick={() => setShowEscalation(false)}
  >
    Close
  </Btn>
</Card>
)}
      </div>
    </div>
  );
}

function BloodBankPage() {
  const banks = [
    { name: "AIIMS Blood Centre", city: "Delhi", distance: 0, stocks: { "O+": 85, "O-": 12, "A+": 60, "A-": 20, "B+": 45, "B-": 8, "AB+": 30, "AB-": 5 } },
    { name: "Nizam's Blood Bank", city: "Hyderabad", distance: 4.2, stocks: { "O+": 70, "O-": 5, "A+": 55, "A-": 15, "B+": 38, "B-": 0, "AB+": 22, "AB-": 3 } },
    { name: "City Blood Services", city: "Secunderabad", distance: 7.8, stocks: { "O+": 95, "O-": 18, "A+": 80, "A-": 25, "B+": 62, "B-": 14, "AB+": 40, "AB-": 8 } },
  ];
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const getColor = (v) => v === 0 ? COLORS.danger : v < 10 ? COLORS.warning : v < 30 ? COLORS.gold : COLORS.teal;
  return (
    <div>
      <SectionHeader title="Blood Bank Intelligence Hub" subtitle="Real-time inventory tracking and shortage prediction across all partner banks" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "2rem" }}>
        {[["Banks Connected", "47"], ["Critical Shortages", "3"], ["Predicted Shortages", "8"], ["Last Sync", "2 min ago"]].map(([l, v]) => (
          <div key={l} style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "1rem 1.2rem" }}>
            <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy }}>{v}</div>
          </div>
        ))}
      </div>
      {banks.map(bank => (
        <Card key={bank.name} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy }}>{bank.name}</div>
              <div style={{ fontSize: 12, color: COLORS.slate }}>{bank.city} {bank.distance > 0 ? `· ${bank.distance}km away` : ""}</div>
            </div>
            <PulsingDot color={COLORS.teal} size={8} />
            <span style={{ fontSize: 11, color: COLORS.teal, fontWeight: 600 }}>Live</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
            {bloodTypes.map(bt => {
              const units = bank.stocks[bt];
              const c = getColor(units);
              return (
                <div key={bt} style={{ textAlign: "center", padding: "10px 4px", background: c + "12", borderRadius: 10, border: `1px solid ${c}30` }}>
                  <BloodGroup group={bt} />
                  <div style={{ fontSize: 18, fontWeight: 800, color: c, marginTop: 6 }}>{units}</div>
                  <div style={{ fontSize: 9, color: COLORS.slate }}>units</div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
      <Card style={{ borderLeft: `4px solid ${COLORS.warning}`, background: COLORS.goldBg }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 700, color: "#7D6608", marginBottom: 4 }}>AI Shortage Prediction</div>
            <div style={{ fontSize: 13, color: COLORS.slate }}>Based on upcoming patient schedules and current donation rates, Hyderabad region may face an <strong>O- shortage</strong> within 5–7 days. Recommend initiating donor outreach immediately.</div>
            <div style={{ marginTop: 10 }}><Btn size="sm" variant="primary">Trigger Proactive Campaign</Btn></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SwarmPage() {
  const [selectedLevel, setSelectedLevel] = useState(2);

const [stats, setStats] = useState({
  contacted: 34,
  responded: 12,
  confirmed: 3
});
  const [activeLevel, setActiveLevel] = useState(2);
  const levels = [
    { level: 1, label: "Nearby Donors", count: 48, radius: "0–5km", icon: "♦", color: COLORS.teal },
    { level: 2, label: "Nearby Volunteers", count: 127, radius: "5–15km", icon: "◎", color: COLORS.gold },
    { level: 3, label: "Partner NGOs", count: 23, radius: "City-wide", icon: "◈", color: "#7D3C98" },
    { level: 4, label: "Nearby Blood Banks", count: 12, radius: "Regional", icon: "▣", color: COLORS.crimson },
    { level: 5, label: "State Emergency Network", count: 5, radius: "State-wide", icon: "⬡", color: COLORS.navy },
  ];
  const active = levels.find(l => l.level === activeLevel);
  useEffect(() => {
  generateStats(activeLevel);
}, []);
  const generateStats = (level) => {

  let contacted;
  let responded;
  let confirmed;

  switch(level) {

    case 1:
      contacted = Math.floor(Math.random() * 40) + 20;
      break;

    case 2:
      contacted = Math.floor(Math.random() * 120) + 50;
      break;

    case 3:
      contacted = Math.floor(Math.random() * 250) + 100;
      break;

    case 4:
      contacted = Math.floor(Math.random() * 400) + 200;
      break;

    default:
      contacted = Math.floor(Math.random() * 600) + 300;
  }

  responded = Math.floor(contacted * (0.2 + Math.random() * 0.3));

  confirmed = Math.floor(
    responded * (0.2 + Math.random() * 0.4)
  );

  setStats({
    contacted,
    responded,
    confirmed
  });

  setSelectedLevel(level);
};
  return (
    <div>
      <SectionHeader title="Swarm Intelligence Network" subtitle="5-tier auto-escalating emergency response system" action={<Badge color="danger">1 Active Swarm</Badge>} />
      <Card style={{ marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}><Badge color="danger">EMERGENCY ACTIVE: O- · AIIMS Hyderabad</Badge></div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {levels.map(l => (
            <div key={l.level} onClick={() => {
  setActiveLevel(l.level);
  generateStats(l.level);
}} style={{ width: `${40 + l.level * 12}%`, padding: "12px 24px", background: activeLevel === l.level ? l.color : l.color + "15", border: `2px solid ${l.color}40`, borderRadius: 12, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18, color: activeLevel === l.level ? "#fff" : l.color }}>{l.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: activeLevel === l.level ? "#fff" : COLORS.navy }}>Level {l.level}: {l.label}</div>
                  <div style={{ fontSize: 11, color: activeLevel === l.level ? "rgba(255,255,255,0.7)" : COLORS.slate }}>{l.radius}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: activeLevel === l.level ? "#fff" : l.color }}>{l.count}</div>
                <div style={{ fontSize: 10, color: activeLevel === l.level ? "rgba(255,255,255,0.7)" : COLORS.slate }}>resources</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {active && (
        <Card style={{ borderLeft: `4px solid ${active.color}` }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: "1rem" }}>Level {active.level}: {active.label} — {active.count} resources available</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
  ["Contacted", stats.contacted],
  ["Responded", stats.responded],
  ["Confirmed", stats.confirmed]
].map(([l, v]) => (
              <div key={l} style={{ background: COLORS.bg, borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: active.color }}>{v}</div>
                <div style={{ fontSize: 12, color: COLORS.slate }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
            <Btn
  size="sm"
  variant="primary"
  onClick={() => {

    const nextLevel =
      Math.min(active.level + 1, 5);

    setActiveLevel(nextLevel);

    generateStats(nextLevel);

    alert(
      `Emergency escalated to Level ${nextLevel}`
    );

  }}
>
  Escalate to Level {Math.min(active.level + 1, 5)}
</Btn>
            <Btn
  size="sm"
  variant="ghost"
  onClick={() => {

    alert(
      `${stats.contacted} emergency notifications sent successfully`
    );

  }}
>
  Send Bulk Message
</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { key: "lastDonation", q: "When was your last blood donation?", opts: ["Never donated", "Less than 90 days ago", "90–120 days ago", "More than 120 days ago"] },
    { key: "weight", q: "Is your weight above 50 kg?", opts: ["Yes", "No"] },
    { key: "fever", q: "Have you had fever in the last 7 days?", opts: ["Yes", "No"] },
    { key: "medication", q: "Are you currently on any medication?", opts: ["No", "Paracetamol / OTC", "Antibiotics", "Blood thinners / Chronic meds"] },
    { key: "pregnancy", q: "Are you currently pregnant or breastfeeding?", opts: ["Yes", "No"] },
  ];
  const q = questions[step];
  const done = step >= questions.length;
  const getResult = () => {
    if (answers.pregnancy === "Yes") return { eligible: false, reason: "Pregnancy — not eligible to donate." };
    if (answers.weight === "No") return { eligible: false, reason: "Weight below 50kg — not eligible." };
    if (answers.lastDonation === "Less than 90 days ago") return { eligible: false, reason: "Minimum 90-day gap required between donations." };
    if (answers.fever === "Yes") return { eligible: false, reason: "Recent fever — deferred for 7 days after recovery." };
    if (answers.medication === "Blood thinners / Chronic meds") return { eligible: false, reason: "Current medication conflicts with donation." };
    if (answers.medication === "Antibiotics") return { eligible: "defer", reason: "On antibiotics — eligible again 14 days after completion." };
    return { eligible: true, reason: "All checks passed. Donor is eligible to donate!" };
  };
  return (
    <div>
      <SectionHeader title="AI Health Eligibility Engine" subtitle="Pre-donation screening to ensure donor safety and optimal matches" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: "1.5rem" }}>Pre-Donation Screening</div>
          {!done ? (
            <>
              <div style={{ marginBottom: "0.5rem", fontSize: 12, color: COLORS.slate }}>Question {step + 1} of {questions.length}</div>
              <Progress value={(step / questions.length) * 100} color={COLORS.teal} />
              <div style={{ margin: "1.5rem 0", fontSize: 16, fontWeight: 600, color: COLORS.navy, lineHeight: 1.4 }}>{q.q}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.opts.map(opt => (
                  <button key={opt} onClick={() => { setAnswers(a => ({ ...a, [q.key]: opt })); setStep(s => s + 1); }}
                    style={{ padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.white, textAlign: "left", cursor: "pointer", fontSize: 14, color: COLORS.navyMid, fontWeight: 500, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.teal; e.currentTarget.style.background = COLORS.tealBg; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.white; }}
                  >{opt}</button>
                ))}
              </div>
            </>
          ) : (() => {
            const r = getResult();
            return (
              <div>
                <div style={{ background: r.eligible === true ? COLORS.tealBg : r.eligible === "defer" ? COLORS.goldBg : COLORS.crimsonBg, borderRadius: 14, padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>{r.eligible === true ? "✅" : r.eligible === "defer" ? "⏳" : "❌"}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: r.eligible === true ? COLORS.teal : r.eligible === "defer" ? COLORS.warning : COLORS.danger }}>{r.eligible === true ? "Eligible to Donate" : r.eligible === "defer" ? "Temporarily Deferred" : "Not Eligible"}</div>
                  <div style={{ fontSize: 13, color: COLORS.slate, marginTop: 6 }}>{r.reason}</div>
                </div>
                <Btn onClick={() => { setStep(0); setAnswers({}); }} variant="secondary">Start Over</Btn>
              </div>
            );
          })()}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: "1rem" }}>Eligibility Criteria</div>
            {[["Age", "18–65 years", "success"], ["Weight", "Minimum 50 kg", "success"], ["Hemoglobin", "Male: 13+ / Female: 12.5+ g/dL", "success"], ["Donation Gap", "Male: 90 days / Female: 120 days", "navy"], ["Pregnancy", "Not pregnant or breastfeeding", "danger"], ["Medications", "No blood thinners or chronic meds", "warning"], ["Recent Illness", "No fever in last 7 days", "warning"]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 13, color: COLORS.slate }}>{l}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navyMid }}>{v}</span>
                  <Badge color={c}>•</Badge>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: "1rem" }}>Donation Readiness Score™</div>
            {[{ name: "Ramesh Yadav", score: 94, blood: "O+" }, { name: "Krishnamurti", score: 91, blood: "AB+" }, { name: "Aisha Begum", score: 72, blood: "A-" }].map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Avatar name={d.name} size={36} color={COLORS.teal} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{d.name}</div>
                  <BloodGroup group={d.blood} />
                </div>
                <ScoreRing score={d.score} size={52} color={d.score > 90 ? COLORS.teal : d.score > 75 ? COLORS.gold : COLORS.danger} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function LearningPage() {
  const signals = [
    { campaign: "O- Emergency · June 3", sent: 20, responded: 4, rate: 20, topInsight: "Morning messages (8–10am) got 3× better response than evening.", improvements: ["Switch to morning outreach", "Use Telugu language for HYD donors", "Voice calls > SMS by 2.4×"] },
    { campaign: "B+ Scheduled · May 28", sent: 15, responded: 11, rate: 73, topInsight: "Donors who received personalized impact messages responded 40% faster.", improvements: ["Personalize every outreach message", "Include patient story snippet", "Add impact stat from previous donation"] },
    { campaign: "A- Critical · May 22", sent: 30, responded: 7, rate: 23, topInsight: "Weekend donors respond better on Saturday 10am–12pm window.", improvements: ["Schedule campaigns around donor availability patterns", "Avoid Sunday evenings", "Tier-2 volunteers responded faster than tier-1 donors"] },
  ];
  return (
    <div>
      <SectionHeader title="AI Failure Learning Engine" subtitle="Self-improving system — learns from every donation outcome to optimize future campaigns" action={<Badge color="teal">4,200 signals today</Badge>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: "2rem" }}>
        {[["Total Campaigns Analyzed", "1,247", COLORS.navy], ["Avg. Response Rate", "61.4%", COLORS.teal], ["Improvement This Month", "+18.3%", COLORS.success]].map(([l, v, c]) => (
          <Stat key={l} label={l} value={v} color={c} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {signals.map((s, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy }}>{s.campaign}</div>
                <div style={{ fontSize: 12, color: COLORS.slate }}>Sent: {s.sent} · Responded: {s.responded}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.rate > 60 ? COLORS.teal : s.rate > 40 ? COLORS.gold : COLORS.danger }}>{s.rate}%</div>
                <div style={{ fontSize: 11, color: COLORS.slate }}>Response Rate</div>
              </div>
            </div>
            <Progress value={s.rate} color={s.rate > 60 ? COLORS.teal : s.rate > 40 ? COLORS.gold : COLORS.danger} />
            <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px", margin: "1rem 0" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.slate, marginBottom: 4 }}>KEY INSIGHT</div>
              <div style={{ fontSize: 13, color: COLORS.navyMid }}>{s.topInsight}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.teal, marginBottom: 6 }}>AI IMPROVEMENTS APPLIED →</div>
              {s.improvements.map((imp, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.navyMid, marginBottom: 4 }}>
                  <span style={{ color: COLORS.teal, fontWeight: 700 }}>✓</span> {imp}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EngagementPage() {
  const donors = [
    { name: "Krishnamurti", streak: 12, lives: 41, impact: ["2 children", "1 thalassemia patient", "3 surgeries"], nextEligible: "Tomorrow", badge: "Platinum Hero" },
    { name: "Ramesh Yadav", streak: 7, lives: 23, impact: ["1 child", "2 accident victims"], nextEligible: "In 18 days", badge: "Gold Donor" },
    { name: "Suresh Reddy", streak: 9, lives: 34, impact: ["4 thalassemia patients"], nextEligible: "In 3 days", badge: "Gold Donor" },
  ];
  return (
    <div>
      <SectionHeader title="Donor Engagement Engine" subtitle="Personalized impact tracking and smart retention strategies" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: "2rem" }}>
        {donors.map(d => (
          <Card key={d.name} style={{ textAlign: "center" }}>
            <Avatar name={d.name} size={56} color={COLORS.gold} />
            <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16, color: COLORS.navy }}>{d.name}</div>
            <Badge color="gold">{d.badge}</Badge>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "16px 0" }}>
              {Array.from({ length: Math.min(d.streak, 12) }).map((_, i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: i < d.streak ? COLORS.gold : "#F2F3F4", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i < d.streak ? "🔥" : "·"}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: "1rem" }}>🔥 {d.streak}-donation streak</div>
            <div style={{ background: COLORS.bg, borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.crimson }}>{d.lives}</div>
              <div style={{ fontSize: 12, color: COLORS.slate }}>lives impacted</div>
              <div style={{ marginTop: 8 }}>{d.impact.map((imp, i) => <div key={i} style={{ fontSize: 11, color: COLORS.navyMid }}>• {imp}</div>)}</div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 10 }}>Next eligible: <strong style={{ color: COLORS.teal }}>{d.nextEligible}</strong></div>
            <Btn size="sm" variant="teal">Send Appreciation</Btn>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: "1rem" }}>Upcoming Smart Reminders</div>
        <Table
          headers={["Donor", "Blood", "Eligible On", "Message Type", "Channel", "Status"]}
          rows={[
            ["Ramesh Yadav", <BloodGroup group="O+" />, "June 12", "Re-eligibility nudge", "WhatsApp", <Badge color="teal">Scheduled</Badge>],
            ["Aisha Begum", <BloodGroup group="A-" />, "June 9", "Impact report", "SMS + App", <Badge color="teal">Scheduled</Badge>],
            ["Sunita Patel", <BloodGroup group="B-" />, "June 25", "Streak recovery", "Voice AI", <Badge color="navy">Queued</Badge>],
            ["Krishnamurti", <BloodGroup group="AB+" />, "Tomorrow", "Emergency alert", "All channels", <Badge color="danger">Priority</Badge>],
          ]}
        />
      </Card>
    </div>
  );
}

function VoicePage() {
const [selectedLanguage, setSelectedLanguage] = useState("English");
const [userInput, setUserInput] = useState("");

const languages = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada"
];

const [chat, setChat] = useState([
  {
    role: "ai",
    text:
      "Hello! I am AI Predictive Blood Crisis Prevention Assistant. How can I help you today?"
  }
]);

const [active, setActive] = useState(false);
const speak = (text) => {

  const utterance =
    new SpeechSynthesisUtterance(text);

  if (selectedLanguage === "Telugu") {
    utterance.lang = "te-IN";
  }
  else if (selectedLanguage === "Hindi") {
    utterance.lang = "hi-IN";
  }
  else if (selectedLanguage === "Tamil") {
    utterance.lang = "ta-IN";
  }
  else if (selectedLanguage === "Kannada") {
    utterance.lang = "kn-IN";
  }
  else {
    utterance.lang = "en-US";
  }

  speechSynthesis.speak(utterance);
};

const handleSend = async () => {

  if (!userInput.trim()) return;

  const message = userInput;

  setChat(prev => [
    ...prev,
    {
      role: "user",
      text: message
    }
  ]);

  setUserInput("");

  try {

    const aiResponse =
      await askAI(
        message,
        selectedLanguage
      );

    setChat(prev => [
      ...prev,
      {
        role: "ai",
        text: aiResponse
      }
    ]);

    speak(aiResponse);

  } catch (error) {

    setChat(prev => [
      ...prev,
      {
        role: "ai",
        text:
          "Unable to connect to AI service."
      }
    ]);
  }
};
  return (
    <div>
      <SectionHeader title="Multilingual Voice AI" subtitle="Conversational blood care assistant with persistent memory across all languages" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ display: "flex", flexDirection: "column", minHeight: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.crimsonBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>◐</div>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.navy }}>AI Predictive Blood</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.teal }}><PulsingDot color={COLORS.teal} size={8} /> Online</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", marginBottom: "1rem", maxHeight: 300 }}>
            {chat.map((msg, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent:
        msg.role === "user"
          ? "flex-end"
          : "flex-start"
    }}
  >
    <div
      style={{
        maxWidth: "80%",
        padding: "10px 14px",
        borderRadius:
          msg.role === "user"
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
        background:
          msg.role === "user"
            ? COLORS.crimson
            : COLORS.bg,
        color:
          msg.role === "user"
            ? "#fff"
            : COLORS.navyMid,
        fontSize: 13
      }}
    >
      {msg.text}
    </div>
  </div>
))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>

  <input
    type="text"
    value={userInput}
    onChange={(e) =>
      setUserInput(e.target.value)
    }
    placeholder={`Ask in ${selectedLanguage}`}
    style={{
      flex: 1,
      padding: "10px 14px",
      borderRadius: 10,
      border: `1.5px solid ${COLORS.border}`,
      fontSize: 13
    }}
  />

  <Btn
    variant="primary"
    onClick={handleSend}
  >
    Send
  </Btn>

  <button
    onClick={() => setActive(!active)}
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: active
        ? COLORS.danger
        : COLORS.crimson,
      border: "none",
      cursor: "pointer",
      color: "#fff",
      fontSize: 18
    }}
  >
    {active ? "■" : "🎤"}
  </button>

</div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: "1rem" }}>Supported Languages</div>
            <select
  value={selectedLanguage}
  onChange={(e) => setSelectedLanguage(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: `1px solid ${COLORS.border}`
  }}
>
  {languages.map(lang => (
    <option key={lang} value={lang}>
      {lang}
    </option>
  ))}
</select>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{languages.map(l => <Badge key={l} color="navy" size="md">{l}</Badge>)}</div>
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: "1rem" }}>AI Memory Context</div>
            {[["Patient Profile", "Arjun Mehta · B+ · AIIMS Delhi"], ["Last Interaction", "3 days ago · Donation scheduled"], ["Preferred Language", "Hindi"], ["Emergency History", "2 urgent requests in 2024"], ["Family Contact", "Mother: Sunita Mehta"]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: COLORS.slate }}>{l}</span>
                <span style={{ fontWeight: 600, color: COLORS.navyMid, textAlign: "right", maxWidth: "55%" }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: "0.75rem" }}>Channel Availability</div>
            {[["WhatsApp", COLORS.teal, "Active"], ["SMS", COLORS.gold, "Active"], ["Voice Call", COLORS.crimson, "Active"], ["Web App", COLORS.navy, "Active"]].map(([c, col, s]) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <PulsingDot color={col} size={8} />
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navyMid, flex: 1 }}>{c}</span>
                <Badge color="success">{s}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🩸</div>
      <h2 style={{ color: COLORS.navy }}>{title}</h2>
      <p style={{ color: COLORS.slate }}>This module is fully integrated in the complete system.</p>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageMap = {
    dashboard: <Dashboard setPage={setPage} />,
    patients: <PatientsPage />,
    donors: <DonorsPage />,
    coordinator: <CoordinatorPage />,
    bloodbank: <BloodBankPage />,
    swarm: <SwarmPage />,
    eligibility: <EligibilityPage />,
    learning: <LearningPage />,
    engagement: <EngagementPage />,
    voice: <VoicePage />,
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #BDC3C7; border-radius: 4px; }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.8);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{ width: sidebarOpen ? 240 : 64, background: COLORS.navy, color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.3s ease", overflow: "hidden", boxShadow: "4px 0 20px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "1.5rem 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.crimson, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🩸</div>
            {sidebarOpen && <div><div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1 }}>AI Predictive Blood Crisis Precaution System
</div><div style={{ fontSize: 10, opacity: 0.5, fontWeight: 500 }}>Nexus AI</div></div>}
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", border: "none", cursor: "pointer", background: active ? `${COLORS.crimson}30` : "transparent", borderLeft: active ? `3px solid ${COLORS.crimson}` : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,0.55)", transition: "all 0.15s", fontSize: 14, fontWeight: active ? 700 : 400, textAlign: "left" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
                {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: 0.5 }}>SYSTEM STATUS</div>
            {[["AI Agents", "All Active"], ["Coverage", "28 States"], ["Uptime", "99.97%"]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>
                <span>{l}</span><span style={{ color: COLORS.teal, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 2rem", height: 64, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy }}>{NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PulsingDot color={COLORS.teal} size={8} />
            <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600 }}>All Systems Operational</span>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.crimsonBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>👤</div>
          </div>
        </div>
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", animation: "fadeIn 0.3s ease" }}>
          {pageMap[page] || <PlaceholderPage title={NAV_ITEMS.find(n => n.id === page)?.label} />}
        </main>
      </div>
    </div>
  );
}


