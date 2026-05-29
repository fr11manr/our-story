export const SITE_SESSION_COOKIE = "our_story_session";
export const ADMIN_SESSION_COOKIE = "our_story_admin_session";
export const SESSION_VALUE = "granted";

export function getSitePassword() {
  return process.env.SITE_PASSWORD;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
