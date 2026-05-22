export type Status = "new" | "contacted" | "booked" | "cancelled";

export const SERVICES = [
  "Preventative Care & Cleanings",
  "Invisalign",
  "Dental Sealants",
  "Digital X-rays",
  "Bonding & White Fillings",
  "Dental Implants",
  "Extractions & Wisdom Teeth",
  "Dentures & Partials",
  "Zoom Teeth Whitening",
  "Root Canal Treatment",
  "Periodontal Treatment",
];

const FIRST = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "Lucas", "Mia", "Logan", "Amelia", "James", "Harper", "Aiden", "Evelyn", "Jackson", "Abigail", "Sebastian", "Charlotte", "Henry", "Madison", "Owen"];
const LAST = ["Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall"];
const INSURANCE = ["Delta Dental", "Cigna", "Aetna", "BlueCross BlueShield", "MetLife", "Guardian", "United Healthcare", "Humana", "Self-Pay", "Ameritas"];
const STATUSES: Status[] = ["new", "contacted", "booked", "cancelled"];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRand(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export interface Consultation {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  service_requested: string;
  preferred_date: string;
  preferred_time: "morning" | "afternoon" | "either";
  insurance_provider: string;
  special_notes: string;
  status: Status;
  admin_notes: string;
  created_at: string;
}

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const CONSULTATIONS: Consultation[] = Array.from({ length: 47 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: i + 1,
    full_name: `${first} ${last}`,
    phone: `(615) ${String(Math.floor(rand() * 900) + 100)}-${String(Math.floor(rand() * 9000) + 1000)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    date_of_birth: `19${Math.floor(rand() * 50) + 50}-${String(Math.floor(rand() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    service_requested: pick(SERVICES),
    preferred_date: dateOffset(Math.floor(rand() * 30) + 1).slice(0, 10),
    preferred_time: pick(["morning", "afternoon", "either"] as const),
    insurance_provider: pick(INSURANCE),
    special_notes: rand() > 0.6 ? "Has dental anxiety, prefers extra care." : "",
    status: i < 8 ? "new" : pick(STATUSES),
    admin_notes: "",
    created_at: dateOffset(-Math.floor(rand() * 30)),
  };
});

export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  insurance_provider: string;
  total_visits: number;
  last_visit: string;
  notes: string;
}

export const PATIENTS: Patient[] = Array.from({ length: 32 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: i + 1,
    full_name: `${first} ${last}`,
    phone: `(615) ${String(Math.floor(rand() * 900) + 100)}-${String(Math.floor(rand() * 9000) + 1000)}`,
    email: `${first.toLowerCase()}${i}@example.com`,
    insurance_provider: pick(INSURANCE),
    total_visits: Math.floor(rand() * 24) + 1,
    last_visit: dateOffset(-Math.floor(rand() * 180)).slice(0, 10),
    notes: "",
  };
});

export interface Appointment {
  id: number;
  patient_name: string;
  service: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

export const APPOINTMENTS: Appointment[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  patient_name: `${pick(FIRST)} ${pick(LAST)}`,
  service: pick(SERVICES),
  date: dateOffset(Math.floor(rand() * 14) - 3).slice(0, 10),
  time: `${9 + Math.floor(rand() * 7)}:${pick(["00", "30"])}`,
  status: pick(["scheduled", "completed", "cancelled"] as const),
}));

// Analytics
export const CONSULTATIONS_30D = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  count: Math.floor(rand() * 8) + 2,
}));

export const SERVICES_BREAKDOWN = SERVICES.slice(0, 6).map((s) => ({
  name: s.split(" ")[0],
  value: Math.floor(rand() * 80) + 20,
}));

export const MONTHLY_CONSULTS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({
  month: m,
  consults: Math.floor(rand() * 60) + 30,
}));

export const INSURANCE_BREAKDOWN = INSURANCE.slice(0, 6).map((i) => ({
  name: i,
  value: Math.floor(rand() * 60) + 10,
}));
