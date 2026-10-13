// Pure expense logic — no DOM, so it can be tested in Node and used in the browser.

export const ENTITIES = ["TRS", "Trace", "AI Lab"];

export function createExpense({ description, amount, entity, date }) {
  const desc = String(description ?? "").trim();
  const value = Number(amount);
  if (!desc) throw new Error("Description is required");
  if (!Number.isFinite(value) || value <= 0) throw new Error("Amount must be greater than 0");
  if (!ENTITIES.includes(entity)) throw new Error(`Entity must be one of: ${ENTITIES.join(", ")}`);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: desc,
    amount: Math.round(value * 100) / 100,
    entity,
    date: date || new Date().toISOString().slice(0, 10),
  };
}

export function totalsByEntity(expenses) {
  const totals = Object.fromEntries(ENTITIES.map((e) => [e, 0]));
  for (const x of expenses) totals[x.entity] = Math.round((totals[x.entity] + x.amount) * 100) / 100;
  return totals;
}

export function grandTotal(expenses) {
  return Math.round(expenses.reduce((sum, x) => sum + x.amount, 0) * 100) / 100;
}

function csvCell(value) {
  const s = String(value);
  // Quote when needed; prefix formula-like text so spreadsheets don't execute it.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCSV(expenses) {
  const rows = [["Date", "Description", "Entity", "Amount (PHP)"]];
  for (const x of expenses) rows.push([x.date, x.description, x.entity, x.amount.toFixed(2)]);
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function formatPHP(amount) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
}
