# TechySpine Architecture - Visual Guide & Quick Reference

## 🏗️ Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  index.html │  │ register.html │  │  login.html  │            │
│  │  (Landing)  │  │ (Sign up)     │  │ (Auth)       │            │
│  └──────┬──────┘  └────────┬───────┘  └──────┬───────┘            │
│         │                  │                 │                   │
│         └──────────────────┴─────────────────┘                   │
│                      ↓ (on login success)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │            PROTECTED PAGES (Auth Guard)              │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │                                                       │        │
│  │  ┌──────────────┐        ┌──────────────┐           │        │
│  │  │ learning.html│        │ profile.html │           │        │
│  │  │ (Main UI)    │        │ (Stats)      │           │        │
│  │  └──────┬───────┘        └──────────────┘           │        │
│  │         │                                            │        │
│  │  Loads: /content/${lang}/${topic}.html               │        │
│  │         └─> /content/java/01-introduction.html      │        │
│  │         └─> /content/c/01-introduction.html         │        │
│  │         └─> /content/cpp/01-introduction.html       │        │
│  │         └─> /content/mysql/01-introduction.html     │        │
│  │                                                       │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │  SHARED UTILITIES (js/api.js)                        │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │  • getCurrentUser()       → Parse user from storage  │        │
│  │  • isAuthenticated()      → Check user.id exists     │        │
│  │  • guardRoute()           → Protect pages            │        │
│  │  • apiLogout()            → Clear session            │        │
│  │  • apiUpdateProgress()    → Track learning           │        │
│  │  • API functions for auth/user/progress             │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │  CSS THEME SYSTEM                                    │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │  • theme.css     → Dark theme + CSS variables       │        │
│  │  • dashboard.css → Layout styling                   │        │
│  │  • profile.css   → Profile page styling             │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (REST APIs)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────┐           │
│  │  Spring Boot 3.5.10 + Spring Security 6.4.3      │           │
│  └─────────────────────┬─────────────────────────────┘           │
│                        │                                         │
│  ┌─────────────────────┴──────────────────────────┐              │
│  │  CONTROLLERS (REST Endpoints)                  │              │
│  ├────────────────────────────────────────────────┤              │
│  │  POST   /api/auth/register                    │              │
│  │  POST   /api/auth/login                       │              │
│  │  GET    /api/auth/google                      │              │
│  │  GET    /api/user/profile/{userId}            │              │
│  │  POST   /api/progress/update                  │              │
│  │  GET    /api/user/progress/{userId}           │              │
│  └────────────────────────────────────────────────┘              │
│                        │                                         │
│  ┌─────────────────────┴──────────────────────────┐              │
│  │  SERVICES (Business Logic)                     │              │
│  ├────────────────────────────────────────────────┤              │
│  │  • UserService (auth, profile)                │              │
│  │  • AuthService (login, register, validation)  │              │
│  │  • ProgressService (track learning)           │              │
│  └────────────────────────────────────────────────┘              │
│                        │                                         │
│  ┌─────────────────────┴──────────────────────────┐              │
│  │  JPA ENTITIES (Data Models)                    │              │
│  ├────────────────────────────────────────────────┤              │
│  │  • User (id, username, email, password)       │              │
│  │  • LearningProgress (userId, topic, date)     │              │
│  │  • PracticeHistory (userId, problem, score)   │              │
│  └────────────────────────────────────────────────┘              │
│                        │                                         │
│  ┌─────────────────────┴──────────────────────────┐              │
│  │  DATABASE (MySQL 8.0)                          │              │
│  ├────────────────────────────────────────────────┤              │
│  │  • users table                                │              │
│  │  • learning_progress table                    │              │
│  │  • practice_history table                     │              │
│  └────────────────────────────────────────────────┘              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

```
START
  ↓
┌─────────────────────────┐
│  Visit index.html       │
│  (Landing Page)         │
└────────┬────────────────┘
         ↓
    ┌────────────────────┐
    │  Logged in?         │
    └────┬───────┬────────┘
         │ NO    │ YES
         ↓       ↓
    [Register/Login]  [Show Profile]
         ↓              ↓
    ┌─────────────────────────┐
    │ Click "Start Learning"  │
    └────────┬────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  learning.html                 │
    │  (Auth Guard: Check user.id)   │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Not Authenticated?            │
    │  YES → Redirect to login.html  │
    │  NO → Continue                 │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Display Languages:            │
    │  • Java                        │
    │  • C                           │
    │  • C++                         │
    │  • MySQL                       │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Select Language (e.g., Java)  │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Display Topics:               │
    │  • 01-introduction.html        │
    │  • 02-installation.html        │
    │  • ...                         │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Click Topic                   │
    │  Load via iframe:              │
    │  /content/java/01-intro...html │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  Content Displayed             │
    │  (with styling & examples)     │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │  User Can:                     │
    │  • Select next topic           │
    │  • Go to profile               │
    │  • Click Logout                │
    └────────┬───────────────────────┘
             ↓ (if logout)
    ┌────────────────────────────────┐
    │  Clear localStorage            │
    │  Redirect to login.html        │
    └────────────────────────────────┘
             ↓
           END
```

---

## 🔐 Authentication Guard Flow

