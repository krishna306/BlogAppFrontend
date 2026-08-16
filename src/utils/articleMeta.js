export function displayName(email) {
  if (!email) return "Unknown";
  return email.split("@")[0];
}

export function displayInitial(email) {
  return (email || "?").trim().charAt(0).toUpperCase();
}

export function readingTimeMinutes(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

export function creatorId(creator) {
  if (!creator) return "";
  if (typeof creator === "string") return creator;
  return creator._id || "";
}

export function creatorEmail(creator) {
  if (!creator || typeof creator === "string") return "";
  return creator.email || "";
}
