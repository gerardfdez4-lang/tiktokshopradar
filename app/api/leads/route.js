import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Guarda los leads en data/leads.jsonl (un JSON por línea).
// TODO: conectar a un ESP real (ConvertKit, MailerLite, Brevo…) cuando esté listo.
const FILE = path.join(process.cwd(), "data", "leads.jsonl");

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const name = (body.name || "").toString().trim().slice(0, 120);
  const email = (body.email || "").toString().trim().toLowerCase().slice(0, 200);
  const phone = (body.phone || "").toString().trim().slice(0, 40);
  const source = (body.source || "clase").toString().slice(0, 40);

  if (!isEmail(email)) {
    return Response.json({ ok: false, error: "Email no válido" }, { status: 400 });
  }

  const lead = { name, email, phone, source, ts: new Date().toISOString() };
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.appendFile(FILE, JSON.stringify(lead) + "\n", "utf8");
  } catch (e) {
    // No bloqueamos al usuario si falla el guardado; al menos lo registramos.
    console.error("No se pudo guardar el lead:", e.message);
  }
  console.log("Nuevo lead:", lead.email, `(${source})`);

  return Response.json({ ok: true });
}
