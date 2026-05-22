const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type Appointment = {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  appointmentDate: string | Date;
  appointmentTime: string;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
};

async function readJson(response: Response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export async function createAppointment(data: Omit<Appointment, "id" | "status" | "createdAt" | "updatedAt">) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return readJson(response);
}

export async function adminLogin(data: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return readJson(response) as Promise<{ session: string }>;
}

export async function listAppointments(params: {
  session: string;
  page: number;
  pageSize: number;
  search?: string;
  date?: string;
  service?: string;
  status?: AppointmentStatus;
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) query.set("search", params.search);
  if (params.date) query.set("date", params.date);
  if (params.service) query.set("service", params.service);
  if (params.status) query.set("status", params.status);

  const response = await fetch(`${API_BASE_URL}/appointments?${query.toString()}`, {
    headers: { Authorization: `Bearer ${params.session}` },
  });

  return readJson(response) as Promise<{
    appointments: Appointment[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  }>;
}

export async function updateAppointmentStatus(data: {
  session: string;
  id: string;
  status: AppointmentStatus;
}) {
  const response = await fetch(`${API_BASE_URL}/appointments/${data.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session}`,
    },
    body: JSON.stringify({ status: data.status }),
  });

  return readJson(response);
}

export async function deleteAppointment(data: { session: string; id: string }) {
  const response = await fetch(`${API_BASE_URL}/appointments/${data.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${data.session}` },
  });

  return readJson(response);
}
