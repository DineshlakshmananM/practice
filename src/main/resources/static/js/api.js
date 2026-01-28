// ==========================
// BASE CONFIG & CACHE
// ==========================

const API_BASE = "/api";
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let requestQueue = Promise.resolve();

// Cache management
function setCache(key, value) {
    apiCache.set(key, {
        data: value,
        timestamp: Date.now()
    });
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
    if (key) apiCache.delete(key);
    else apiCache.clear();
}

// Queue requests to prevent race conditions
function queueRequest(fn) {
    requestQueue = requestQueue.then(fn).catch(e => {
        console.error("Queued request error:", e);
        return Promise.reject(e);
    });
    return requestQueue;
}

// ==========================
// AUTH APIs (OPTIMIZED)
// ==========================

async function apiLogin(email, password) {
    return queueRequest(async () => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                provider: "LOCAL"
            })
        });

        const data = await res.json();
        if (data.success) {
            clearCache(); // Clear all cache on login
        }
        return data;
    });
}

async function apiRegister(username, email, password) {
    return queueRequest(async () => {
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
    });
}

// ==========================
// USER PROFILE APIs (CACHED)
// ==========================

async function apiGetUserProfile(userId) {
    const cacheKey = `user_profile_${userId}`;
    const cached = getCache(cacheKey);
    
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/user/profile/${userId}`);
    const data = await res.json();
    
    if (data.success) {
        setCache(cacheKey, data);
    }
    return data;
}

// ==========================
// LEARNING / PRACTICE APIs (OPTIMIZED)
// ==========================

async function apiGetLearningProgress(userId) {
    const cacheKey = `learning_progress_${userId}`;
    const cached = getCache(cacheKey);
    
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/user/progress/${userId}`);
    const data = await res.json();
    
    if (data.success) {
        setCache(cacheKey, data);
    }
    return data;
}

async function apiGetPracticeHistory(userId) {
    const cacheKey = `practice_history_${userId}`;
    const cached = getCache(cacheKey);
    
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/user/practice/${userId}`);
    const data = await res.json();
    
    if (data.success) {
        setCache(cacheKey, data);
    }
    return data;
}

async function apiUpdateProgress(userId, language, topic) {
    clearCache(); // Clear cache on update
    
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
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        console.error("Logout error:", e);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    location.href = "index.html";
}

// ==========================
// GOOGLE LOGIN (OPTIMIZED)
// ==========================

function apiGoogleLogin() {
    // Google OAuth callback - initiates the OAuth flow
    window.location.href = `${API_BASE}/auth/google`;
}

async function handleGoogleCallback(code) {
    return queueRequest(async () => {
        const res = await fetch(`${API_BASE}/auth/google-callback?code=${code}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();
        if (data.success) {
            clearCache();
        }
        return data;
    });
}

// Initialize Google Sign-In (Optional - requires Google API key)
function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE',
            callback: handleGoogleSignInResponse
        });
    }
}

function handleGoogleSignInResponse(response) {
    // Send token to backend for verification
    const requestBody = {
        token: response.credential
    };
    
    fetch(`${API_BASE}/auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("sessionToken", new Date().getTime());
            setTimeout(() => {
                location.href = "dashboard.html";
            }, 300);
        } else {
            alert(data.message || "Google login failed");
        }
    })
    .catch(err => {
        console.error("Google sign-in error:", err);
        alert("Google login failed. Please try again.");
    });
}

// Handle OAuth redirect callback (for server-side OAuth flow)
function handleOAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
        console.error("OAuth error:", error);
        alert("Google login was cancelled or failed: " + error);
        window.location.href = "login.html";
        return;
    }
    
    if (code) {
        // Exchange code for tokens
        fetch(`${API_BASE}/auth/google-callback?code=${code}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // For full OAuth flow, you would implement token exchange here
                // Then redirect to dashboard
                alert("Google login successful! Redirecting...");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Google login failed");
                window.location.href = "login.html";
            }
        })
        .catch(err => {
            console.error("OAuth callback error:", err);
            alert("Google login failed. Please try again.");
            window.location.href = "login.html";
        });
    }
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