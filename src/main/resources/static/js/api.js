// ==========================
// BASE CONFIG & API CACHE
// ==========================

const API_BASE = "/api";
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;
let requestQueue = Promise.resolve();

function setCache(key, value) {
    apiCache.set(key, { data: value, timestamp: Date.now() });
}

function getCache(key) {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    apiCache.delete(key);
    return null;
}

function clearCache(key) {
    key ? apiCache.delete(key) : apiCache.clear();
}

function queueRequest(fn) {
    requestQueue = requestQueue.then(fn).catch(console.error);
    return requestQueue;
}

// ==========================
// AUTH APIs
// ==========================

async function apiLogin(email, password) {
    return queueRequest(async () => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password, provider: "LOCAL" })
        });
        const data = await res.json();
        if (data?.success) {
            clearCache();
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data;
    });
}

async function apiRegister(username, email, password, fullName) {
    return queueRequest(async () => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, fullName, provider: "LOCAL" })
        });
        return res.json();
    });
}

async function apiLogout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } finally {
        localStorage.clear();
        location.href = "index.html";
    }
}

// ==========================
// USER PROFILE
// ==========================

async function apiGetUserProfile(userId) {
    const key = `user_${userId}`;
    const cached = getCache(key);
    if (cached) return cached;

    const res = await fetch(`${API_BASE}/user/profile/${userId}`);
    const data = await res.json();
    if (data?.success) setCache(key, data);
    return data;
}

async function apiUpdateProfile(userId, payload) {
    clearCache(`user_${userId}`);
    const res = await fetch(`${API_BASE}/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

// ==========================
// LEARNING
// ==========================

async function apiGetLearningProgress(userId) {
    const key = `progress_${userId}`;
    const cached = getCache(key);
    if (cached) return cached;

    const res = await fetch(`${API_BASE}/user/progress/${userId}`);
    const data = await res.json();
    if (data?.success) setCache(key, data);
    return data;
}

async function apiUpdateProgress(userId, language, topic, completed) {
    clearCache();
    const res = await fetch(`${API_BASE}/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, language, topic, completed })
    });
    return res.json();
}

// ==========================
// PRACTICE
// ==========================

async function apiGetProblems(userId, difficulty, language) {
    const params = new URLSearchParams({ userId, difficulty, language });
    const res = await fetch(`${API_BASE}/practice/problems?${params}`);
    return res.json();
}

async function apiSubmitSolution(userId, problemId, code, language) {
    const res = await fetch(`${API_BASE}/practice/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, problemId, code, language })
    });
    return res.json();
}

// ==========================
// ADMIN
// ==========================

async function apiAdminGetLanguages() {
    return (await fetch(`${API_BASE}/admin/languages`)).json();
}

async function apiAdminAddLanguage(data) {
    return (await fetch(`${API_BASE}/admin/languages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })).json();
}

async function apiAdminDeleteLanguage(id) {
    return (await fetch(`${API_BASE}/admin/languages/${id}`, { method: "DELETE" })).json();
}

// ==========================
// HELPERS
// ==========================

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
}

function isAuthenticated() {
    return !!getCurrentUser()?.id;
}

function isAdmin() {
    return getCurrentUser()?.role === "ADMIN";
}

function guardRoute() {
    if (!isAuthenticated()) {
        location.href = "login.html";
        return false;
    }
    return true;
}

function guardAdminRoute() {
    if (!isAuthenticated()) {
        location.href = "login.html";
        return false;
    }
    if (!isAdmin()) {
        location.href = "dashboard.html";
        return false;
    }
    return true;
}
