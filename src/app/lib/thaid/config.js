// ThaID Configuration
export const THAID_CONFIG = {
  // OAuth2 Configuration
  ISSUER:
    process.env.NEXT_PUBLIC_THAID_ISSUER || "https://imauth.bora.dopa.go.th",
  CLIENT_ID: process.env.NEXT_PUBLIC_THAID_CLIENT_ID || "",

  // URLs
  REDIRECT_URL:
    process.env.NEXT_PUBLIC_THAID_REDIRECT_URL ||
    "http://localhost:3000/thaid/authentic_success",

  // Scope - requested user information
  SCOPE:
    process.env.NEXT_PUBLIC_THAID_SCOPE ||
    "pid openid name_en name birthdate address given_name middle_name family_name given_name_en middle_name_en family_name_en gender smartcard_code title title_en ial date_of_issuance date_of_expiry",

  // Response type for OAuth2 Authorization Code flow
  RESPONSE_TYPE: "code",
};

// Validate required configuration
export function validateThaIDConfig() {
  const errors = [];

  if (!THAID_CONFIG.CLIENT_ID) {
    errors.push("NEXT_PUBLIC_THAID_CLIENT_ID is required");
  }

  if (!THAID_CONFIG.REDIRECT_URL) {
    errors.push("NEXT_PUBLIC_THAID_REDIRECT_URL is required");
  }

  if (errors.length > 0) {
    throw new Error("ThaID Configuration Error: " + errors.join(", "));
  }

  return true;
}

export default THAID_CONFIG;
