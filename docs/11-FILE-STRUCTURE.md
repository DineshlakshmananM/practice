# 📁 File Structure Guide

## Project Directory Organization

```
practice/
├── docs/                          # Documentation folder
│   ├── INDEX.md                   # Documentation index
│   ├── 01-QUICK_START.md         # Quick start guide
│   ├── 02-PROJECT_OVERVIEW.md    # Project description
│   ├── 03-ARCHITECTURE.md        # Architecture documentation
│   ├── 04-FEATURES.md            # Feature descriptions
│   ├── 05-API-ENDPOINTS.md       # API reference
│   ├── 06-FRONTEND-PAGES.md      # Frontend pages guide
│   ├── 07-DATABASE-SCHEMA.md     # Database schema
│   ├── 08-CONFIGURATION.md       # Configuration guide
│   ├── 09-TESTING-GUIDE.md       # Testing procedures
│   ├── 09-TROUBLESHOOTING.md     # Troubleshooting guide
│   ├── 10-DEPLOYMENT.md          # Deployment guide
│   └── COMPREHENSIVE_DOCUMENTATION.md  # Full documentation
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── config/              # Spring Configuration
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── CorsConfig.java
│   │   │       │   └── AppProperties.java
│   │   │       │
│   │   │       ├── controller/          # REST Controllers
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── UserController.java
│   │   │       │   └── HomeController.java
│   │   │       │
│   │   │       ├── service/             # Business Logic
│   │   │       │   ├── UserService.java
│   │   │       │   ├── EmailService.java
│   │   │       │   └── AuthService.java
│   │   │       │
│   │   │       ├── repository/          # Data Access Layer
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── PasswordResetTokenRepository.java
│   │   │       │
│   │   │       ├── entity/              # JPA Entities
│   │   │       │   ├── User.java
│   │   │       │   └── PasswordResetToken.java
│   │   │       │
│   │   │       ├── dto/                 # Data Transfer Objects
│   │   │       │   ├── ForgotPasswordRequest.java
│   │   │       │   ├── ResetPasswordRequest.java
│   │   │       │   ├── ProfileUpdateRequest.java
│   │   │       │   └── LoginRequest.java
│   │   │       │
│   │   │       ├── utils/               # Utility Classes
│   │   │       │   └── JwtTokenProvider.java
│   │   │       │
│   │   │       └── DemoApplication.java # Main Entry Point
│   │   │
│   │   └── resources/
│   │       ├── application.properties   # Application configuration
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       ├── logback.xml             # Logging configuration
│   │       │
│   │       ├── static/                 # Frontend files (served by Spring)
│   │       │   ├── index.html          # Landing page (redesigned)
│   │       │   ├── login.html          # Login page
│   │       │   ├── register.html       # Registration page
│   │       │   ├── dashboard.html      # User dashboard
│   │       │   ├── profile.html        # User profile
│   │       │   ├── profile-edit.html   # Profile editing
│   │       │   ├── forgot-password.html    # Password reset request
│   │       │   ├── reset-password.html     # Password reset form
│   │       │   ├── learning.html       # Learning page
│   │       │   ├── practice.html       # Practice problems
│   │       │   ├── skills.html         # Skills page
│   │       │   │
│   │       │   ├── assets/
│   │       │   │   └── images/         # Application images
│   │       │   │       ├── logo.png
│   │       │   │       ├── favicon.ico
│   │       │   │       └── ...
│   │       │   │
│   │       │   ├── css/                # Stylesheets
│   │       │   │   ├── theme.css       # Global styles
│   │       │   │   ├── dashboard.css   # Dashboard styles
│   │       │   │   ├── profile.css     # Profile styles
│   │       │   │   └── responsive.css  # Mobile responsive styles
│   │       │   │
│   │       │   ├── js/                 # JavaScript files
│   │       │   │   ├── api.js          # API utility functions
│   │       │   │   ├── auth.js         # Authentication logic
│   │       │   │   ├── auth-check.js   # Login state checker
│   │       │   │   ├── dashboard.js    # Dashboard functionality
│   │       │   │   ├── profile.js      # Profile page logic
│   │       │   │   ├── learning.js     # Learning page logic
│   │       │   │   ├── home.js         # Home page logic
│   │       │   │   └── logout.js       # Logout handler
│   │       │   │
│   │       │   └── content/            # Learning content
│   │       │       ├── c/              # C language content
│   │       │       │   ├── 01-introduction.html
│   │       │       │   ├── 02-structure.html
│   │       │       │   ├── 03-datatypes.html
│   │       │       │   └── ...
│   │       │       ├── cpp/            # C++ language content
│   │       │       ├── java/           # Java language content
│   │       │       └── mysql/          # MySQL language content
│   │       │
│   │       └── templates/              # Thymeleaf templates (if used)
│   │
│   └── test/
│       └── java/
│           └── com/example/demo/
│               ├── controller/
│               │   ├── AuthControllerTest.java
│               │   └── UserControllerTest.java
│               │
│               ├── service/
│               │   ├── UserServiceTest.java
│               │   └── EmailServiceTest.java
│               │
│               └── DemoApplicationTests.java
│
├── pom.xml                        # Maven configuration
├── mvnw                          # Maven wrapper (Linux/Mac)
├── mvnw.cmd                      # Maven wrapper (Windows)
├── docker-compose.yml            # Docker compose configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # Project README
└── target/                       # Build output (generated)
    ├── classes/                  # Compiled classes
    ├── demo-0.0.1-SNAPSHOT.jar  # Executable JAR
    └── ...

```

