// ======================
// LOGIN
// ======================

function login() {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();
    const errorDiv = document.getElementById("error");
    const loginBtn = document.getElementById("loginBtn");

    // Hide error initially
    if (errorDiv) {
        errorDiv.style.display = "none";
        errorDiv.innerText = "";
    }

    if (!email || !password) {
        if (errorDiv) {
            errorDiv.innerText = "Email and password are required";
            errorDiv.style.display = "block";
        }
        return;
    }

    if (!email.includes("@")) {
        if (errorDiv) {
            errorDiv.innerText = "Please enter a valid email";
            errorDiv.style.display = "block";
        }
        return;
    }

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerText = "Logging in...";
    }

    apiLogin(email, password)
        .then(data => {
            if (!data || !data.success) {
                if (errorDiv) {
                    errorDiv.innerText = data?.message || "Invalid email or password";
                    errorDiv.style.display = "block";
                }
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerText = "Login to Account";
                }
                return;
            }

            // user already stored in apiLogin
            localStorage.setItem("sessionToken", Date.now().toString());

            location.href = "learning.html";
        })
        .catch(err => {
            console.error(err);
            if (errorDiv) {
                errorDiv.innerText = "Network error. Please try again.";
                errorDiv.style.display = "block";
            }
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerText = "Login to Account";
            }
        });
}

// ======================
// REGISTER
// ======================

function register() {
    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success");
    const registerBtn = document.getElementById("registerBtn");

    if (!errorDiv || !successDiv || !registerBtn) return;

    errorDiv.innerText = "";
    successDiv.innerText = "";
    errorDiv.classList.remove("show");
    successDiv.classList.remove("show");

    if (!username || !email || !password || !confirmPassword) {
        errorDiv.innerText = "All fields are required";
        errorDiv.classList.add("show");
        return;
    }

    if (!email.includes("@")) {
        errorDiv.innerText = "Please enter a valid email";
        errorDiv.classList.add("show");
        return;
    }

    if (password.length < 6) {
        errorDiv.innerText = "Password must be at least 6 characters";
        errorDiv.classList.add("show");
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.innerText = "Passwords do not match";
        errorDiv.classList.add("show");
        return;
    }

    registerBtn.disabled = true;
    registerBtn.innerText = "Creating account...";

    apiRegister(username, email, password, username)
        .then(data => {
            if (!data || !data.success) {
                errorDiv.innerText = data?.message || "Registration failed";
                errorDiv.classList.add("show");
                registerBtn.disabled = false;
                registerBtn.innerText = "Create Account";
                return;
            }

            successDiv.innerText = "Account created successfully! Redirecting to login...";
            successDiv.classList.add("show");

            setTimeout(() => {
                location.href = "auth.html";
            }, 1200);
        })
        .catch(() => {
            errorDiv.innerText = "Server error. Try again later.";
            errorDiv.classList.add("show");
            registerBtn.disabled = false;
            registerBtn.innerText = "Create Account";
        });
}

// ======================
// GOOGLE LOGIN / REGISTER (PLACEHOLDER)
// ======================

function googleLogin() {
    alert("Google login not implemented yet");
}

function googleRegister() {
    alert("Google register not implemented yet");
}
