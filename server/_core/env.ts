export const ENV = {
  // Database
  databaseUrl: process.env.DATABASE_URL ?? "",
  
  // NextAuth.js configuration
  authSecret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET ?? "",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  
  // OAuth Providers
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  githubClientId: process.env.GITHUB_CLIENT_ID ?? "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
  
  // Legacy Manus OAuth (deprecated, will be removed)
  appId: process.env.VITE_APP_ID ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  
  // Legacy JWT secret (use AUTH_SECRET instead)
  cookieSecret: process.env.JWT_SECRET ?? process.env.AUTH_SECRET ?? "",
  
  // Application
  isProduction: process.env.NODE_ENV === "production",
  
  // Forge API
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