---

## File Descriptions

### Backend - Configuration Files

#### `src/main/java/com/example/demo/config/SecurityConfig.java`
- **Purpose**: Spring Security configuration
- **Responsibility**: Authentication, authorization, CORS setup
- **Size**: ~150 lines
- **Key Methods**: `filterChain()`, `passwordEncoder()`

#### `src/main/java/com/example/demo/config/CorsConfig.java`
- **Purpose**: CORS (Cross-Origin Resource Sharing) configuration
- **Responsibility**: Allow frontend to communicate with API
- **Size**: ~50 lines
- **Key Methods**: `corsConfigurer()`

#### `src/main/java/com/example/demo/config/AppProperties.java`
- **Purpose**: Configuration property binding
- **Responsibility**: Map application properties from application.properties
- **Size**: ~40 lines
- **Key Fields**: `baseUrl`, `mail`

---

### Backend - Controllers

#### `src/main/java/com/example/demo/controller/AuthController.java`
- **Purpose**: Authentication endpoints
- **Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `POST /api/auth/logout` - User logout
  - `POST /api/auth/forgot-password` - Password reset request
  - `POST /api/auth/reset-password` - Password reset confirmation
- **Size**: ~250 lines
- **Dependencies**: UserRepository, EmailService, PasswordResetTokenRepository

#### `src/main/java/com/example/demo/controller/UserController.java`
- **Purpose**: User profile management endpoints
- **Endpoints**:
  - `GET /api/user/profile/{userId}` - Get user profile
  - `PUT /api/user/profile/{userId}` - Update user profile
- **Size**: ~150 lines
- **Dependencies**: UserRepository

#### `src/main/java/com/example/demo/controller/HomeController.java`
- **Purpose**: Serve static frontend pages
- **Endpoints**:
  - `GET /` - Landing page
  - `GET /login` - Login page
  - `GET /register` - Registration page
  - `GET /dashboard` - Dashboard
- **Size**: ~100 lines

---

### Backend - Services

#### `src/main/java/com/example/demo/service/UserService.java`
- **Purpose**: User business logic
- **Responsibilities**: User creation, validation, stats calculation
- **Size**: ~200 lines
- **Key Methods**: `createUser()`, `updateProfile()`, `calculateRating()`

#### `src/main/java/com/example/demo/service/EmailService.java`
- **Purpose**: Email sending service
- **Responsibilities**: Send password reset and welcome emails
- **Size**: ~150 lines
- **Key Methods**: `sendPasswordResetEmail()`, `sendWelcomeEmail()`
- **Configuration**: Uses JavaMailSender, AppProperties for SMTP settings

#### `src/main/java/com/example/demo/service/AuthService.java`
- **Purpose**: Authentication business logic
- **Responsibilities**: Password reset workflow, token management
- **Size**: ~180 lines
- **Key Methods**: `createResetToken()`, `resetPassword()`, `validateToken()`

---

### Backend - Repositories

#### `src/main/java/com/example/demo/repository/UserRepository.java`
- **Purpose**: User data access
- **Custom Methods**: `findByUsername()`, `findByEmail()`
- **Type**: JPA Repository

#### `src/main/java/com/example/demo/repository/PasswordResetTokenRepository.java`
- **Purpose**: Password reset token data access
- **Custom Methods**: `findByToken()`, `findByUser()`, `findByTokenAndExpiryTimeAfterAndUsedFalse()`
- **Type**: JPA Repository

---

### Backend - Entities

#### `src/main/java/com/example/demo/entity/User.java`
- **Purpose**: User data model
- **Fields**:
  - id, username, email, password, profileImage
  - problemsSolved, learningStreak, skillRating, skills
  - provider, createdAt, lastLogin, updatedAt
