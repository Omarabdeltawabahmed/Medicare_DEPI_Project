/**
 * MediCare Unified API Layer
 * Connects Medicare_Frontend to the MediCare ASP.NET Core Backend
 */

const API_BASE_URL = "http://localhost:5175";

const AUTH_STORAGE_KEYS = {
  token: "medicare_token",
  currentUser: "medicareCurrentUser",
  userRoles: "medicare_roles",
  userId: "medicare_user_id"
};

function getToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.token) || sessionStorage.getItem(AUTH_STORAGE_KEYS.token);
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
    Object.values(AUTH_STORAGE_KEYS).forEach(k => alternateStorage.removeItem(k));
  } catch (e) { /* ignore */ }

  if (authData.token) {
    primaryStorage.setItem(AUTH_STORAGE_KEYS.token, authData.token);
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
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  } catch (e) { /* ignore */ }
  window.location.href = "login.html";
}

function requireRole(allowedRoles) {
  const user = getCurrentUser();
  const token = getToken();

  if (!token || !user) {
    window.location.href = "login.html";
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
      window.location.href = "page4.html";
    } else if (userRoles.includes("Patient")) {
      window.location.href = "page3.html";
    } else {
      window.location.href = "index.html";
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
      try {
        Object.values(AUTH_STORAGE_KEYS).forEach(k => {
          localStorage.removeItem(k);
          sessionStorage.removeItem(k);
        });
      } catch (e) { /* ignore */ }
      if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("register.html")) {
        window.location.href = "login.html";
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
window.requireRole = requireRole;
window.apiFetch = apiFetch;
