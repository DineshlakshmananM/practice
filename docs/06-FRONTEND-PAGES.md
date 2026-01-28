# 📄 Frontend Pages Guide

## Page Overview

| Page | File | Purpose | Status |
|------|------|---------|--------|
| Landing | index.html | Public marketing page | ✅ NEW |
| Login | login.html | Authentication | ✅ UPDATED |
| Dashboard | dashboard.html | Main hub | ✅ |
| Profile | profile.html | View profile | ✅ |
| Profile Edit | profile-edit.html | Edit profile | ✅ NEW |
| Learning | learning.html | Courses | ✅ |
| Practice | practice.html | Problems | ✅ |
| Skills | skills.html | Assessment | ✅ |
| Forgot Password | forgot-password.html | Reset request | ✅ NEW |
| Reset Password | reset-password.html | Reset form | ✅ NEW |

---

## 1. index.html - Landing Page

### Purpose
Professional marketing website to attract new users

### Sections
1. **Navigation Bar**
   - Logo with icon (🧬)
   - Menu links (Features, Languages, Pricing)
   - Login/Get Started buttons
   - Profile menu (logged-in users)

2. **Hero Section**
   - Headline: "Master Programming Fundamentals"
   - Value proposition
   - Dual CTAs (Start Learning, Learn More)

3. **Statistics**
   - 50K+ Learners
   - 1000+ Problems
   - 10+ Languages
   - 95% Success Rate

4. **Features (6 Cards)**
   - Structured Learning Paths
   - Multiple Languages
   - Practice Problems
   - Progress Tracking
   - Interview Prep
   - Community Support

5. **Languages (6 Boxes)**
   - Java, Python, C, C++, JavaScript, MySQL
   - Each shows progression level

6. **Testimonials (3)**
   - User success stories
   - Names and positions
   - Professional design

7. **Pricing (3 Tiers)**
   - Free tier
   - Pro tier (popular)
   - Enterprise tier

8. **CTA Section**
   - Strong call-to-action
   - Value reinforcement

9. **Footer**
   - Product links
   - Company links
   - Legal links
   - Copyright

### Technology
- HTML5 semantic markup
- CSS3 with gradients and animations
- Vanilla JavaScript for interactivity
- Responsive design

### User Flow
```
Land on page → Scroll through sections → Click CTA → Go to login
```

---

## 2. login.html - Authentication Page

### Purpose
Allow users to login or register

### Sections
1. **Login Form**
   - Email input
   - Password input
   - Remember me checkbox
   - Login button
   - Forgot password link

2. **Registration Form**
   - Username input
   - Email input
   - Password input
   - Confirm password input
   - Register button
   - Terms agreement

3. **OAuth Button**
   - "Continue with Google"
   - Social login integration

4. **Error Messages**
   - Invalid credentials
   - Email already exists
   - Password mismatch
   - Form validation

### Features
- Tab switching between login/register
- Form validation
- Loading states
- Error messages
- Password visibility toggle
- Responsive design

### User Flows
```
New User: Register → Dashboard
Existing User: Login → Dashboard
Forgot Password: Click link → forgot-password.html
```

---

## 3. dashboard.html - Main Dashboard

### Purpose
Central hub for logged-in users

### Sections
1. **Welcome Section**
   - User greeting
   - Quick stats
   - Call-to-action

2. **Learning Progress**
   - Current course
   - Progress bar
   - Problems solved today

3. **Quick Stats**
   - Total problems solved
   - Current streak
   - Skill rating
   - Time spent learning

4. **Recent Activity**
   - Latest problems attempted
   - Recent achievements
   - Course progress

5. **Suggested Content**
   - Recommended courses
   - Next problems
   - Learning paths

### Navigation
- Profile link
- Learning link
- Practice link
- Skills link
- Logout button

---

## 4. profile.html - User Profile

### Purpose
Display user information and statistics

### Sections
1. **Profile Header**
   - Profile image
   - Username
   - Email
   - Member since

2. **Statistics**
   - Problems solved
   - Learning streak
   - Skill rating
   - Time spent

3. **Skills**
   - Learned languages
   - Skill levels
   - Progress bars

4. **Learning History**
   - Recent courses
   - Completed problems
   - Achievements

5. **Edit Button**
   - Link to profile-edit.html

---

## 5. profile-edit.html - Profile Editor (NEW)

### Purpose
Allow users to edit their profile

### Features
1. **Profile Image**
   - Upload button
   - Live preview
   - Image crop
   - File validation

