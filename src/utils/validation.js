export function normalizeBDPhone(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/[^\d+]/g, "").replace(/\s+/g, "");
  // Keep leading + if present, otherwise strip non-digits.
  const cleaned = digits.startsWith("+")
    ? `+${digits.slice(1).replace(/\D/g, "")}`
    : digits.replace(/\D/g, "");

  // Normalize to local format: 01XXXXXXXXX (11 digits)
  if (/^01\d{9}$/.test(cleaned)) return cleaned;
  if (/^8801\d{9}$/.test(cleaned)) return cleaned.slice(2); // 8801XXXXXXXXX -> 01XXXXXXXXX
  if (/^\+8801\d{9}$/.test(cleaned)) return cleaned.slice(3); // +8801XXXXXXXXX -> 01XXXXXXXXX

  return cleaned;
}

export function isValidBangladeshiPhone(value) {
  const local = normalizeBDPhone(value);
  // Bangladeshi mobile numbers: 01[3-9]XXXXXXXX (11 digits)
  return /^01[3-9]\d{8}$/.test(local);
}

