// ======================
// LOGIN
// ======================

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error");
    const loginBtn = document.getElementById("loginBtn");

    errorDiv.innerText = "";

    if (!email || !password) {
        errorDiv.innerText = "Email and password are required";
        return;
    }

    if (!email.includes('@')) {
        errorDiv.innerText = "Please enter a valid email";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    apiLogin(email, password)
        .then(data => {
            if (!data.success) {
                errorDiv.innerText = data.message || "Invalid email or password";
                loginBtn.disabled = false;
                loginBtn.innerText = "Login";
                return;
            }

            // Save user session
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("sessionToken", new Date().getTime());

            // Redirect to dashboard
            setTimeout(() => {
                location.href = "dashboard.html";
            }, 300);
        })
        .catch((err) => {
            console.error("Login error:", err);
            errorDiv.innerText = "Network error. Please try again.";
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
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
