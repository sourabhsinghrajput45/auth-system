/**
 * Frontend → Node Middleware Auth API
 * Tokens are handled ONLY via HTTP-only cookies
 */

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;


/**
 * Safe JSON/text parser
 */
async function parseResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

const authAPI = {
  /**
   * SIGNUP
   * → creates user (and optionally sets cookies if backend does so)
   */
  signup: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseResponse(response);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  },

  /**
   * LOGIN
   * → sets accessToken & refreshToken cookies
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseResponse(response);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  },


getAuthStatus: async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth-status`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      authenticated: false,
      emailVerified: false,
    };
  }
},



  /**
   * LOGOUT
   * → clears cookies + revokes backend session
   */
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  },

  /**
   * GET CURRENT USER
   * → calls Node → Quarkus `/me`
   */
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });

    if (response.status === 401) {
      return { authenticated: false };
    }

    if (!response.ok) {
      return {
        authenticated: false,
        error: "Unexpected server error",
      };
    }

    const data = await response.json();

    return {
      authenticated: true,
      email: data.email ?? data,
    };
  },

  /**
   * SILENT TOKEN REFRESH
   * → rotates refresh token + access token
   */
  refreshToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return {
      refreshed: response.ok,
    };
  },
};

export default authAPI;
