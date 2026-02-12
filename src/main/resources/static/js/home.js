/**
 * Home Page JavaScript
 * Landing page functionality and authentication
 */

// ======================
// AUTH CHECK
// ======================
(function () {
    const user = localStorage.getItem("user");
    if (user) {
        updateNavForLoggedInUser(JSON.parse(user));
    }
})();

// ======================
// NAVIGATION
// ======================
function updateNavForLoggedInUser(user) {
    const navButtons = document.querySelector(".nav-buttons");
    if (!navButtons) return;

    navButtons.innerHTML = `
        <a href="profile.html" class="profile-link" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
            <div class="nav-avatar" style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;font-size:14px;">
                ${(user.fullName || user.username).charAt(0).toUpperCase()}
            </div>
            <span style="color:var(--text-main);font-weight:500;">
                ${user.fullName || user.username}
            </span>
        </a>
        <button class="btn btn-outline" onclick="logout()">Logout</button>
    `;
}

// ======================
// MODALS
// ======================
function openAuthModal(tab = "login") {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    modal.classList.add("show");
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    modal.classList.remove("show");
}

function switchAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`)?.classList.add("active");

    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    document.getElementById(`${tab}Form`)?.classList.add("active");

    const title = document.getElementById("authModalTitle");
    const subtitle = document.getElementById("authModalSubtitle");

    if (!title || !subtitle) return;

    if (tab === "login") {
        title.innerText = "Welcome Back";
        subtitle.innerText = "Log in to continue your learning journey";
    } else {
        title.innerText = "Create Account";
        subtitle.innerText = "Start your coding journey today";
    }
}

document.getElementById("authModal")?.addEventListener("click", e => {
    if (e.target.id === "authModal") closeAuthModal();
});

// ======================
// AUTH FORMS (DEMO)
// ======================
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
        alert("Enter valid credentials");
        return;
    }

    const user = {
        id: Date.now(),
        username: email.split("@")[0],
        fullName: email.split("@")[0],
        email,
        role: "USER"
    };

    localStorage.setItem("user", JSON.stringify(user));
    closeAuthModal();
    location.href = "learning.html";
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("regName")?.value.trim();
    const username = document.getElementById("regUsername")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const password = document.getElementById("regPassword")?.value;

    if (!name || !username || !email || !password) {
        alert("Fill all fields");
        return;
    }

    const user = {
        id: Date.now(),
        username,
        fullName: name,
        email,
        role: "USER"
    };

    localStorage.setItem("user", JSON.stringify(user));
    closeAuthModal();
    location.href = "learning.html";
}

// ======================
// LOGOUT
// ======================
function logout() {
    localStorage.clear();
    location.reload();
}

// ======================
// SCROLL + ANIMATION
// ======================
function animateOnScroll() {
    document.querySelectorAll(".feature-card,.language-card").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".feature-card,.language-card").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all .6s ease";
    });
    animateOnScroll();
    window.addEventListener("scroll", animateOnScroll);
});

// ======================
// START LEARNING
// ======================
function startLearning() {
    location.href = localStorage.getItem("user") ? "learning.html" : "login.html";
}
