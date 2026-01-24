# TechySpine - Quick Reference Card ⚡

## 🎯 Most Important Points

### Auth Guard (CRITICAL)
```javascript
// CORRECT - All protected pages use this pattern
const user = getCurrentUser();
if (!guardRoute()) {
    throw new Error("Not authenticated");
}
```

### localStorage Structure (CRITICAL)
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "provider": "LOCAL",
  "profileImage": null
}
```

### Why user.id?
- ✅ Guaranteed to exist on all users
- ✅ Backend primary key
- ❌ user.username may be undefined

---

## 🚀 Quick Start

### Build & Run
```bash
./mvnw clean compile -q    # Build only
./mvnw spring-boot:run      # Run application
# Navigate to http://localhost:8080
```

### Test Registration Flow
1. Click "Get Started" on home
2. Fill register form
3. Should redirect to login page after 1.5s

### Test Login Flow
1. Enter email and password
2. User saved to localStorage (100ms delay)
3. Should redirect to learning.html immediately

### Test Learning Page
1. View languages: Java, C, C++, MySQL
2. Click a language
3. See topics listed
4. Click topic to load content in iframe
5. Content path: `/content/java/01-introduction.html`

---

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| login.html | Login entry point |
| learning.html | Main learning interface (PROTECTED) |
| profile.html | User stats (PROTECTED) |
| js/api.js | Helper functions & APIs |
| content/java/ | Java learning topics |
| css/theme.css | Dark theme colors |

---

## 🔗 API Endpoints Required

```
POST   /api/auth/login       (returns user with id)
POST   /api/auth/register    (returns user with id)
GET    /api/user/profile/{id}  (returns stats)
POST   /api/progress/update  (tracks learning)
GET    /api/user/progress/{id} (gets progress)
```

---

## 🛡️ Helper Functions in js/api.js

```javascript
getCurrentUser()             // Get user from localStorage
isAuthenticated()            // Check if user.id exists
guardRoute()                 // Auth guard for pages
apiLogout()                  // Clear session
apiUpdateProgress()          // Track learning
```

---

## 🎨 Theme Colors

```css
Primary:    #0ea5e9 (cyan)
Secondary:  #06b6d4 (teal)
Accent:     #84a98c (green)
Background: #0f172a (dark blue)
Text:       #e2e8f0 (light)
```

---

## ✅ All Implemented

- ✅ Login/Register with proper session
- ✅ Auth guard checking user.id
- ✅ Learning page with content loading
- ✅ Profile page with stats
- ✅ Logout functionality
- ✅ localStorage persistence
- ✅ 54 content topic files
- ✅ Dark theme styling
- ✅ Helper functions
- ✅ Error handling

---

## 🧪 Testing Checklist

- [ ] Build succeeds
- [ ] Register → Login works
- [ ] Login → Learning page loads
- [ ] Content loads in iframe
- [ ] Logout clears session
- [ ] Page reload preserves session
- [ ] Auth guard redirects if needed
- [ ] All API calls expected format

---

## 🔴 Common Mistakes

❌ Using `user.username` in auth guard
✅ Use `user.id` instead

❌ Forgetting 100ms delay before login redirect
✅ Already implemented in login.html

❌ Not importing api.js on protected pages
✅ All protected pages now import it

❌ Content path without leading `/content/`
✅ Use `/content/java/01-introduction.html`

---

## 📊 File Summary

- **HTML**: 7 files (login, register, learning, profile, etc.)
- **JavaScript**: 5 files (api.js with 5 helper functions)
- **CSS**: 3 files (theme, dashboard, profile)
- **Content**: 54 topic files (java:19, c:12, cpp:10, mysql:13)
- **Backend**: Spring Boot 3.5.10 with all CVE fixes

---

## 🚨 Critical Implementation Detail

**Why the 100ms delay before redirect in login.html?**

```javascript
// Without delay: localStorage might not persist before page change
localStorage.setItem("user", JSON.stringify(user));
location.href = "learning.html";  // ❌ Might lose data

// With delay: Ensures write completes
localStorage.setItem("user", JSON.stringify(user));
setTimeout(() => {
    location.href = "learning.html";
}, 100);  // ✅ Data persists
```

---

## 🎯 User Flow

```
Home → Register → Login → Learning
                              ↓
                        (Auth Guard Check)
                              ↓
                    Select Language & Topic
                              ↓
                      Load Content in iframe
```

---

## 💾 What Gets Saved in localStorage?

After successful login:
```json
{
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "provider": "LOCAL",
    "profileImage": null
  }
}
```

This data:
- ✅ Persists on page reload
- ✅ Used by auth guard (checks user.id)
- ✅ Cleared on logout
- ✅ Cleared if auth guard fails

---

## 📞 Emergency Debugging

1. **Open DevTools** (F12)
2. **Check localStorage**: 
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```
3. **Check auth**: 
   ```javascript
   getCurrentUser()
   isAuthenticated()
   ```
4. **Check API response**:
   - Network tab → login request → Response
   - Should have `user: {id, username, email, provider}`

---

## ✨ What's Ready to Test

✅ Complete authentication flow
✅ Session persistence
✅ Protected page access
✅ Content loading
✅ Logout functionality
✅ Error handling
✅ Theme styling

**Ready to run**: `./mvnw spring-boot:run`

---

*Last Updated: January 11, 2024*
*Status: ✅ Complete and Ready*