2. **Edit Fields**
   - Username (with duplicate check)
   - Email (with duplicate check)
   - Bio (optional)

3. **Display Stats**
   - Problems solved
   - Learning streak
   - Skill rating
   - Member since

4. **Buttons**
   - Save Changes
   - Cancel (no changes)
   - Back to Profile

### Validation
- Username: 3-50 chars, alphanumeric + underscore
- Email: Valid format, unique
- Image: JPG/PNG, under 5MB

### User Flow
```
View Profile → Click Edit → Update Fields → Save → Success Message
```

---

## 6. learning.html - Learning Center

### Purpose
Browse and learn programming courses

### Sections
1. **Language Selection**
   - Java
   - Python
   - C
   - C++
   - JavaScript
   - MySQL

2. **Course Structure**
   - Beginner topics
   - Intermediate topics
   - Advanced topics

3. **Content Display**
   - Video/text content
   - Interactive examples
   - Code snippets
   - Explanations

4. **Progress Tracking**
   - Mark complete
   - Progress bar
   - Next lesson

---

## 7. practice.html - Practice Problems

### Purpose
Solve coding problems and practice

### Sections
1. **Problem List**
   - Filter by language
   - Filter by difficulty
   - Search problems

2. **Problem Viewer**
   - Problem description
   - Example inputs/outputs
   - Difficulty level
   - Points earned

3. **Code Editor**
   - Language selection
   - Code input
   - Run code
   - Submit solution

4. **Leaderboard**
   - User rankings
   - Problems solved
   - Skill rating

---

## 8. skills.html - Skills Dashboard

### Purpose
Track and improve programming skills

### Sections
1. **Skill Assessment**
   - Overall rating
   - Rating by language
   - Strengths/weaknesses

2. **Progress Charts**
   - Problems by language
   - Difficulty progression
   - Time spent

3. **Recommendations**
   - Next courses
   - Problem suggestions
   - Skill gaps

---

## 9. forgot-password.html - Password Reset Request (NEW)

### Purpose
Request password reset via email

### Features
1. **Email Input**
   - Email field with validation
   - Clear placeholder

2. **Submit Button**
   - "Send Reset Link" button
   - Loading spinner

3. **Success Message**
   - Confirmation display
   - Email address shown
   - Instructions
   - Resend link option

4. **Error Messages**
   - Email not found
   - SMTP error
   - Rate limiting

5. **Back Link**
   - Return to login

### User Flow
```
Click "Forgot Password" → Enter email → Send link → Email received → Click link → reset-password.html
```

---

## 10. reset-password.html - Password Reset Form (NEW)

### Purpose
Complete password reset process

### Features
1. **Token Validation**
   - Read from URL parameter
   - Validate token
   - Check expiration
   - Show error if invalid

2. **Password Form**
   - New password input
   - Confirm password input
   - Show password toggle

3. **Requirements Checker**
   - Minimum 8 characters
   - Uppercase letter (A-Z)
   - Lowercase letter (a-z)
   - Number (0-9)
   - Visual indicators
   - Real-time feedback

4. **Submit Button**
   - Enabled only when valid
   - Loading state
   - Success message

5. **Error Handling**
   - Invalid token
   - Expired token
   - Password mismatch
   - Requirements not met

6. **Auto-Redirect**
   - Redirect to login after 3 seconds
   - Countdown display

### User Flow
```
Receive email → Click reset link → Validate token → Enter password → Meet requirements → Submit → Success → Auto-redirect to login
```

---

## Shared Components

### Navigation Bar
- Present on: dashboard, profile, learning, practice, skills
- Shows: Logo, user greeting, profile menu
- Actions: Navigation, logout

### Profile Menu
- Display: Profile name, email
- Options:
  - My Profile
  - Dashboard
  - Logout

### Loading States
- Spinners during operations
- Disabled buttons during submission
- Progress indicators

### Error Messages
- Clear error text
- Helpful suggestions
- Retry options

### Success Messages
- Confirmation display
- Next steps
- Navigation options

---

## Responsive Design

All pages are responsive for:
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

### Design Principles
- Touch-friendly buttons (48px minimum)
- Readable text on all screens
- Flexible layouts
- Mobile-first approach

---

## Accessibility

- Semantic HTML5
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

---

## Performance

- Minified CSS/JS
- Image optimization
- Lazy loading
- Efficient DOM updates
- Minimal external dependencies

---

**All frontend pages documented! 🎨**
