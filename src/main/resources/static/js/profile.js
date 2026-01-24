// ===== AUTH GUARD =====
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.id) {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// ===== DOM ELEMENTS =====
const usernameEl = document.getElementById("profileUsername");
const emailEl = document.getElementById("profileEmail");
const learningCountEl = document.getElementById("learningCount");
const practiceCountEl = document.getElementById("practiceCount");

// ===== LOAD PROFILE DATA =====
fetch(`/api/user/profile/${user.id}`)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
    })
    .then(data => {
        // Basic info
        if (usernameEl) usernameEl.innerText = data.username;
        if (emailEl) emailEl.innerText = data.email;

        // Stats
        if (learningCountEl) learningCountEl.innerText = data.learningCount;
        if (practiceCountEl) practiceCountEl.innerText = data.practiceCount;
    })
    .catch(err => {
        console.error(err);
        alert("Unable to load profile data");
    });

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}
