/**
 * MediCare Unified API Layer
 * Connects Medicare_Frontend to the MediCare ASP.NET Core Backend
 */

const API_BASE_URL = "http://localhost:5175";

const AUTH_STORAGE_KEYS = {
  token: "medicare_token",
  altToken: "medicareToken",
  currentUser: "medicareCurrentUser",
  userRoles: "medicare_roles",
  userId: "medicare_user_id"
};

function clearAuthSession() {
  try {
    const keys = [
      AUTH_STORAGE_KEYS.token,
      AUTH_STORAGE_KEYS.altToken,
      AUTH_STORAGE_KEYS.currentUser,
      AUTH_STORAGE_KEYS.userRoles,
      AUTH_STORAGE_KEYS.userId,
      "medicareSession"
    ];
    keys.forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  } catch (e) { /* ignore */ }
}

function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload && typeof payload.exp === "number") {
        return payload.exp * 1000 <= Date.now();
      }
    }
  } catch (e) {
    // Non-standard JWT format or decode error: do not assume expired
  }
  return false;
}

function getToken() {
  try {
    const token = (
      localStorage.getItem(AUTH_STORAGE_KEYS.token) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.token) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.altToken) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.altToken) ||
      null
    );
    if (!token) return null;
    if (isTokenExpired(token)) {
      clearAuthSession();
      return null;
    }
    return token;
  } catch (e) {
    return null;
  }
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.currentUser) || sessionStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveAuthSession(authData, rememberMe = true) {
  const primaryStorage = rememberMe ? localStorage : sessionStorage;
  const alternateStorage = rememberMe ? sessionStorage : localStorage;

  // Clean alternate storage to prevent stale token conflicts
  try {
    const keys = [
      AUTH_STORAGE_KEYS.token,
      AUTH_STORAGE_KEYS.altToken,
      AUTH_STORAGE_KEYS.currentUser,
      AUTH_STORAGE_KEYS.userRoles,
      AUTH_STORAGE_KEYS.userId,
      "medicareSession"
    ];
    keys.forEach(k => alternateStorage.removeItem(k));
  } catch (e) { /* ignore */ }

  if (authData.token) {
    primaryStorage.setItem(AUTH_STORAGE_KEYS.token, authData.token);
    primaryStorage.setItem(AUTH_STORAGE_KEYS.altToken, authData.token);
  }
  if (authData.userId) {
    primaryStorage.setItem(AUTH_STORAGE_KEYS.userId, authData.userId);
  }
  if (authData.roles) {
    primaryStorage.setItem(AUTH_STORAGE_KEYS.userRoles, JSON.stringify(authData.roles));
  }
  const primaryRole = Array.isArray(authData.roles) && authData.roles.length > 0 
    ? authData.roles[0] 
    : (authData.role || "Patient");

  const user = {
    id: authData.userId,
    fullName: authData.fullName,
    email: authData.email,
    roles: authData.roles || [primaryRole],
    role: primaryRole,
    signedInAt: new Date().toISOString()
  };
  primaryStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(user));
  return user;
}

function logout() {
  clearAuthSession();
  window.location.replace("login.html");
}

function requireRole(allowedRoles) {
  const user = getCurrentUser();
  const token = getToken();

  if (!token || !user) {
    window.location.replace("login.html");
    return null;
  }

  const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
  const storedRoles = (localStorage.getItem("medicare_roles") || "") + (sessionStorage.getItem("medicare_roles") || "");
  const isAdmin = userRoles.includes("Admin") || storedRoles.includes("Admin");
  if (isAdmin) {
    return user; // Full Admin access across all portals
  }

  const hasAllowedRole = allowedRoles.some(r => userRoles.includes(r));

  if (!hasAllowedRole) {
    alert("Access Denied: You do not have permission to view this page.");
    if (userRoles.includes("Doctor")) {
      window.location.replace("page4.html");
    } else if (userRoles.includes("Patient")) {
      window.location.replace("page3.html");
    } else {
      window.location.replace("login.html");
    }
    return null;
  }

  return user;
}

async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      clearAuthSession();
      if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("register.html")) {
        window.location.replace("login.html");
      }
      throw new Error("Session expired or unauthorized. Please log in.");
    }

    if (response.status === 403) {
      alert("Permission denied (403): You do not have permission to perform this action.");
      throw new Error("Permission denied (403).");
    }

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = "Request failed";
      if (data && typeof data === "object") {
        if (data.message) errorMessage = data.message;
        else if (data.errors) {
          errorMessage = Array.isArray(data.errors) 
            ? data.errors.join(", ") 
            : Object.values(data.errors).flat().join(", ");
        }
      } else if (typeof data === "string" && data.length > 0) {
        errorMessage = data;
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || "GET"} ${url}:`, err);
    throw err;
  }
}

// Expose globally for vanilla scripts
window.API_BASE_URL = API_BASE_URL;
window.AUTH_STORAGE_KEYS = AUTH_STORAGE_KEYS;
window.getToken = getToken;
window.getCurrentUser = getCurrentUser;
window.saveAuthSession = saveAuthSession;
window.logout = logout;
window.clearAuthSession = clearAuthSession;
window.isTokenExpired = isTokenExpired;
window.requireRole = requireRole;
window.apiFetch = apiFetch;

// Immediate execution auth guard: only login.html and register.html are public
(function enforceAuthGuard() {
  try {
    const path = (window.location.pathname || "").toLowerCase();
    const file = path.split("/").pop() || "";
    const isPublic = file === "login.html" || file === "register.html" || path.endsWith("/login.html") || path.endsWith("/register.html");
    if (!isPublic) {
      const token = getToken();
      const user = getCurrentUser();
      if (!token || !user) {
        clearAuthSession();
        window.location.replace("login.html");
      }
    }
  } catch (e) {
    try {
      const path = (window.location.pathname || "").toLowerCase();
      const file = path.split("/").pop() || "";
      const isPublic = file === "login.html" || file === "register.html" || path.endsWith("/login.html") || path.endsWith("/register.html");
      if (!isPublic) {
        window.location.replace("login.html");
      }
    } catch (_) { /* ignore */ }
  }
})();
