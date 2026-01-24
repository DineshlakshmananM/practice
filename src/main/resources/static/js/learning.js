// ======================
// AUTH GUARD
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.id || !user.username) {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// ======================
// USER INFO
// ======================

const userInfoEl = document.getElementById("userInfo");
if (userInfoEl) {
    userInfoEl.innerText = `Welcome, ${user.username}`;
}

// ======================
// ELEMENTS
// ======================

const langButtons = document.querySelectorAll(".lang-btn");
const topicGroups = document.querySelectorAll(".topics");
const contentDiv = document.getElementById("content");

// ======================
// INITIAL STATE
// ======================

topicGroups.forEach(group => {
    group.style.display = "none";
});

// ======================
// LANGUAGE CLICK LOGIC
// ======================

langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedLang = btn.dataset.lang;

        topicGroups.forEach(group => {
            group.style.display = "none";
        });

        const targetGroup = document.getElementById(selectedLang);
        if (targetGroup) {
            targetGroup.style.display = "block";
        }
    });
});

// ======================
// TOPIC CLICK LOGIC
// ======================

document.querySelectorAll(".topics button").forEach(btn => {
    btn.addEventListener("click", () => {
        const file = btn.dataset.file;
        if (file) {
            loadContent(file);
        }
    });
});

// ======================
// LOAD CONTENT
// ======================

function loadContent(file) {
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error("Content not found");
            return res.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;

            // 🔒 future hook: progress tracking
            // trackLearning(user.id, file);
        })
        .catch(() => {
            contentDiv.innerHTML =
                "<p style='color:#94a3b8'>Unable to load content.</p>";
        });
}