- **Annotations**: `@Entity`, `@Table`, `@Column`, `@GeneratedValue`
- **Size**: ~150 lines

#### `src/main/java/com/example/demo/entity/PasswordResetToken.java`
- **Purpose**: Password reset token data model
- **Fields**: id, token (UUID), user (FK), expiryTime, used, createdAt
- **Annotations**: `@Entity`, `@ManyToOne`, `@ForeignKey`
- **Size**: ~100 lines
- **Method**: `isValid()` - Check if token is still usable

---

### Backend - DTOs

#### `src/main/java/com/example/demo/dto/ForgotPasswordRequest.java`
- **Fields**: `email` (String)
- **Purpose**: Password reset request data binding
- **Size**: ~20 lines

#### `src/main/java/com/example/demo/dto/ResetPasswordRequest.java`
- **Fields**: `token` (String), `newPassword` (String)
- **Purpose**: Password reset confirmation binding
- **Validation**: Password strength checking
- **Size**: ~30 lines

#### `src/main/java/com/example/demo/dto/ProfileUpdateRequest.java`
- **Fields**: `username`, `email`, `profileImage`
- **Purpose**: Profile update request binding
- **Validation**: Not null, format checking
- **Size**: ~30 lines

---

### Frontend - HTML Pages

#### `src/main/resources/static/index.html`
- **Purpose**: Landing/home page
- **Sections**: Hero, stats, features, languages, testimonials, pricing, CTA, footer
- **Responsive**: Mobile-first design (375px, 768px, 1024px+)
- **Size**: ~600 lines

#### `src/main/resources/static/login.html`
- **Purpose**: User login interface
- **Features**: Email input, password field, remember me, forgot password link, error messages
- **Size**: ~200 lines

#### `src/main/resources/static/register.html`
- **Purpose**: User registration interface
- **Features**: Username, email, password fields, password confirmation, validation
- **Size**: ~250 lines

#### `src/main/resources/static/forgot-password.html` (NEW)
- **Purpose**: Password reset request initiation
- **Features**: Email input, validation, loading spinner, confirmation message
- **Size**: ~180 lines

#### `src/main/resources/static/reset-password.html` (NEW)
- **Purpose**: Password reset form
- **Features**: Token validation, password strength checker with visual indicators
- **URL Parameter**: `?token=uuid-here`
- **Size**: ~280 lines

#### `src/main/resources/static/profile-edit.html` (NEW)
- **Purpose**: User profile editing
- **Features**: Image upload with preview, username/email editing, stats display, validation
- **Size**: ~320 lines

#### `src/main/resources/static/dashboard.html`
- **Purpose**: Main user dashboard
- **Features**: User stats, problem list, learning content, progress tracking
- **Size**: ~400 lines

#### `src/main/resources/static/profile.html`
- **Purpose**: User profile view
- **Features**: Profile image, user stats, skills, member since, edit/logout buttons
- **Size**: ~250 lines

#### `src/main/resources/static/learning.html`
- **Purpose**: Learning resources page
- **Features**: Language selection, lesson list, progress tracking
- **Size**: ~300 lines

#### `src/main/resources/static/practice.html`
- **Purpose**: Practice problems page
- **Features**: Problem list, difficulty filter, solution view
- **Size**: ~350 lines

#### `src/main/resources/static/skills.html`
- **Purpose**: Skills/statistics page
- **Features**: Skill breakdown, achievements, progress chart
- **Size**: ~250 lines

---

### Frontend - CSS Files

#### `src/main/resources/static/css/theme.css`
- **Purpose**: Global application styles
- **Content**: Color scheme, typography, animations, utilities
- **Size**: ~400 lines
- **Key Classes**: `.btn-primary`, `.card`, `.alert`, `.container`

#### `src/main/resources/static/css/dashboard.css`
- **Purpose**: Dashboard-specific styles
- **Content**: Layout grid, sidebar, stats cards, responsive design
- **Size**: ~300 lines

#### `src/main/resources/static/css/profile.css`
- **Purpose**: Profile page styles
- **Content**: Profile card, stats display, edit form styling
- **Size**: ~250 lines

#### `src/main/resources/static/css/responsive.css`
- **Purpose**: Mobile responsive styles
- **Content**: Media queries, mobile menu, touch-friendly buttons
- **Size**: ~200 lines

---

### Frontend - JavaScript Files

#### `src/main/resources/static/js/api.js`
- **Purpose**: API utility functions
- **Key Functions**:
  - `apiCall(method, endpoint, data)` - Generic API wrapper
  - `register()`, `login()`, `logout()`
  - `forgotPassword()`, `resetPassword()`
  - `getProfile()`, `updateProfile()`
