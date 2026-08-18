export const ADMIN_EMAIL = "kumarkrishna2576@gmail.com";

export function isAdminUser(user) {
  return (
    String(user?.email || "")
      .trim()
      .toLowerCase() === ADMIN_EMAIL
  );
}
