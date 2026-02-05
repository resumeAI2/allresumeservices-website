export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "All Résumé Services";

export const APP_LOGO = "/logo-allresume.png";

/**
 * Get the login URL for NextAuth.js
 * Points to the local login page which handles authentication
 */
export const getLoginUrl = () => {
  return "/login";
};
