import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect, type ReactNode, Fragment } from "react";
import {
  LayoutDashboard, ClipboardList, Users, Calendar, BarChart3, Settings,
  LogOut, Stethoscope, Search, Sun, Moon, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Plus, ChevronLeft, ChevronRight, Download, Filter,
  Phone, Mail, CalendarDays, Shield, MessageSquare, X, Save, Lock, Building2,
  BellIcon,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  CONSULTATIONS, PATIENTS, APPOINTMENTS, CONSULTATIONS_30D, SERVICES_BREAKDOWN,
  MONTHLY_CONSULTS, INSURANCE_BREAKDOWN,
  type Status, type Consultation,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({ component: AdminPanel });

type Tab = "dashboard" | "consultations" | "patients" | "appointments" | "analytics" | "settings";

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  new:       { label: "New",       cls: "bg-blue-50 text-blue-700 border-blue-200" },
  contacted: { label: "Contacted", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  booked:    { label: "Booked",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
};

const CHART_COLORS = [
  "oklch(0.58 0.18 255)", "oklch(0.7 0.16 220)", "oklch(0.65 0.16 155)",
  "oklch(0.78 0.15 75)", "oklch(0.6 0.22 25)", "oklch(0.5 0.2 290)",
];

const NAV: { tab: Tab; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { tab: "dashboard",     label: "Dashboard",     Icon: LayoutDashboard },
  { tab: "consultations", label: "Consultations", Icon: ClipboardList },
  { tab: "patients",      label: "Patients",      Icon: Users },
  { tab: "appointments",  label: "Appointments",  Icon: Calendar },
  { tab: "analytics",     label: "Analytics",     Icon: BarChart3 },
  { tab: "settings",      label: "Settings",      Icon: Settings },
];

const TITLES: Record<Tab, string> = {
  dashboard: "Dashboard", consultations: "Consultations", patients: "Patients",
  appointments: "Appointments", analytics: "Analytics", settings: "Settings",
};

/* ── Root ── */
function AdminPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jd-admin-theme");
    setDark(stored !== "light");
  }, []);

  const toggleTheme = () => setDark(d => {
    localStorage.setItem("jd-admin-theme", d ? "light" : "dark");
    return !d;
  });

  const v = dark ? {
    bg: "oklch(0.13 0.03 250)", fg: "oklch(0.95 0.01 240)", card: "oklch(0.17 0.035 250)",
    sidebar: "oklch(0.11 0.03 250)", sidebarFg: "oklch(0.9 0.015 240)", sidebarBorder: "oklch(0.2 0.04 250)",
    sidebarAccent: "oklch(0.2 0.05 255)", sidebarAccentFg: "oklch(0.7 0.16 220)",
    border: "oklch(0.25 0.04 250)", secondary: "oklch(0.2 0.04 250)", muted: "oklch(0.6 0.04 245)",
    primary: "oklch(0.65 0.18 255)", accent: "oklch(0.7 0.16 220)",
  } : {
    bg: "#FAFAFA", fg: "oklch(0.16 0.04 250)", card: "#FFFFFF",
    sidebar: "#F8F8FA", sidebarFg: "oklch(0.2 0.05 250)", sidebarBorder: "oklch(0.92 0.02 235)",
    sidebarAccent: "oklch(0.95 0.035 230)", sidebarAccentFg: "oklch(0.58 0.18 255)",
    border: "oklch(0.9 0.025 235)", secondary: "oklch(0.96 0.02 235)", muted: "oklch(0.5 0.05 250)",
    primary: "oklch(0.58 0.18 255)", accent: "oklch(0.7 0.16 220)",
  };

  const css = {
    root: { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif", background: v.bg, color: v.fg, minHeight: "100vh", display: "flex" },
    sidebar: { width: 260, background: v.sidebar, borderRight: `1px solid ${v.sidebarBorder}`, display: "flex" as const, flexDirection: "column" as const, height: "100vh", position: "sticky" as const, top: 0 },
    card: { background: v.card, border: `1px solid ${v.border}`, borderRadius: 16 },
    secondary: { background: v.secondary },
    muted: { color: v.muted },
    primary: { color: v.primary },
    border: { borderColor: v.border },
    topbar: { background: `${v.bg}cc`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${v.border}`, height: 56, position: "sticky" as const, top: 0, zIndex: 30, display: "flex", alignItems: "center", padding: "0 24px", gap: 16 },
    gradBtn: { background: `linear-gradient(135deg, ${v.primary}, ${v.accent})`, color: "#fff", fontWeight: 600 },
    navActive: { background: v.sidebarAccent, color: v.sidebarAccentFg },
    navInactive: { color: v.sidebarFg, opacity: 0.8 },
  };

  return (
    <div style={css.root}>
      {/* Sidebar desktop */}
      <aside style={css.sidebar} className="hidden md:flex flex-col">
        <div style={{ padding: "20px 20px", borderBottom: `1px solid ${v.sidebarBorder}` }}>
          <button onClick={() => setTab("dashboard")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
            <div style={{ ...css.gradBtn, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 14, color: v.sidebarFg, lineHeight: 1.2 }}>Jackson Dental</div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: v.muted }}>Admin Portal</div>
            </div>
          </button>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: v.muted, padding: "0 12px", marginBottom: 8 }}>Workspace</div>
          {NAV.map(({ tab: t, label, Icon }) => {
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, fontSize: 14, fontWeight: 500, transition: "all 0.2s", ...(active ? css.navActive : css.navInactive) }}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.accent }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: `1px solid ${v.sidebarBorder}`, padding: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8 }}>
            <div style={{ ...css.gradBtn, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>GJ</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: v.sidebarFg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Dr. Jackson</div>
              <div style={{ fontSize: 11, color: v.muted }}>Superadmin</div>
            </div>
            <a href="/" title="Back to site" style={{ padding: 6, borderRadius: 6, color: v.muted, textDecoration: "none" }}>
              <LogOut className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* TopBar */}
        <header style={css.topbar}>
          <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: v.muted }}>
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 17, color: v.fg }}>{TITLES[tab]}</div>
            <div style={{ fontSize: 11, color: v.muted }}>Jackson Dental · Tampa, FL</div>
          </div>
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: v.secondary, border: `1px solid ${v.border}` }}>
            <Search className="w-4 h-4" style={{ color: v.muted }} />
            <input placeholder="Search…" style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: v.fg, width: 180 }} />
          </div>
          <button onClick={toggleTheme} style={{ padding: 10, borderRadius: 10, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button style={{ position: "relative", padding: 10, borderRadius: 10, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}>
            <BellIcon className="w-4 h-4" />
            <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: v.accent, outline: `2px solid ${v.bg}` }} />
          </button>
          <div style={{ ...css.gradBtn, width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>GJ</div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto", background: v.bg }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {tab === "dashboard"     && <DashboardPage v={v} css={css} setTab={setTab} />}
              {tab === "consultations" && <ConsultationsPage v={v} css={css} />}
              {tab === "patients"      && <PatientsPage v={v} css={css} />}
              {tab === "appointments"  && <AppointmentsPage v={v} css={css} />}
              {tab === "analytics"     && <AnalyticsPage v={v} css={css} />}
              {tab === "settings"      && <SettingsPage v={v} css={css} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex" }} onClick={() => setMobileOpen(false)}>
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ ...css.sidebar, width: 260, height: "100%", position: "static" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${v.sidebarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, color: v.sidebarFg }}>Jackson Dental</span>
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: v.muted }}><X className="w-5 h-5" /></button>
              </div>
              <nav style={{ flex: 1, padding: "16px 12px" }}>
                {NAV.map(({ tab: t, label, Icon }) => (
                  <button key={t} onClick={() => { setTab(t); setMobileOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, fontSize: 14, fontWeight: 500, ...(tab === t ? css.navActive : css.navInactive) }}>
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Shared types ── */
type Colors = ReturnType<typeof getColors>;
function getColors(dark: boolean) { return dark ? { bg: "" } : { bg: "" }; } // unused, just for type compat

type Vars = { bg: string; fg: string; card: string; sidebar: string; sidebarFg: string; sidebarBorder: string; sidebarAccent: string; sidebarAccentFg: string; border: string; secondary: string; muted: string; primary: string; accent: string };
type Css = { card: React.CSSProperties; secondary: React.CSSProperties; muted: React.CSSProperties; primary: React.CSSProperties; border: React.CSSProperties; gradBtn: React.CSSProperties; [k: string]: React.CSSProperties };

/* ── Card ── */
function Card({ v, css, children, className = "" }: { v: Vars; css: Css; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ ...css.card, borderRadius: 16 }}>
      {children}
    </div>
  );
}

/* ── KPI ── */
function KPI({ v, css, Icon, label, value, delta, up, sub }: { v: Vars; css: Css; Icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; up: boolean; sub: string }) {
  return (
    <Card v={v} css={css}>
      <div style={{ padding: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${up ? "oklch(0.65 0.16 155 / 0.10)" : "oklch(0.6 0.22 25 / 0.07)"}, transparent)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary, display: "flex", alignItems: "center", justifyContent: "center", color: v.primary }}>
            <Icon className="w-4 h-4" />
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, padding: "4px 8px", borderRadius: 999, border: "1px solid", ...(up ? { background: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" } : { background: "#fef2f2", color: "#991b1b", borderColor: "#fecaca" }) }}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{delta}
          </span>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Syne', ui-sans-serif", fontSize: 28, fontWeight: 700, color: v.fg }}>{value}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: v.muted }}>{label} · {sub}</div>
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function DashboardPage({ v, css, setTab }: { v: Vars; css: Css; setTab: (t: Tab) => void }) {
  const recent = useMemo(() => [...CONSULTATIONS].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 8), []);
  const newCount = CONSULTATIONS.filter(c => c.status === "new").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: v.muted }}>Welcome back</div>
          <h2 style={{ fontFamily: "'Syne', ui-sans-serif", fontSize: 24, fontWeight: 700, color: v.fg, margin: "4px 0 4px" }}>Good morning, Dr. Jackson</h2>
          <p style={{ fontSize: 13, color: v.muted }}>Here&apos;s what&apos;s happening at your Tampa practice today.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 16px", fontSize: 13, borderRadius: 10, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}>Export</button>
          <button onClick={() => setTab("consultations")} style={{ ...css.gradBtn, padding: "8px 16px", fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 16px oklch(0.58 0.18 255 / 0.25)" }}>
            View consultations
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI v={v} css={css} Icon={ClipboardList} label="New Consultations" value={String(newCount)} delta="+18%" up sub="Today" />
        <KPI v={v} css={css} Icon={Calendar}      label="Appointments"      value="23"              delta="+6%"  up sub="This week" />
        <KPI v={v} css={css} Icon={Users}         label="Total Patients"    value="12,000+"         delta="+24"  up sub="All-time" />
        <KPI v={v} css={css} Icon={BarChart3}     label="Monthly Growth"    value="+12%"            delta="-1.2%" up={false} sub="vs last month" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card v={v} css={css} className="lg:col-span-3">
          <div style={{ padding: "20px 20px 0", borderBottom: `1px solid ${v.border}`, paddingBottom: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 15, color: v.fg }}>Consultation Requests</div>
              <div style={{ fontSize: 12, color: v.muted, marginTop: 2 }}>Last 30 days</div>
            </div>
            <div style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: `color-mix(in oklab, ${v.primary} 10%, transparent)`, color: v.primary, border: `1px solid color-mix(in oklab, ${v.primary} 20%, transparent)` }}>↑ 18.4%</div>
          </div>
          <div style={{ padding: "16px 20px 20px", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSULTATIONS_30D} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="jdg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={v.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={v.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={v.border} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: v.muted }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: v.muted }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: v.card, border: `1px solid ${v.border}`, borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke={v.primary} strokeWidth={2.5} fill="url(#jdg1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card v={v} css={css} className="lg:col-span-2">
          <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${v.border}` }}>
            <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 15, color: v.fg }}>Top Services</div>
            <div style={{ fontSize: 12, color: v.muted, marginTop: 2 }}>By request volume</div>
          </div>
          <div style={{ padding: "16px 20px 20px", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SERVICES_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {SERVICES_BREAKDOWN.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} stroke={v.card} strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={{ background: v.card, border: `1px solid ${v.border}`, borderRadius: 12, fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent table */}
      <Card v={v} css={css}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 15, color: v.fg }}>Recent Consultations</div>
            <div style={{ fontSize: 12, color: v.muted, marginTop: 2 }}>Latest 8 from your landing form</div>
          </div>
          <button onClick={() => setTab("consultations")} style={{ fontSize: 12, fontWeight: 500, color: v.accent, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `color-mix(in oklab, ${v.secondary} 80%, transparent)` }}>
                {["Patient", "Service", "Date", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, color: v.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(c => (
                <tr key={c.id} style={{ borderTop: `1px solid ${v.border}` }}>
                  <td style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ ...css.gradBtn, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                        {c.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: v.fg }}>{c.full_name}</div>
                        <div style={{ fontSize: 12, color: v.muted }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", color: v.muted }}>{c.service_requested}</td>
                  <td style={{ padding: "12px 20px", color: v.muted }}>{c.preferred_date}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className={`inline-flex text-[11px] px-2.5 py-1 rounded-full border ${STATUS_META[c.status].cls}`}>
                      {STATUS_META[c.status].label}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right" }}>
                    <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: v.muted }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   CONSULTATIONS
══════════════════════════════════════════ */
function ConsultationsPage({ v, css }: { v: Vars; css: Css }) {
  const [data, setData] = useState<Consultation[]>(CONSULTATIONS);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const perPage = 10;

  const filtered = useMemo(() => data.filter(c => {
    const okStatus = filter === "all" || c.status === filter;
    const okQ = !q || [c.full_name, c.email, c.phone, c.service_requested].some(val => val.toLowerCase().includes(q.toLowerCase()));
    return okStatus && okQ;
  }), [data, q, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    const rows = [["ID","Name","Phone","Email","Service","Date","Status"], ...filtered.map(c => [c.id, c.full_name, c.phone, c.email, c.service_requested, c.preferred_date, c.status])];
    const csv = rows.map(r => r.map(val => `"${String(val).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "consultations.csv" });
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter bar */}
      <Card v={v} css={css}>
        <div style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: v.muted }} />
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search by name, email, phone…"
              style={{ width: "100%", paddingLeft: 40, paddingRight: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary, color: v.fg, fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary }}>
            {(["all","new","contacted","booked","cancelled"] as const).map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, textTransform: "capitalize", background: filter === s ? v.card : "transparent", color: filter === s ? v.fg : v.muted, boxShadow: filter === s ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", fontSize: 13, color: v.muted }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: v.muted }}>
          <Filter className="w-3 h-3" /> Showing {filtered.length} of {data.length}
        </div>
      </Card>

      {/* Table */}
      <Card v={v} css={css}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `color-mix(in oklab, ${v.secondary} 80%, transparent)` }}>
                {["#","Patient","Contact","Service","Preferred","Insurance","Status","Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: h === "Actions" ? "right" : "left", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, color: v.muted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((c, i) => (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ borderTop: `1px solid ${v.border}`, cursor: "pointer", background: i % 2 === 1 ? `color-mix(in oklab, ${v.secondary} 40%, transparent)` : "transparent" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: v.muted }}>#{String(c.id).padStart(4,"0")}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ ...css.gradBtn, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
                        {c.full_name.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 500, color: v.fg }}>{c.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: v.muted }}><div>{c.phone}</div><div>{c.email}</div></td>
                  <td style={{ padding: "12px 16px", color: v.muted }}>{c.service_requested}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: v.muted }}><div>{c.preferred_date}</div><div style={{ textTransform: "capitalize" }}>{c.preferred_time}</div></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: v.muted }}>{c.insurance_provider}</td>
                  <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                    <select value={c.status} onChange={e => setData(prev => prev.map(x => x.id === c.id ? { ...x, status: e.target.value as Status } : x))}
                      className={`text-[11px] px-2.5 py-1 rounded-full border outline-none cursor-pointer ${STATUS_META[c.status].cls}`}>
                      {(["new","contacted","booked","cancelled"] as const).map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setData(prev => prev.map(x => x.id === c.id ? { ...x, status: "contacted" } : x))}
                      style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}>
                      Mark contacted
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${v.border}` }}>
          <span style={{ fontSize: 12, color: v.muted }}>Page {page} of {pages}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", fontSize: 12, color: v.muted, opacity: page <= 1 ? 0.4 : 1 }}>Prev</button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", fontSize: 12, color: v.muted, opacity: page >= pages ? 0.4 : 1 }}>Next</button>
          </div>
        </div>
      </Card>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setSelected(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 420, height: "100%", overflowY: "auto", background: v.card, borderLeft: `1px solid ${v.border}`, fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
              <div style={{ padding: "20px", borderBottom: `1px solid ${v.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: v.muted }}>#{String(selected.id).padStart(4,"0")}</div>
                  <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 20, color: v.fg, marginTop: 4 }}>{selected.full_name}</div>
                  <span className={`mt-2 inline-flex text-[11px] px-2.5 py-1 rounded-full border ${STATUS_META[selected.status].cls}`}>{STATUS_META[selected.status].label}</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ padding: 8, borderRadius: 8, border: "none", background: v.secondary, cursor: "pointer", color: v.muted }}><X className="w-4 h-4" /></button>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                {([["Phone", Phone, selected.phone], ["Email", Mail, selected.email], ["DOB", CalendarDays, selected.date_of_birth], ["Insurance", Shield, selected.insurance_provider]] as const).map(([label, Icon, val]) => (
                  <div key={String(label)} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${v.border}`, background: v.secondary, display: "flex", alignItems: "center", justifyContent: "center", color: v.muted, flexShrink: 0 }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: v.muted }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: v.fg, marginTop: 2 }}>{val}</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${v.border}`, background: v.secondary }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: v.muted }}>Service Requested</div>
                  <div style={{ fontWeight: 600, color: v.fg, marginTop: 4 }}>{selected.service_requested}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <div><div style={{ fontSize: 11, color: v.muted }}>Date</div><div style={{ fontWeight: 500, color: v.fg, marginTop: 2, fontSize: 13 }}>{selected.preferred_date}</div></div>
                    <div><div style={{ fontSize: 11, color: v.muted }}>Time</div><div style={{ fontWeight: 500, color: v.fg, marginTop: 2, fontSize: 13, textTransform: "capitalize" }}>{selected.preferred_time}</div></div>
                  </div>
                </div>
                {selected.special_notes && (
                  <div style={{ borderRadius: 12, padding: 14, border: `1px solid ${v.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: v.muted }}>
                      <MessageSquare className="w-3 h-3" /> Notes
                    </div>
                    <div style={{ fontSize: 13, color: v.muted, marginTop: 8, fontStyle: "italic" }}>&quot;{selected.special_notes}&quot;</div>
                  </div>
                )}
                <textarea rows={3} placeholder="Add internal notes…" style={{ width: "100%", borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary, color: v.fg, padding: "10px 12px", fontSize: 13, outline: "none", resize: "none" }} />
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                  <button style={{ ...css.gradBtn, flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 16px oklch(0.58 0.18 255 / 0.2)" }}>Confirm Booking</button>
                  <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted, fontSize: 14 }}>Convert to Patient</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════
   PATIENTS
══════════════════════════════════════════ */
function PatientsPage({ v, css }: { v: Vars; css: Css }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => PATIENTS.filter(p => !q || [p.full_name, p.email, p.phone, p.insurance_provider].some(val => val.toLowerCase().includes(q.toLowerCase()))), [q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card v={v} css={css}>
        <div style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: v.muted }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search patients…"
              style={{ width: "100%", paddingLeft: 40, paddingRight: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary, color: v.fg, fontSize: 13, outline: "none" }} />
          </div>
          <button style={{ ...css.gradBtn, display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13 }}>
            <Plus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <Card key={p.id} v={v} css={css}>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ ...css.gradBtn, width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, flexShrink: 0 }}>
                    {p.full_name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: v.fg }}>{p.full_name}</div>
                    <div style={{ fontSize: 12, color: v.muted }}>{p.insurance_provider}</div>
                  </div>
                </div>
                <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: v.muted }}><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                {([["Phone", p.phone], ["Visits", String(p.total_visits)], ["Last visit", p.last_visit]] as const).map(([l, val]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: v.muted }}>{l}</span>
                    <span style={{ color: v.fg }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${v.border}`, display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: v.secondary, cursor: "pointer", fontSize: 12, fontWeight: 500, color: v.fg }}>View</button>
                <button style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 500, color: v.muted }}>Edit</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   APPOINTMENTS
══════════════════════════════════════════ */
function sw(date: Date) {
  const d = new Date(date);
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
  d.setDate(diff); d.setHours(0,0,0,0); return d;
}

const APT_CLS: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
};

function AppointmentsPage({ v, css }: { v: Vars; css: Css }) {
  const [weekStart, setWeekStart] = useState(sw(new Date()));
  const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d; });
  const hours = Array.from({ length: 9 }, (_, i) => 9+i);
  const todays = APPOINTMENTS.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card v={v} css={css} className="lg:col-span-3">
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 15, color: v.fg }}>{weekStart.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
              <div style={{ fontSize: 12, color: v.muted }}>Week of {weekStart.toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => { const d=new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d); }} style={{ padding: 8, borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setWeekStart(sw(new Date()))} style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}>Today</button>
              <button onClick={() => { const d=new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d); }} style={{ padding: 8, borderRadius: 8, border: `1px solid ${v.border}`, background: "transparent", cursor: "pointer", color: v.muted }}><ChevronRight className="w-4 h-4" /></button>
              <button style={{ ...css.gradBtn, display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", fontSize: 12, borderRadius: 8, border: "none", cursor: "pointer" }}><Plus className="w-3 h-3" /> New</button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 700, display: "grid", gridTemplateColumns: "56px repeat(5, 1fr)" }}>
              <div style={{ borderBottom: `1px solid ${v.border}`, background: `color-mix(in oklab, ${v.secondary} 60%, transparent)` }} />
              {days.map((d,i) => {
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <div key={i} style={{ textAlign: "center", padding: "10px 0", borderBottom: `1px solid ${v.border}`, borderLeft: `1px solid ${v.border}`, background: `color-mix(in oklab, ${v.secondary} 60%, transparent)` }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: v.muted }}>{d.toLocaleDateString("en-US",{weekday:"short"})}</div>
                    <div style={{ fontFamily: "'Syne', ui-sans-serif", fontSize: 18, fontWeight: 700, color: isToday ? v.primary : v.fg }}>{d.getDate()}</div>
                  </div>
                );
              })}
              {hours.map(h => (
                <Fragment key={h}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: v.muted, textAlign: "right", paddingRight: 8, paddingTop: 6, borderBottom: `1px solid ${v.border}`, height: 60 }}>
                    {h > 12 ? h-12 : h}{h >= 12 ? "pm" : "am"}
                  </div>
                  {days.map((d,i) => {
                    const appts = APPOINTMENTS.filter(a => a.date === d.toISOString().slice(0,10) && parseInt(a.time) === h);
                    return (
                      <div key={i} style={{ borderLeft: `1px solid ${v.border}`, borderBottom: `1px solid ${v.border}`, height: 60, padding: 4 }}>
                        {appts.map(a => (
                          <div key={a.id} className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium truncate ${APT_CLS[a.status]}`}>{a.patient_name}</div>
                        ))}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </Card>

        <Card v={v} css={css}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${v.border}` }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: v.muted }}>Today</div>
            <div style={{ fontFamily: "'Syne', ui-sans-serif", fontWeight: 700, fontSize: 14, color: v.fg, marginTop: 4 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>
          </div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {todays.length === 0 && <div style={{ fontSize: 12, color: v.muted, textAlign: "center", padding: "24px 0" }}>No appointments today</div>}
            {todays.map(a => (
              <div key={a.id} style={{ padding: 12, borderRadius: 10, border: `1px solid ${v.border}`, background: v.secondary }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: v.primary }}>{a.time}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${APT_CLS[a.status]}`}>{a.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: v.fg, marginTop: 4 }}>{a.patient_name}</div>
                <div style={{ fontSize: 12, color: v.muted }}>{a.service}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ANALYTICS