- **Size**: ~300 lines
- **Error Handling**: Catches and displays errors to user

#### `src/main/resources/static/js/auth.js`
- **Purpose**: Authentication logic
- **Key Functions**:
  - `handleLogin()` - Process login form
  - `handleRegister()` - Process registration form
  - `validateForm()` - Form validation
  - `setAuthToken(token)` - Save JWT token
  - `getAuthToken()` - Retrieve JWT token
- **Size**: ~200 lines
- **Storage**: localStorage for token persistence

#### `src/main/resources/static/js/auth-check.js`
- **Purpose**: Check login status on page load
- **Behavior**: Redirect to login if not authenticated, show profile icon if logged in
- **Size**: ~100 lines

#### `src/main/resources/static/js/dashboard.js`
- **Purpose**: Dashboard page functionality
- **Features**: Load user stats, display problems, handle click events
- **Size**: ~250 lines

#### `src/main/resources/static/js/profile.js`
- **Purpose**: Profile page logic
- **Features**: Load profile data, display stats, handle edit/logout
- **Size**: ~200 lines

#### `src/main/resources/static/js/learning.js`
- **Purpose**: Learning page functionality
- **Features**: Load courses, display lessons, progress tracking
- **Size**: ~250 lines

#### `src/main/resources/static/js/home.js`
- **Purpose**: Home/landing page functionality
- **Features**: Smooth scroll, button click handlers, stats animation
- **Size**: ~150 lines

#### `src/main/resources/static/js/logout.js`
- **Purpose**: Logout functionality
- **Features**: Clear token, redirect to login
- **Size**: ~50 lines

---

### Frontend - Content Files

#### Learning Content Structure
```
static/content/
├── c/                           # C language lessons
│   ├── 01-introduction.html     # Introduction to C
│   ├── 02-structure.html        # Program structure
│   ├── 03-datatypes.html        # Data types
│   ├── 04-operators.html        # Operators
│   ├── 05-control-statements.html
│   ├── 06-functions.html
│   ├── 07-arrays.html
│   ├── 08-pointers.html
│   ├── 09-strings.html
│   ├── 10-structures.html
│   ├── 11-file-handling.html
│   └── 12-advanced-c.html
│
├── cpp/                         # C++ lessons (similar structure)
├── java/                        # Java lessons
└── mysql/                       # MySQL database lessons
```

---

### Configuration Files

#### `pom.xml`
- **Purpose**: Maven project configuration
- **Sections**:
  - Project metadata
  - Properties (Java version, spring-boot version)
  - Dependencies (Spring Boot, JPA, Security, Mail, OAuth2)
  - Plugins (Maven compiler, jar)
- **Size**: ~300 lines

#### `application.properties`
- **Purpose**: Application configuration
- **Sections**:
  - Server port, context path
  - Database connection (MySQL)
  - JPA/Hibernate settings
  - Email (SMTP) settings
  - OAuth2 Google configuration
  - Custom app properties
- **Size**: ~50 lines (plus 50 more for comments)

#### `docker-compose.yml`
- **Purpose**: Multi-container orchestration
- **Services**: MySQL database, Spring Boot app
- **Networking**: Internal network for service communication
- **Volumes**: Persistent database storage
- **Size**: ~80 lines

---

## Naming Conventions

### Java Classes
- **Controllers**: `*Controller.java` (e.g., `AuthController.java`)
- **Services**: `*Service.java` (e.g., `UserService.java`)
- **Repositories**: `*Repository.java` (e.g., `UserRepository.java`)
- **Entities**: Singular nouns (e.g., `User.java`, `PasswordResetToken.java`)
- **DTOs**: `*Request.java` or `*Response.java`
- **Config**: `*Config.java`

### HTML Files
- **Pages**: lowercase with hyphens (e.g., `forgot-password.html`)
- **Content**: numbered (e.g., `01-introduction.html`)

### CSS Files
- **Naming**: lowercase with hyphens (e.g., `responsive.css`)
- **Organization**: One concern per file

### JavaScript Files
- **Naming**: lowercase with hyphens (e.g., `auth-check.js`)
- **Organization**: One feature per file

---

## Development Workflow

### When adding a new feature:
1. Create entity in `entity/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Create DTOs in `dto/` if needed
6. Create frontend pages in `static/`
7. Add JavaScript in `js/`
8. Add CSS in `css/`
9. Create tests in `test/`

### When fixing bugs:
1. Update entity/service/repository as needed
2. Update controller logic
3. Update frontend JavaScript/HTML
4. Run all tests
5. Update documentation

---

**File structure is clean and organized! 📁**
