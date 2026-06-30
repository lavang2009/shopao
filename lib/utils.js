export function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
}
export function slugify(input = "") {
  return String(input).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
export function randomCode(prefix = "OD") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let tail = "";
  for (let i = 0; i < 8; i++) tail += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${tail}`;
}
export function randomToken(length = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
export function parseList(input) {
  if (Array.isArray(input)) return input.map(String).filter(Boolean);
  if (typeof input !== "string") return [];
  return input.split(",").map((s) => s.trim()).filter(Boolean);
}
export function toISO(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return undefined;
}
