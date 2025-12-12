// ThaID Configuration Types
export interface ThaIDConfig {
  ISSUER: string;
  CLIENT_ID: string;
  REDIRECT_URL: string;
  SCOPE: string;
  RESPONSE_TYPE: string;
}

// ThaID Configuration
export const THAID_CONFIG: ThaIDConfig = {
  ISSUER:
    window.__ENV__?.NEXT_PUBLIC_THAID_ISSUER ||
    "https://imauth.bora.dopa.go.th",
  CLIENT_ID: window.__ENV__?.NEXT_PUBLIC_THAID_CLIENT_ID || "",
  REDIRECT_URL:
    window.__ENV__?.NEXT_PUBLIC_THAID_REDIRECT_URL ||
    "http://localhost:3000/callback",
  SCOPE: window.__ENV__?.NEXT_PUBLIC_THAID_SCOPE || "pid openid",
  RESPONSE_TYPE: "code",
};

export default THAID_CONFIG;
