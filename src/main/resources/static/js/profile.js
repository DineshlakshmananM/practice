/**
 * Profile Page JavaScript
 * LeetCode-style profile with stats and activity
 */

// ======================
// AUTH GUARD
// ======================
(function () {
    const user = localStorage.getItem("user");
    if (!user) {
        location.href = "login.html";
        return;
    }
    window.user = JSON.parse(user);
})();

// ======================
// DATA
// ======================
let userData = {
    problemsSolved: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    learningStreak: 0,
    topicsCompleted: 0,
    globalRank: null,
    skills: ""
};

let userSubmissions = {};

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    initializeProfile();
    loadActivityHeatmap();
    loadRecentActivity();
});

// ======================
// USER DATA
// ======================
function loadUserData() {
    const saved = localStorage.getItem("userData");
    if (saved) userData = JSON.parse(saved);

    const subs = localStorage.getItem("userSubmissions");
    if (subs) {
        userSubmissions = JSON.parse(subs);

        let solved = 0;
        let attempts = 0;

        Object.values(userSubmissions).forEach(s => {
            attempts += s.attempts || 0;
            if (s.solved) solved++;
        });

        userData.problemsSolved = solved;
        userData.totalSubmissions = attempts;
        userData.acceptedSubmissions = solved;
    }

    saveUserData();
}

function saveUserData() {
    localStorage.setItem("userData", JSON.stringify(userData));
}

// ======================
// PROFILE
// ======================
function initializeProfile() {
    const u = window.user;
    const name = u.fullName || u.username;
    const initial = name.charAt(0).toUpperCase();

    document.getElementById("profileName").innerText = name;
    document.getElementById("profileUsername").innerText = "@" + u.username;
    document.getElementById("profileAvatar").innerText = initial;
    document.getElementById("avatarInitial").innerText = initial;

    document.getElementById("streakCount").innerText =
        `${userData.learningStreak} Day Streak`;
    document.getElementById("globalRank").innerText =
        userData.globalRank ? `#${userData.globalRank}` : "#--";

    updateStats();
}

// ======================
// STATS
// ======================
function updateStats() {
    const rate = userData.totalSubmissions
        ? Math.round((userData.acceptedSubmissions / userData.totalSubmissions) * 100)
        : 0;

    document.getElementById("totalSolved").innerText = userData.problemsSolved;
    document.getElementById("totalSubmissions").innerText = userData.totalSubmissions;
    document.getElementById("acceptanceRate").innerText = rate + "%";
    document.getElementById("topicsCompleted").innerText = userData.topicsCompleted;
    document.getElementById("easyCount").innerText = userData.easySolved;
    document.getElementById("mediumCount").innerText = userData.mediumSolved;
    document.getElementById("hardCount").innerText = userData.hardSolved;
    document.getElementById("solvedCount").innerText = userData.problemsSolved;

    updateProgressCircle();
}

function updateProgressCircle() {
    const circle = document.getElementById("progressCircle");
    if (!circle) return;

    const total = 500;
    const percent = Math.min((userData.problemsSolved / total) * 100, 100);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
}

// ======================
// HEATMAP
// ======================
function loadActivityHeatmap() {
    const box = document.getElementById("heatmap");
    if (!box) return;

    let html = "";
    for (let i = 0; i < 364; i++) {
        const level = Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0;
        html += `<div class="heatmap-day level-${level}"></div>`;
    }
    box.innerHTML = html;
}

// ======================
// RECENT ACTIVITY
// ======================
function loadRecentActivity() {
    const list = document.getElementById("activityList");
    if (!list) return;

    list.innerHTML = `
        <div class="activity-item"><div class="activity-icon solved">✓</div><div class="activity-info"><div class="activity-title">Solved Two Sum</div><div class="activity-meta">Today</div></div></div>
        <div class="activity-item"><div class="activity-icon submit">📤</div><div class="activity-info"><div class="activity-title">Submitted Add Two Numbers</div><div class="activity-meta">Yesterday</div></div></div>
    `;
}

// ======================
// LOGOUT
// ======================
function logout() {
    localStorage.clear();
    location.href = "index.html";
}

// ======================
// PRACTICE SYNC
// ======================
window.addEventListener("message", e => {
    if (e.data?.type === "practiceUpdate") {
        loadUserData();
        updateStats();
    }
});
