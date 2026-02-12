/**
 * Admin Dashboard JavaScript
 * Manage languages, topics, questions, and users
 */

// ======================
// AUTH CHECK
// ======================
(function () {
    const user = localStorage.getItem("user");

    if (!user) {
        location.href = "login.html";
        return;
    }

    let parsedUser;
    try {
        parsedUser = JSON.parse(user);
    } catch {
        localStorage.removeItem("user");
        location.href = "login.html";
        return;
    }

    if (!parsedUser.role) {
        parsedUser.role = "ADMIN";
        localStorage.setItem("user", JSON.stringify(parsedUser));
    }

    window.user = parsedUser;
})();

// ======================
// DATA
// ======================
let languages = [
    { id: 1, name: "Java", slug: "java", icon: "☕", topics: 19, status: "active" },
    { id: 2, name: "Python", slug: "python", icon: "🐍", topics: 19, status: "active" },
    { id: 3, name: "C", slug: "c", icon: "⚡", topics: 12, status: "active" },
    { id: 4, name: "C++", slug: "cpp", icon: "🚀", topics: 10, status: "active" },
    { id: 5, name: "HTML", slug: "html", icon: "🌐", topics: 10, status: "active" },
    { id: 6, name: "CSS", slug: "css", icon: "🎨", topics: 13, status: "active" },
    { id: 7, name: "JavaScript", slug: "javascript", icon: "⚛️", topics: 16, status: "active" },
    { id: 8, name: "MySQL", slug: "mysql", icon: "🗄️", topics: 13, status: "active" }
];

let topics = [];
let questions = [];
let users = [];
let submissions = 0;

// ======================
// INITIALIZATION
// ======================
document.addEventListener("DOMContentLoaded", () => {
    initializeAdmin();
    loadAllData();
    setupEventListeners();
});

function initializeAdmin() {
    const adminNameEl = document.getElementById("adminName");
    const adminAvatarEl = document.getElementById("adminAvatar");

    if (!adminNameEl || !adminAvatarEl) return;

    const name = window.user.fullName || window.user.username || "Admin";
    adminNameEl.textContent = name;
    adminAvatarEl.textContent = name.charAt(0).toUpperCase();
}

function loadAllData() {
    loadLanguages();
    loadTopics();
    loadQuestions();
    loadUsers();
    updateStats();
}

function updateStats() {
    document.getElementById("totalUsers")?.innerText = users.length;
    document.getElementById("totalLanguages")?.innerText = languages.length;
    document.getElementById("totalQuestions")?.innerText = questions.length;
    document.getElementById("totalSubmissions")?.innerText = submissions;
}

function setupEventListeners() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            switchSection(item.dataset.section);
        });
    });
}

// ======================
// NAVIGATION
// ======================
function switchSection(sectionName) {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    document.querySelector(`.nav-item[data-section="${sectionName}"]`)?.classList.add("active");

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(`${sectionName}Section`)?.classList.add("active");
}

// ======================
// LANGUAGES
// ======================
function loadLanguages() {
    const tbody = document.getElementById("languagesTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    languages.forEach(lang => {
        tbody.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${lang.icon}</td>
                <td>${lang.name}</td>
                <td>${lang.slug}</td>
                <td>${lang.topics}</td>
                <td>${lang.status}</td>
                <td>
                    <button onclick="editLanguage(${lang.id})">Edit</button>
                    <button onclick="deleteLanguage(${lang.id})">Delete</button>
                </td>
            </tr>`
        );
    });
}

function addLanguage() {
    const name = document.getElementById("langName")?.value.trim();
    const slug = document.getElementById("langSlug")?.value.trim().toLowerCase();

    if (!name || !slug) return;

    languages.push({
        id: Date.now(),
        name,
        slug,
        icon: "📚",
        topics: 0,
        status: "active"
    });

    loadLanguages();
    updateStats();
    closeModal("languageModal");
}

function editLanguage(id) {
    const lang = languages.find(l => l.id === id);
    if (!lang) return;
    const name = prompt("Edit language name", lang.name);
    if (name) {
        lang.name = name;
        loadLanguages();
    }
}

function deleteLanguage(id) {
    languages = languages.filter(l => l.id !== id);
    loadLanguages();
    updateStats();
}

// ======================
// TOPICS
// ======================
function loadTopics() {
    const tbody = document.getElementById("topicsTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    topics.forEach(t => {
        tbody.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${t.language}</td>
                <td>${t.name}</td>
                <td>${t.file}</td>
                <td>${t.order}</td>
                <td>
                    <button onclick="editTopic(${t.id})">Edit</button>
                    <button onclick="deleteTopic(${t.id})">Delete</button>
                </td>
            </tr>`
        );
    });
}

function addTopic() {
    const language = document.getElementById("topicLanguage")?.value;
    const name = document.getElementById("topicName")?.value.trim();
    const file = document.getElementById("topicFile")?.value.trim();

    if (!language || !name || !file) return;

    topics.push({
        id: Date.now(),
        language,
        slug: language,
        name,
        file,
        order: topics.length + 1
    });

    loadTopics();
    closeModal("topicModal");
}

function editTopic(id) {
    const t = topics.find(t => t.id === id);
    if (!t) return;
    const name = prompt("Edit topic", t.name);
    if (name) {
        t.name = name;
        loadTopics();
    }
}

function deleteTopic(id) {
    topics = topics.filter(t => t.id !== id);
    loadTopics();
}

// ======================
// QUESTIONS
// ======================
function loadQuestions() {
    const tbody = document.getElementById("questionsTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    questions.forEach(q => {
        tbody.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${q.number}</td>
                <td>${q.title}</td>
                <td>${q.difficulty}</td>
                <td>${q.tags}</td>
                <td>${q.acceptance}%</td>
                <td>
                    <button onclick="editQuestion(${q.id})">Edit</button>
                    <button onclick="deleteQuestion(${q.id})">Delete</button>
                </td>
            </tr>`
        );
    });
}

// ======================
// USERS
// ======================
function loadUsers() {
    const tbody = document.getElementById("usersTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    users.forEach(u => {
        tbody.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>${u.problemsSolved}</td>
                <td>${u.joined}</td>
                <td>
                    <button onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>`
        );
    });
}

function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    loadUsers();
    updateStats();
}

// ======================
// MODALS
// ======================
function openModal(id) {
    document.getElementById(id)?.classList.add("show");
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove("show");
}

// ======================
// LOGOUT
// ======================
function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}
