// ======================
// LOGIN
// ======================

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error");

    errorDiv.innerText = "";

    if (!email || !password) {
        errorDiv.innerText = "Email and password are required";
        return;
    }

    apiLogin(email, password)
        .then(data => {
            if (!data.success) {
                errorDiv.innerText = data.message;
                return;
            }

            // Save user session
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard
            location.href = "dashboard.html";
        })
        .catch(() => {
            errorDiv.innerText = "Server error. Try again later.";
        });
}

// ======================
// REGISTER
// ======================

function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    msg.innerText = "";
    msg.className = "msg";

    if (!username || !email || !password) {
        msg.innerText = "All fields are required";
        msg.classList.add("error");
        return;
    }

    apiRegister(username, email, password)
        .then(data => {
            if (!data.success) {
                msg.innerText = data.message;
                msg.classList.add("error");
                return;
            }

            msg.innerText = data.message;
            msg.classList.add("success");

            setTimeout(() => {
                location.href = "login.html";
            }, 1500);
        })
        .catch(() => {
            msg.innerText = "Server error. Try again later.";
            msg.classList.add("error");
        });
}

// ======================
// GOOGLE LOGIN (UI HOOK)
// ======================

function googleLogin() {
    apiGoogleLogin();
}