══════════════════════════════════════════ */
function AnalyticsPage({ v, css }: { v: Vars; css: Css }) {
  const topPatients = [...PATIENTS].sort((a,b) => b.total_visits-a.total_visits).slice(0,8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[
        { title:"Consultations / Month", sub:"Trailing 12 months", chart:(
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_CONSULTS} margin={{top:4,right:4,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={v.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:v.muted}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11,fill:v.muted}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:v.card,border:`1px solid ${v.border}`,borderRadius:12,fontSize:12}}/>
              <Line type="monotone" dataKey="consults" stroke={v.primary} strokeWidth={2.5} dot={{r:3,fill:v.accent}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        )},
        { title:"Top Services", sub:"By request volume", chart:(
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SERVICES_BREAKDOWN} margin={{top:4,right:4,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={v.border} vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:v.muted}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11,fill:v.muted}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:v.card,border:`1px solid ${v.border}`,borderRadius:12,fontSize:12}} cursor={{fill:`color-mix(in oklab, ${v.secondary} 60%, transparent)`}}/>
              <Bar dataKey="value" radius={[6,6,0,0]}>{SERVICES_BREAKDOWN.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        )},
        { title:"Insurance Breakdown", sub:"Active patients", chart:(
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={INSURANCE_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {INSURANCE_BREAKDOWN.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]} stroke={v.card} strokeWidth={2}/>)}
              </Pie>
              <Tooltip contentStyle={{background:v.card,border:`1px solid ${v.border}`,borderRadius:12,fontSize:12}}/>
              <Legend iconType="circle" wrapperStyle={{fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
        )},
        { title:"Top Patients by Visits", sub:"Loyalty leaderboard", chart:(
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
            {topPatients.map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px",borderRadius:10,background:`color-mix(in oklab, ${v.secondary} 50%, transparent)`}}>
                <div style={{width:24,fontSize:12,fontWeight:700,color:v.muted,textAlign:"center"}}>#{i+1}</div>
                <div style={{...css.gradBtn,width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>
                  {p.full_name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:500,fontSize:13,color:v.fg,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.full_name}</div>
                  <div style={{fontSize:11,color:v.muted}}>{p.insurance_provider}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Syne',ui-sans-serif",fontWeight:700,color:v.primary}}>{p.total_visits}</div>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:v.muted}}>visits</div>
                </div>
              </div>
            ))}
          </div>
        )},
      ].map(({title,sub,chart})=>(
        <Card key={title} v={v} css={css}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${v.border}`}}>
            <div style={{fontFamily:"'Syne',ui-sans-serif",fontWeight:700,fontSize:15,color:v.fg}}>{title}</div>
            <div style={{fontSize:12,color:v.muted,marginTop:2}}>{sub}</div>
          </div>
          <div style={{padding:"16px 20px"}}>{chart}</div>
        </Card>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════ */
function SettingsPage({ v, css }: { v: Vars; css: Css }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:720}}>
      {[
        { icon:Building2, title:"Practice Information", sub:"Public details shown on your site", content:(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[["Practice Name","Jackson Dental"],["Phone","(813) 999-9999"],["Email","hello@jacksondental.com"],["Address","4710 N Habana Ave, Tampa, FL"]].map(([l,val])=>(
              <div key={l}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.15em",color:v.muted,marginBottom:4}}>{l}</div>
                <input defaultValue={val} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${v.border}`,background:v.secondary,color:v.fg,fontSize:13,outline:"none"}}/>
              </div>
            ))}
          </div>
        )},
        { icon:Lock, title:"Security", sub:"Account & access settings", content:(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[["Admin Email","admin@jacksondental.com"],["Current Password",""],["New Password",""]].map(([l,val],i)=>(
              <div key={l} className={i===0?"sm:col-span-2":""}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.15em",color:v.muted,marginBottom:4}}>{l}</div>
                <input defaultValue={val} type={String(l).includes("Password")?"password":"text"} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${v.border}`,background:v.secondary,color:v.fg,fontSize:13,outline:"none"}}/>
              </div>
            ))}
          </div>
        )},
      ].map(({icon:Icon,title,sub,content})=>(
        <Card key={title} v={v} css={css}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${v.border}`,display:"flex",alignItems:"flex-start",gap:16}}>
            <div style={{width:40,height:40,borderRadius:10,border:`1px solid ${v.border}`,background:v.secondary,display:"flex",alignItems:"center",justifyContent:"center",color:v.primary}}>
              <Icon className="w-4 h-4"/>
            </div>
            <div>
              <div style={{fontFamily:"'Syne',ui-sans-serif",fontWeight:700,fontSize:15,color:v.fg}}>{title}</div>
              <div style={{fontSize:12,color:v.muted,marginTop:2}}>{sub}</div>
            </div>
          </div>
          <div style={{padding:"16px 20px"}}>{content}</div>
        </Card>
      ))}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <button style={{padding:"10px 16px",borderRadius:10,border:`1px solid ${v.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:v.muted}}>Cancel</button>
        <button style={{...css.gradBtn,display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,boxShadow:"0 4px 16px oklch(0.58 0.18 255 / 0.2)"}}>
          <Save className="w-4 h-4"/> Save changes
        </button>
      </div>
    </div>
  );
}
