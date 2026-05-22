import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

import { initializeDatabase, pool } from "./db.js";

const app = express();
const port = Number(process.env.BACKEND_PORT || 5000);
const adminSession = "jackson-dental-admin-session";

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim());
app.use(cors());
// app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

function requireAdmin(req, res, next) {
  const session = req.headers.authorization?.replace("Bearer ", "");

  if (session !== adminSession) {
    return res.status(401).json({ message: "Unauthorized admin request." });
  }

  return next();
}

function normalizeAppointment(row) {
  return {
    id: String(row.id),
    patientName: row.patient_name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function validateAppointment(body) {
  const required = ["patientName", "email", "phone", "service", "appointmentDate", "appointmentTime", "notes"];
  const missing = required.filter((field) => !String(body[field] || "").trim());

  if (missing.length > 0) {
    return `${missing.join(", ")} required.`;
  }

  return "";
}

async function seedAdmin() {
  const [rows] = await pool.query("SELECT id FROM admins WHERE username = ?", ["admin"]);
  if (rows.length > 0) return;

  const passwordHash = await bcrypt.hash("admin123", 10);
  await pool.query("INSERT INTO admins (username, password_hash) VALUES (?, ?)", ["admin", passwordHash]);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM admins WHERE username = ? LIMIT 1", [username]);
  const admin = rows[0];

  if (!admin || !(await bcrypt.compare(password || "", admin.password_hash))) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  return res.json({ session: adminSession });
});

app.post("/api/appointments", async (req, res) => {
  const validationError = validateAppointment(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { patientName, email, phone, service, appointmentDate, appointmentTime, notes } = req.body;

  const [result] = await pool.query(
    `INSERT INTO appointments
      (patient_name, email, phone, service, appointment_date, appointment_time, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patientName, email, phone, service, appointmentDate, appointmentTime, notes],
  );

  return res.status(201).json({ id: String(result.insertId), message: "Appointment submitted successfully." });
});

app.get("/api/appointments", requireAdmin, async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 10), 5), 50);
  const offset = (page - 1) * pageSize;
  const filters = [];
  const values = [];

  if (req.query.search) {
    filters.push("(patient_name LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const search = `%${req.query.search}%`;
    values.push(search, search, search);
  }

  if (req.query.date) {
    filters.push("appointment_date = ?");
    values.push(req.query.date);
  }

  if (req.query.service) {
    filters.push("service = ?");
    values.push(req.query.service);
  }

  if (req.query.status) {
    filters.push("status = ?");
    values.push(req.query.status);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM appointments ${where}`, values);
  const [rows] = await pool.query(
    `SELECT * FROM appointments ${where} ORDER BY appointment_date DESC, appointment_time DESC LIMIT ? OFFSET ?`,
    [...values, pageSize, offset],
  );

  const total = countRows[0].total;
  return res.json({
    appointments: rows.map(normalizeAppointment),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  });
});

app.patch("/api/appointments/:id/status", requireAdmin, async (req, res) => {
  const allowedStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid appointment status." });
  }

  await pool.query("UPDATE appointments SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  return res.json({ ok: true });
});

app.delete("/api/appointments/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM appointments WHERE id = ?", [req.params.id]);
  return res.json({ ok: true });
});

initializeDatabase()
  .then(seedAdmin)
  .then(() => {
    app.listen(port, () => {
      console.log(`Jackson Dental backend running on http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.error("Backend failed to start:", error);
    process.exit(1);
  });
