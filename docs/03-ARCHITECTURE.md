# 🏗️ Architecture & Design

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│         Frontend Layer (Browser)                     │
│  HTML5 | CSS3 | Vanilla JavaScript (ES6+)           │
│  Landing Page | Login | Dashboard | Profiles        │
└──────────────────────────┬───────────────────────────┘
                           │
                           ↓ REST API (JSON)
┌──────────────────────────────────────────────────────┐
│      Spring Boot Application Layer                   │
│  ┌────────────────────────────────────────────────┐  │
│  │ Controller Layer (Request Handling)            │  │
│  │ ├── AuthController                             │  │
│  │ └── UserController                             │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ Service Layer (Business Logic)                 │  │
│  │ ├── EmailService                               │  │
│  │ ├── UserService                                │  │
│  │ └── AuthService                                │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ Repository Layer (Data Access - JPA)           │  │
│  │ ├── UserRepository                             │  │
│  │ ├── PasswordResetTokenRepository                │  │
│  │ └── Other Repositories                         │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ Configuration Layer                            │  │
│  │ ├── AppProperties                              │  │
│  │ ├── SecurityConfiguration                      │  │
│  │ └── CORSConfiguration                          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────┘
                           │
                           ↓ JDBC/SQL
┌──────────────────────────────────────────────────────┐
│         MySQL Database Layer                         │
│  ├── users table                                     │
│  ├── password_reset_tokens table                     │
│  ├── courses table                                   │
│  ├── problems table                                  │
│  └── progress table                                  │
└──────────────────────────────────────────────────────┘
```

---

## Layered Architecture

### 1. Presentation Layer (Frontend)
**Purpose:** User interface and interaction

**Components:**
- HTML Templates
- CSS Styling
- JavaScript Logic
- DOM Manipulation

**Technologies:**
- HTML5
- CSS3
- Vanilla JavaScript ES6+
- localStorage for session management

**Pages:**
- Landing Page (index.html)
- Login Page (login.html)
- Dashboard (dashboard.html)
- Profile Pages (profile.html, profile-edit.html)

---

### 2. Controller Layer
**Purpose:** Handle HTTP requests and responses

**Components:**
- AuthController
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password

- UserController
  - GET /api/user/profile/{userId}
  - PUT /api/user/profile/{userId}

**Responsibilities:**
- Validate incoming requests
- Call appropriate services
- Return JSON responses
- Handle exceptions
- Set HTTP status codes

---

### 3. Service Layer
**Purpose:** Business logic implementation

**Components:**
- EmailService
  - sendPasswordResetEmail()
  - sendWelcomeEmail()
  - Email configuration management

- UserService
  - User management logic
  - Profile operations
  - Stats calculation

- AuthService
  - Authentication logic
  - Token validation
  - Password management

**Responsibilities:**
- Implement business rules
- Coordinate between controllers and repositories
- Handle cross-cutting concerns
- Email operations
- Data transformation

---

### 4. Repository Layer (Data Access)
**Purpose:** Database operations using JPA

**Components:**
- UserRepository
  - CRUD operations on users
  - Custom queries

- PasswordResetTokenRepository
  - Token persistence
  - Token lookup
  - Token expiration check

**Responsibilities:**
- Database CRUD operations
- Query execution
- Transaction management
- Data persistence

---

### 5. Entity/Model Layer
**Purpose:** Database models and relationships

**Components:**
- User Entity
  - User information
  - Profile data
  - Learning statistics

- PasswordResetToken Entity
  - Token storage
  - Expiration tracking
  - Usage tracking

**Relationships:**
```
PasswordResetToken --FK--> User (1-to-N)
```

---

### 6. Configuration Layer
**Purpose:** Application configuration and security

**Components:**
- AppProperties
  - Custom property binding
  - Configuration values

- SecurityConfiguration
  - CORS setup
  - Security rules
  - Authentication configuration

**Responsibilities:**
- Load configuration from properties
- Set up security policies
- Configure email service
- Setup database connection

---

## Design Patterns Used

### 1. MVC Pattern
- Model: Entity classes
- View: HTML/CSS/JavaScript
- Controller: REST controllers

### 2. Dependency Injection
- Spring manages bean lifecycle
- Constructor injection
- @Autowired annotations

### 3. Repository Pattern
- Abstract database access
- JPA repositories
- Custom queries

### 4. Service Layer Pattern
- Business logic encapsulation
- Reusable services
- Separation of concerns

### 5. DTO Pattern
- Data transfer objects
- Request/Response mapping
- Data validation

### 6. Token-Based Security
- UUID token generation
- Time-limited validity
- One-time use enforcement

---

## Data Flow Examples

### Registration Flow
```
User Input (HTML Form)
    ↓
