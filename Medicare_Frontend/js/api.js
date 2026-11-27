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
  return localStorage.getItem(AUTH_STORAGE_KEYS.token);
}

function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveAuthSession(authData) {
  if (authData.token) {
    localStorage.setItem(AUTH_STORAGE_KEYS.token, authData.token);
  }
  if (authData.userId) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userId, authData.userId);
  }
  if (authData.roles) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userRoles, JSON.stringify(authData.roles));
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
  localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(user));
  return user;
}

function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
  localStorage.removeItem(AUTH_STORAGE_KEYS.userRoles);
  localStorage.removeItem(AUTH_STORAGE_KEYS.userId);
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
  const hasAllowedRole = allowedRoles.some(r => userRoles.includes(r));

  if (!hasAllowedRole) {
    alert("Access Denied: You do not have permission to view this page.");
    if (userRoles.includes("Admin")) {
      window.location.href = "page5.html";
    } else if (userRoles.includes("Doctor")) {
      window.location.href = "page4.html";
    } else {
      window.location.href = "page3.html";
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
      localStorage.removeItem(AUTH_STORAGE_KEYS.token);
      localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
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
