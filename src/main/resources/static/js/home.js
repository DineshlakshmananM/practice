// ===== HOME AUTH STATE =====
const user = JSON.parse(localStorage.getItem("user"));

const authButtons = document.getElementById("authButtons");
const profile = document.getElementById("profile");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileImage = document.getElementById("profileImage");
const profileMenu = document.getElementById("profileMenu");

// ===== USER LOGGED IN =====
if (user && user.username) {
    authButtons.style.display = "none";
    profile.style.display = "flex";

    profileName.textContent = user.username;
    profileEmail.textContent = user.email;

    profileImage.src = user.profileImage
        ? user.profileImage
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username);
}

// ===== PROFILE DROPDOWN =====
profile.addEventListener("click", () => {
    profileMenu.style.display =
        profileMenu.style.display === "block" ? "none" : "block";
});

// ===== START LEARNING =====
function startLearning() {
    if (user && user.username) {
        location.href = "learning.html";
    } else {
        location.href = "login.html";
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("user");
    location.reload();
}