JavaScript (auth.js)
    ↓
POST /api/auth/register
    ↓
AuthController.register()
    ↓
UserService.register()
    ↓
UserRepository.save()
    ↓
MySQL Insert
    ↓
Response JSON
    ↓
JavaScript Success Handler
    ↓
Redirect to Dashboard
```

### Password Recovery Flow
```
User Email Input
    ↓
POST /api/auth/forgot-password
    ↓
AuthController.forgotPassword()
    ↓
Generate UUID Token
    ↓
Save Token to DB
    ↓
EmailService.send()
    ↓
SMTP Send Email
    ↓
Response to User
    ↓
User Clicks Email Link
    ↓
Token Validation
    ↓
Display Reset Form
    ↓
POST /api/auth/reset-password
    ↓
Validate Token
    ↓
Update Password
    ↓
Mark Token as Used
    ↓
Success Response
```

### Profile Update Flow
```
User Edits Profile
    ↓
JavaScript Form Validation
    ↓
PUT /api/user/profile/{userId}
    ↓
UserController.updateProfile()
    ↓
Validate Duplicates
    ↓
UserService.update()
    ↓
UserRepository.save()
    ↓
MySQL Update
    ↓
Return Updated User
    ↓
JavaScript Updates UI
    ↓
Display Success Message
```

---

## Technology Choices & Justification

### Spring Boot
- **Why:** Fast development, convention over configuration
- **Benefits:** Built-in security, database integration, email support

### Spring Security
- **Why:** Industry-standard security framework
- **Benefits:** Authentication, authorization, CSRF protection

### MySQL
- **Why:** Reliable relational database
- **Benefits:** ACID compliance, indexing, proven at scale

### Vanilla JavaScript
- **Why:** No dependencies, full control
- **Benefits:** Lightweight, simple, fast loading

### REST API
- **Why:** Standard architectural style
- **Benefits:** Stateless, scalable, language-independent

---

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Session storage in localStorage (frontend)
- Database as single source of truth

### Caching Strategy
- Database query optimization
- Index creation
- Connection pooling

### Load Balancing
- Stateless APIs enable load balancing
- Session affinity not required
- Database replication possible

---

## Security Layers

### Frontend Security
- Input validation
- XSS prevention
- CSRF tokens

### Backend Security
- Spring Security
- CORS configuration
- Input sanitization

### Database Security
- Parameterized queries
- Role-based access
- Password hashing

### Transport Security
- HTTPS recommended
- TLS encryption
- Secure headers

---

## Performance Optimization

### Database
- Indexes on frequently queried columns
- Connection pooling (HikariCP)
- Query optimization

### Application
- Lazy loading
- Caching layer
- Compression

### Frontend
- Minified CSS/JS
- Image optimization
- Responsive images

---

## Error Handling

### Global Exception Handling
- Custom exception classes
- Exception advice/handlers
- Proper HTTP status codes

### Validation
- Input validation at controller level
- Business logic validation at service level
- Database constraints

### Logging
- Log important events
- Debug mode for development
- Production logs for monitoring

---

**Architecture designed for scalability, maintainability, and security! 🏛️**
