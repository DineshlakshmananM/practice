function logout() {
    // Call logout API
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).finally(() => {
        // Clear local storage
        localStorage.removeItem("user");
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("authToken");
        // Redirect to index page
        location.href = "index.html";
    });
}
