function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}
