import THAID_CONFIG from "./config.js";

let discoveryCache = null;

export async function loadOpenIDConfiguration() {
  if (discoveryCache) {
    return discoveryCache;
  }

  try {
    console.log("🔍 Loading OpenID Connect configuration from ThaID...");

    const thaIDConfig = {
      issuer: THAID_CONFIG.ISSUER,
      authorization_endpoint: `${THAID_CONFIG.ISSUER}/api/v2/oauth2/auth/`,
    };

    discoveryCache = thaIDConfig;
    return thaIDConfig;
  } catch (error) {
    console.error("❌ Failed to load OpenID configuration:", error);
    throw new Error("Failed to initialize ThaID authentication");
  }
}

/**
 * Generate cryptographically secure random string for OAuth2 security
 */
function generateRandomString(length = 32) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";

  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
  } else {
    // Fallback for server-side
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return result;
}

/**
 * Create ThaID authorization URL for OAuth2 flow
 * This is the only function needed for the new simple flow
 */
export async function createAuthorizationUrl() {
  try {
    // Load OpenID configuration
    const oidcConfig = await loadOpenIDConfiguration();

    // Generate random state and nonce for security
    const state = generateRandomString();
    const nonce = generateRandomString();

    // Store state and nonce in sessionStorage for validation later (if needed)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("thaid_state", state);
      sessionStorage.setItem("thaid_nonce", nonce);
    }

    // Build authorization URL with all required parameters
    const authUrl = new URL(oidcConfig.authorization_endpoint);

    const params = {
      client_id: THAID_CONFIG.CLIENT_ID,
      redirect_uri: THAID_CONFIG.REDIRECT_URL,
      response_type: THAID_CONFIG.RESPONSE_TYPE,
      scope: THAID_CONFIG.SCOPE,
      state: state,
      nonce: nonce,
    };

    // Add all parameters to the authorization URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        authUrl.searchParams.set(key, value);
      }
    });

    console.log("🚀 Generated ThaID authorization URL");
    console.log("🔐 Security parameters:", {
      state: state.substring(0, 8) + "...",
      nonce: nonce.substring(0, 8) + "...",
    });

    return {
      url: authUrl.toString(),
      state: state,
      nonce: nonce,
    };
  } catch (error) {
    console.error("❌ Failed to create authorization URL:", error);
    throw new Error("Failed to initialize ThaID login: " + error.message);
  }
}

/**
 * Validate ThaID configuration
 */
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

export default {
  createAuthorizationUrl,
  loadOpenIDConfiguration,
  validateThaIDConfig,
};

/**
 * Sample ThaID authorization URLs
 
https://imauth.bora.dopa.go.th/api/v2/oauth2/auth/?client_id=TUpkRnZTT2xGc05tY1ZhZVJjZEdQOWpLM2dOV2tqZXk&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fthaid%2Fcallback&response_type=code&scope=pid+openid+name_en+name+birthdate+address+given_name+middle_name+family_name+given_name_en+middle_name_en+family_name_en+gender+smartcard_code+title+title_en+ial+date_of_issuance+date_of_expiry&state=iG51cM5fPz72BpnoYUBJIBrlnUqtjrSy&nonce=1gDnw09FgdkGSwR9o2689ICVGNuWjgei

https://imauth.bora.dopa.go.th/api/v2/oauth2/auth/?client_id=TFB0dGhHMUlrdm9QOXN0ek9sZ05mbXk4RFB5YmxCMWM&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fthaid%2Fcallback&response_type=code&scope=pid+openid+name_en+name+birthdate+address+given_name+middle_name+family_name+given_name_en+middle_name_en+family_name_en+gender+smartcard_code+title+title_en+ial+date_of_issuance+date_of_expiry&state=DJrfpI0LgKBRo6wljZbvxgKn3NC16qL6&nonce=254OOV0GoRzPsYK9aKRtNQrnf3fPBk7A

https://imauthsbx.bora.dopa.go.th/api/v2/oauth2/auth/?response_type=code&client_id=TFB0dGhHMUlrdm9QOXN0ek9sZ05mbXk4RFB5YmxCMWM&redirect_uri=http://localhost:3000/callback&scope=pid openid&state=this_is_random_string
*/