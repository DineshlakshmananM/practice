// ==========================
// BASE CONFIG
// ==========================

const API_BASE = "/api";

// ==========================
// AUTH APIs
// ==========================

async function apiLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
            provider: "LOCAL"
        })
    });

    return res.json();
}

async function apiRegister(username, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            provider: "LOCAL"
        })
    });

    return res.json();
}

// ==========================
// USER PROFILE APIs
// ==========================

async function apiGetUserProfile(userId) {
    const res = await fetch(`${API_BASE}/user/profile/${userId}`);
    return res.json();
}

// ==========================
// LEARNING / PRACTICE APIs
// ==========================

async function apiGetLearningProgress(userId) {
    const res = await fetch(`${API_BASE}/user/progress/${userId}`);
    return res.json();
}

async function apiGetPracticeHistory(userId) {
    const res = await fetch(`${API_BASE}/user/practice/${userId}`);
    return res.json();
}

async function apiUpdateProgress(userId, language, topic) {
    const res = await fetch(`${API_BASE}/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: userId,
            language: language,
            topic: topic,
            completedAt: new Date().toISOString()
        })
    });
    return res.json();
}

async function apiLogout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// ==========================
// GOOGLE LOGIN (FUTURE)
// ==========================

function apiGoogleLogin() {
    // OAuth backend endpoint will plug in here later
    window.location.href = `${API_BASE}/auth/google`;
}
// ==========================
// HELPER FUNCTIONS
// ==========================

function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error("Error parsing user:", e);
        return null;
    }
}

function isAuthenticated() {
    const user = getCurrentUser();
    return user && user.id;
}

function guardRoute(redirectTo = "login.html") {
    if (!isAuthenticated()) {
        localStorage.removeItem("user");
        location.href = redirectTo;
        return false;
    }
    return true;
}