/**
 * Practice Page JavaScript
 * LeetCode-style coding problem solving interface
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
// DATA (FIXED)
// ======================
let problems = [];
let currentProblem = null;
let currentLanguage = "java";
let userSubmissions = {};

// ======================
// INITIALIZATION
// ======================
document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    setupEventListeners();
    loadUserData();
});

function initializePage() {
    if (window.user) {
        const initial = (window.user.fullName || window.user.username)
            .charAt(0)
            .toUpperCase();
        document.getElementById("avatarInitial").innerText = initial;
        document.getElementById("streakCount").innerText =
            `${window.user.learningStreak || 0} Day Streak`;
    }

    problems = sampleProblems;
    renderProblemList();

    if (problems.length) {
        selectProblem(problems[0], null); // ✅ FIX
    }
}

function setupEventListeners() {
    document.querySelectorAll(".workspace-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            switchTab(tab.dataset.tab);
        });
    });

    document.querySelectorAll(".filter-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            filterProblems(tab.dataset.difficulty);
            document.querySelectorAll(".filter-tab")
                .forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    document.getElementById("languageSelect")?.addEventListener("change", e => {
        currentLanguage = e.target.value;
        loadTemplate();
    });
}

function loadUserData() {
    const saved = localStorage.getItem("userSubmissions");
    userSubmissions = saved ? JSON.parse(saved) : {};
}

// ======================
// PROBLEM LIST
// ======================
function renderProblemList(filter = "all") {
    const container = document.getElementById("problemList");
    container.innerHTML = "";

    const list = filter === "all"
        ? problems
        : problems.filter(p => p.difficulty === filter);

    list.forEach(problem => {
        const div = document.createElement("div");
        div.className = "problem-item";
        if (userSubmissions[problem.id]?.solved) div.classList.add("solved");
        if (currentProblem?.id === problem.id) div.classList.add("active");

        div.innerHTML = `
            <div class="problem-title">${problem.number}. ${problem.title}</div>
            <div class="problem-meta">
                <span class="difficulty ${problem.difficulty}">
                    ${problem.difficulty}
                </span>
            </div>
        `;

        div.addEventListener("click", e => selectProblem(problem, e)); // ✅ FIX
        container.appendChild(div);
    });
}

function filterProblems(difficulty) {
    renderProblemList(difficulty);
}

function selectProblem(problem, event) {
    currentProblem = problem;

    document.querySelectorAll(".problem-item")
        .forEach(i => i.classList.remove("active"));
    if (event?.currentTarget) event.currentTarget.classList.add("active"); // ✅ FIX

    document.getElementById("problemTitle").innerText =
        `${problem.number}. ${problem.title}`;
    document.getElementById("problemAcceptance").innerText =
        `${problem.acceptance}% Acceptance`;
    document.getElementById("problemTopics").innerText =
        problem.tags.join(", ");
    document.getElementById("descriptionContent").innerHTML =
        problem.description;

    const diff = document.getElementById("problemDifficulty");
    diff.innerText = problem.difficulty;
    diff.className = `difficulty ${problem.difficulty}`;

    switchTab("description");
    loadTemplate();
    renderSubmissions();
}

function loadTemplate() {
    if (!currentProblem) return;
    document.getElementById("codeArea").value =
        currentProblem.templates[currentLanguage]
        || currentProblem.templates.java;
}

// ======================
// TABS
// ======================
function switchTab(tab) {
    document.querySelectorAll(".workspace-tab")
        .forEach(t => t.classList.remove("active"));
    document.querySelector(`.workspace-tab[data-tab="${tab}"]`)
        ?.classList.add("active");

    document.getElementById("descriptionTab").style.display =
        tab === "description" ? "block" : "none";
    document.getElementById("solutionTab").style.display =
        tab === "solution" ? "flex" : "none";
    document.getElementById("submissionsTab").style.display =
        tab === "submissions" ? "block" : "none";
}

// ======================
// OUTPUT HELPERS
// ======================
function appendOutput(text, error = false) {
    const out = document.getElementById("outputContent");
    out.innerHTML += `<div class="${error ? "output-error" : "output-success"}">${text}</div>`;
    out.scrollTop = out.scrollHeight;
}

// ======================
// SUBMISSIONS
// ======================
function renderSubmissions() {
    const box = document.getElementById("submissionsList");
    const sub = userSubmissions[currentProblem?.id];

    if (!sub) {
        box.innerHTML = "<p>No submissions yet</p>";
        return;
    }

    box.innerHTML = `
        <strong>Status:</strong> ${sub.solved ? "Solved" : "Attempted"}<br>
        <strong>Attempts:</strong> ${sub.attempts}
    `;
}

// ======================
// LOGOUT
// ======================
function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}