```
Page Load (learning.html, profile.html, etc.)
  ↓
┌─────────────────────────────────────────┐
│  <script src="js/api.js"></script>     │
│  <script>                               │
│    const user = getCurrentUser()        │
│    if (!guardRoute()) {                 │
│      throw new Error("Not auth'd")     │
│    }                                    │
│  </script>                              │
└──────────┬──────────────────────────────┘
           ↓
    guardRoute() called
           ↓
    ┌──────────────────────────┐
    │  Call isAuthenticated()  │
    └───────┬────────┬─────────┘
            │        │
        YES │        │ NO
            ↓        ↓
        [Load]  [Redirect]
                     ↓
            localStorage.removeItem("user")
                     ↓
            location.href = "login.html"
```

---

## 💾 localStorage Structure

```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "LOCAL",
    "profileImage": null
  }
}
```

### Why Each Field Matters
- **id**: Backend primary key (REQUIRED for auth guard)
- **username**: Display name in UI
- **email**: User identifier for login
- **provider**: "LOCAL" for manual, "GOOGLE" for OAuth
- **profileImage**: Avatar URL (optional, has fallback)

---

## 📦 Content Loading Pattern

```javascript
// In learning.html
function loadContent(language, topicFile) {
    // Example: loadContent('java', '01-introduction.html')
    const path = `content/${language}/${topicFile}`;
    document.getElementById("contentFrame").src = path;
    
    // Track progress (optional)
    apiUpdateProgress(user.id, language, topicFile);
}
```

### Content Path Examples
- `/content/java/01-introduction.html`
- `/content/c/02-structure.html`
- `/content/cpp/03-oop.html`
- `/content/mysql/04-queries.html`

---

## 🎯 API Response Formats

### Login/Register Response
```json
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

### User Profile Response
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "learningCount": 5,
  "practiceCount": 12,
  "skillRating": 4.5,
  "joinDate": "2024-01-11"
}
```

### Progress Response
```json
[
  {
    "userId": 1,
    "language": "java",
    "topic": "01-introduction.html",
    "completedAt": "2024-01-11T10:30:00Z"
  }
]
```

---

## 🛠️ API Helper Functions Quick Reference

### Getting Current User
```javascript
const user = getCurrentUser();
// Returns: { id, username, email, provider, profileImage }
// or null if not logged in
```

### Checking Authentication
```javascript
if (isAuthenticated()) {
    // user.id exists and is valid
}
```

### Protecting a Page
```javascript
const user = getCurrentUser();
if (!guardRoute()) {
    return; // Already redirected to login
}
```

### Logging Out
```javascript
apiLogout(); // Clears localStorage and redirects
```

### Updating Progress
```javascript
await apiUpdateProgress(user.id, "java", "01-introduction.html");
```

---

## 🎨 Theme Colors

```css
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
```

---

## 📊 File Structure Summary

```
project/
├── src/main/resources/static/
│   ├── index.html              (Landing page)
│   ├── login.html              (Auth page)
│   ├── register.html           (Sign up page)
│   ├── learning.html           (Main learning interface)
│   ├── profile.html            (User profile)
│   ├── dashboard.html          (Dashboard - optional)
│   ├── skills.html             (Skills page - optional)
│   ├── practice.html           (Practice page - optional)
│   ├── css/
│   │   ├── theme.css           (Dark theme variables)
│   │   ├── dashboard.css       (Layout styling)
│   │   └── profile.css         (Profile styling)
│   ├── js/
│   │   ├── api.js              (Auth & API helpers)
│   │   ├── home.js             (Home page logic)
│   │   ├── learning.js         (Learning page logic)
│   │   ├── profile.js          (Profile page logic)
│   │   ├── auth.js             (Auth utilities)
│   │   └── logout.js           (Logout logic)
│   ├── assets/
│   │   └── images/             (UI images)
│   └── content/
│       ├── java/               (19 Java topics)
│       ├── c/                  (12 C topics)
│       ├── cpp/                (10 C++ topics)
│       └── mysql/              (13 MySQL topics)
└── pom.xml                    (Maven config)
```

---

## ✅ Verification Commands

```bash
# Build the project
./mvnw clean compile -q

# Check file structure
find src/main/resources/static/content -type d

# Verify JavaScript files
ls -la src/main/resources/static/js/

# Check content files
find src/main/resources/static/content -name "*.html" | wc -l
```

---

## 🚀 Running the Application

```bash
# Full build and run
./mvnw clean spring-boot:run

# Navigate to:
# http://localhost:8080
```

---

## 📝 Quick Debugging Tips

1. **Check localStorage**: Open DevTools → Application → Storage → localStorage
2. **Check Auth Guard**: Look for "Not authenticated" in browser console
3. **Check API Calls**: DevTools → Network tab → XHR/Fetch
4. **Check Content Loading**: DevTools → Sources → Check /content/ paths
5. **Check User Object**: `JSON.parse(localStorage.getItem('user'))` in console

---

## 🎓 Architecture Principles

✅ **Separation of Concerns**
- Frontend (HTML/CSS/JS)
- Backend (Spring Boot REST)
- Database (MySQL)
- Auth (Spring Security + localStorage)

✅ **DRY (Don't Repeat Yourself)**
- Helper functions in api.js
- Reusable CSS variables
- Content structure by language

✅ **Security**
- Auth guard on protected pages
- Session management via localStorage
- Backend validation of all requests

✅ **Scalability**
- Modular content loading
- Easy to add new languages
- Extensible API design

---

**Architecture Finalized**: ✅ Ready for production deployment
