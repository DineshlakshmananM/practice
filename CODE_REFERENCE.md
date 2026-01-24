# TechySpine - Key Code Reference

## 🔐 Auth Guard (Most Important Pattern)

### ALL Protected Pages Use This

```javascript
// In learning.html, profile.html, etc.
<script src="js/api.js"></script>
<script>
/* ===== AUTH GUARD ===== */
const user = getCurrentUser();
console.log("Current user:", user);

if (!guardRoute()) {
    // guardRoute will redirect if not authenticated
    throw new Error("Not authenticated");
}

// Page initialization here
document.getElementById("userInfo").innerText = "Welcome, " + user.username;
</script>
```

---

## 📝 Login Page - Saving User

```javascript
// In login.html - handleLogin function
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, provider: "LOCAL" })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            document.getElementById("error").innerText = data.message;
            return;
        }

        // Ensure user object has ALL required fields
        const user = {
            id: data.user.id,                    // REQUIRED
            username: data.user.username,        // REQUIRED
            email: data.user.email,              // REQUIRED
            provider: data.user.provider || "LOCAL",
            profileImage: data.user.profileImage || null
        };

        // Validate required fields
        if (!user.id || !user.username || !user.email) {
            document.getElementById("error").innerText = "Invalid user data";
            return;
        }

        console.log("Saving user to localStorage:", user);
        localStorage.setItem("user", JSON.stringify(user));
        
        // 100ms delay ensures localStorage is written
        setTimeout(() => {
            location.href = "learning.html";
        }, 100);
    });
}
```

---

## 🛠️ Helper Functions (js/api.js)

### getCurrentUser()
```javascript
function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error("Error parsing user:", e);
        return null;
    }
}
```

### isAuthenticated()
```javascript
function isAuthenticated() {
    const user = getCurrentUser();
    return user && user.id;  // Check user.id, not user.username
}
```

### guardRoute() - AUTH GUARD
```javascript
function guardRoute(redirectTo = "login.html") {
    if (!isAuthenticated()) {
        localStorage.removeItem("user");
        location.href = redirectTo;
        return false;
    }
    return true;
}
```

### apiLogout()
```javascript
async function apiLogout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}
```

### apiUpdateProgress()
```javascript
async function apiUpdateProgress(userId, language, topic) {
    const res = await fetch(`${API_BASE}/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: userId,
            language: language,
            topic: topic,
            completedAt: new Date().toISOString()
        })
    });
    return res.json();
}
```

---

## 🎯 Learning Page - Content Loading

```javascript
// In learning.html
function loadContent(lang, topicFile) {
    const path = `content/${lang}/${topicFile}`;
    console.log("Loading content from:", path);
    
    document.getElementById("contentFrame").src = path;
    
    // Optional: Track progress
    apiUpdateProgress(user.id, lang, topicFile).catch(err => {
        console.error("Error updating progress:", err);
    });
}

// Example usage:
// loadContent('java', '01-introduction.html')
// → iframe loads: content/java/01-introduction.html
```

---

## 🏠 Home Page - Start Learning Button

```javascript
// In js/home.js
function startLearning() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user && user.username) {
        // User authenticated - go to learning
        location.href = "learning.html";
    } else {
        // Not authenticated - go to register
        location.href = "register.html";
    }
}

// In index.html
<button onclick="startLearning()">Start Learning</button>
```

---

## 👤 Profile Page - Load Stats

```javascript
// In profile.html
<script src="js/api.js"></script>
<script>
const user = getCurrentUser();
if (!guardRoute()) {
    throw new Error("Not authenticated");
}

// Load user profile data
fetch(`/api/user/profile/${user.id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("learningCount").innerText = data.learningCount ?? 0;
        document.getElementById("practiceCount").innerText = data.practiceCount ?? 0;
        document.getElementById("skillRating").innerText = data.skillRating ?? 0;
    })
    .catch(err => console.error("Error loading profile:", err));
</script>
```

---

## 🔗 API Endpoints

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "provider": "LOCAL"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "LOCAL",
    "profileImage": null
  }
}
```

### Register
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "provider": "LOCAL"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "LOCAL"
  }
}
```

