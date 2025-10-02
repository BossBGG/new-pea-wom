// ThaID Configuration
export const THAID_CONFIG = {
  ISSUER: process.env.NEXT_PUBLIC_THAID_ISSUER || "https://imauth.bora.dopa.go.th",
  CLIENT_ID: process.env.NEXT_PUBLIC_THAID_CLIENT_ID || "",
  REDIRECT_URL: process.env.NEXT_PUBLIC_THAID_REDIRECT_URL || "http://localhost:3000/callback",
  SCOPE: process.env.NEXT_PUBLIC_THAID_SCOPE || "pid openid",
  RESPONSE_TYPE: "code",
};

export default THAID_CONFIG;
