"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";

import {
  type Appointment,
  type AppointmentStatus,
  adminLogin,
  deleteAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "@/lib/api";

const services = [
  "Cosmetic Dentistry",
  "Porcelain Veneers",
  "Dental Implants",
  "Teeth Whitening",
  "Family Dentistry",
  "Restorative Care",
];

const statuses: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const [session, setSession] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "">("");

  useEffect(() => {
    try {
      setSession(localStorage.getItem("jackson-admin-session") ?? "");
      localStorage.removeItem("jackson-admin-token");
    } catch {}
  }, []);

  const stats = useMemo(
    () => ({
      pending: appointments.filter((item) => item.status === "PENDING").length,
      confirmed: appointments.filter((item) => item.status === "CONFIRMED").length,
      completed: appointments.filter((item) => item.status === "COMPLETED").length,
    }),
    [appointments],
  );

  async function loadAppointments(nextPage = page) {
    if (!session) return;

    setLoading(true);
    try {
      const result = await listAppointments({
        session,
        page: nextPage,
        pageSize: 10,
        search: search || undefined,
        date: date || undefined,
        service: service || undefined,
        status: status || undefined,
      });

      setAppointments(result.appointments);
      setTotal(result.total);
      setPage(result.page);
      setPageCount(result.pageCount);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Appointments could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments(1);
  }, [session, search, date, service, status]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);

    try {
      const result = await adminLogin({ username, password });
      setSession(result.session);
      localStorage.setItem("jackson-admin-session", result.session);
      toast.success("Admin portal opened.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleStatus(id: string, nextStatus: AppointmentStatus) {
    try {
      await updateAppointmentStatus({ id, status: nextStatus, session });
      toast.success(`Appointment marked ${nextStatus.toLowerCase()}.`);
      setSelectedAppointment(null);
      await loadAppointments(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Status could not be updated.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this appointment permanently?")) return;

    try {
      await deleteAppointment({ id, session });
      setSelectedAppointment(null);
      toast.success("Appointment deleted.");
      await loadAppointments(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Appointment could not be deleted.");
    }
  }

  function logout() {
    setSession("");
    localStorage.removeItem("jackson-admin-session");
    setAppointments([]);
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Toaster richColors position="top-right" />
        <main className="grid min-h-screen place-items-center px-4">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight">Admin Login</h1>
            <p className="mt-2 text-sm text-slate-500">Use admin credentials to manage consultation requests.</p>
            <div className="mt-6 space-y-3">
              <input required value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" placeholder="Username" autoComplete="username" />
              <input required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" placeholder="Password" type="password" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loginLoading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Open dashboard
            </button>
          </motion.form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster richColors position="top-right" />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Jackson Dental</p>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-5">
            <a className="flex items-center gap-3 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white" href="/admin">
              <CalendarDays className="h-4 w-4" />
              Appointments
            </a>
          </nav>
          <div className="border-t border-slate-200 p-4">
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
              <p className="text-sm text-slate-500">Track and manage all submitted consultation requests.</p>
            </div>
            <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:hidden">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Pending" value={stats.pending} icon={Clock} />
            <StatCard label="Confirmed" value={stats.confirmed} icon={ShieldCheck} />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or phone" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100" />
              </label>
              <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100" />
              <select value={service} onChange={(event) => setService(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100">
                <option value="">All services</option>
                {services.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={status} onChange={(event) => setStatus(event.target.value as AppointmentStatus | "")} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100">
                <option value="">All statuses</option>
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Appointment List</h2>
                <p className="text-sm text-slate-500">{total} total bookings</p>
              </div>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-500" />}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Patient</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Time</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{appointment.patientName}</p>
                        <p className="text-xs text-slate-500">{appointment.email}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{appointment.service}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(appointment.appointmentDate)}</td>
                      <td className="px-5 py-4 text-slate-600">{appointment.appointmentTime}</td>
                      <td className="px-5 py-4"><StatusBadge status={appointment.status} /></td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(appointment.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <IconButton label="View" onClick={() => setSelectedAppointment(appointment)} icon={Eye} />
                          <IconButton label="Confirm" onClick={() => handleStatus(appointment.id, "CONFIRMED")} icon={ShieldCheck} />
                          <IconButton label="Complete" onClick={() => handleStatus(appointment.id, "COMPLETED")} icon={CheckCircle2} />
                          <IconButton label="Delete" onClick={() => handleDelete(appointment.id)} icon={Trash2} tone="danger" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && appointments.length === 0 && (
              <div className="grid place-items-center px-6 py-16 text-center">
                <CalendarDays className="h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">Submitted consultation requests will appear here.</p>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Page {page} of {pageCount}</p>
              <div className="flex gap-2">
                <button onClick={() => loadAppointments(Math.max(1, page - 1))} disabled={page <= 1 || loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button onClick={() => loadAppointments(Math.min(pageCount, page + 1))} disabled={page >= pageCount || loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AppointmentModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} onDelete={handleDelete} onStatus={handleStatus} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>{status}</span>;
}

function IconButton({ label, onClick, icon: Icon, tone = "default" }: { label: string; onClick: () => void; icon: LucideIcon; tone?: "default" | "danger" }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} className={`grid h-8 w-8 place-items-center rounded-lg border transition ${tone === "danger" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AppointmentModal({ appointment, onClose, onDelete, onStatus }: { appointment: Appointment | null; onClose: () => void; onDelete: (id: string) => void; onStatus: (id: string, status: AppointmentStatus) => void }) {
  return (
    <AnimatePresence>
      {appointment && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusBadge status={appointment.status} />
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">{appointment.patientName}</h2>
                <p className="mt-1 text-sm text-slate-500">{appointment.service}</p>
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail icon={Mail} label="Email" value={appointment.email} />
              <Detail icon={Phone} label="Phone" value={appointment.phone} />
              <Detail icon={CalendarDays} label="Date" value={formatDate(appointment.appointmentDate)} />
              <Detail icon={Clock} label="Time" value={appointment.appointmentTime} />
              <Detail icon={User} label="Created" value={formatDate(appointment.createdAt)} />
              <Detail icon={ShieldCheck} label="Status" value={appointment.status} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{appointment.notes || "No notes provided."}</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button onClick={() => onStatus(appointment.id, "CONFIRMED")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Mark confirmed</button>
              <button onClick={() => onStatus(appointment.id, "COMPLETED")} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Mark completed</button>
              <button onClick={() => onDelete(appointment.id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