### Update Progress
```javascript
POST /api/progress/update
Content-Type: application/json

{
  "userId": 1,
  "language": "java",
  "topic": "01-introduction.html",
  "completedAt": "2024-01-11T10:30:00Z"
}

Response:
{
  "success": true,
  "message": "Progress updated"
}
```

### Get Profile
```javascript
GET /api/user/profile/1

Response:
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "learningCount": 5,
  "practiceCount": 12,
  "skillRating": 4.5,
  "joinDate": "2024-01-11T10:00:00Z"
}
```

---

## 💾 localStorage Operations

### Save User
```javascript
const user = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    provider: "LOCAL",
    profileImage: null
};

localStorage.setItem("user", JSON.stringify(user));
```

### Get User
```javascript
const userStr = localStorage.getItem("user");
const user = JSON.parse(userStr);
// Use user.id, user.username, etc.
```

### Clear User
```javascript
localStorage.removeItem("user");
```

### Verify User Exists
```javascript
const user = getCurrentUser();
if (user && user.id) {
    console.log("User authenticated");
} else {
    console.log("User not authenticated");
}
```

---

## 🎨 Dark Theme CSS Variables

```css
:root {
    /* Primary Colors */
    --primary: #0ea5e9;        /* Cyan - buttons, links */
    --secondary: #06b6d4;      /* Teal - headings */
    --accent: #84a98c;         /* Sage Green - highlights */

    /* Background Colors */
    --bg-dark: #0f172a;        /* Very dark blue - main bg */
    --bg-darker: #020617;      /* Almost black - cards */
    --bg-light: #1e293b;       /* Dark slate - code blocks */

    /* Text Colors */
    --text-main: #e2e8f0;      /* Light gray - body text */
    --text-secondary: #cbd5e1; /* Medium gray - secondary */
    --text-muted: #94a3b8;     /* Muted gray - hints */

    /* Status Colors */
    --success: #22c55e;        /* Green */
    --warning: #f59e0b;        /* Amber */
    --error: #f87171;          /* Red */
}
```

---

## 🧪 Debugging Commands (Browser Console)

```javascript
// Check current user
JSON.parse(localStorage.getItem('user'))

// Check if authenticated
getCurrentUser()
isAuthenticated()

// Simulate logout
localStorage.removeItem('user')

// Simulate auth guard redirect
guardRoute()

// Check API response format
fetch('/api/auth/login', {...}).then(r => r.json()).then(console.log)

// Check content path
document.getElementById('contentFrame').src

// Monitor localStorage changes
JSON.parse(localStorage.getItem('user'))
```

---

## ✅ Implementation Checklist (Code)

- [✅] `getCurrentUser()` in api.js
- [✅] `isAuthenticated()` in api.js
- [✅] `guardRoute()` in api.js
- [✅] `apiLogout()` in api.js
- [✅] `apiUpdateProgress()` in api.js
- [✅] Auth guard in learning.html
- [✅] Auth guard in profile.html
- [✅] Content loading in learning.html
- [✅] startLearning() in home.js
- [✅] Logout button functionality
- [✅] 100ms delay in login.html
- [✅] User validation in login.html
- [✅] localStorage.setItem() with user object
- [✅] All pages import api.js
- [✅] CSS variables defined
- [✅] Dark theme colors applied

---

## 🚀 Quick Test in Browser

```javascript
// 1. In browser console, create test user
localStorage.setItem("user", JSON.stringify({
    id: 1,
    username: "testuser",
    email: "test@example.com",
    provider: "LOCAL",
    profileImage: null
}))

// 2. Check if works
getCurrentUser()
isAuthenticated()

// 3. Navigate to protected page
location.href = "learning.html"

// 4. Should work without redirect
// If redirects to login, check user object structure

// 5. Verify content loading
document.getElementById('contentFrame').src = 'content/java/01-introduction.html'

// 6. Test logout
apiLogout()
```

---

**All Code Patterns**: ✅ Ready to Use
**All Endpoints**: ✅ Defined  
**All Storage**: ✅ Configured
**All Guards**: ✅ Implemented
