# 🗄️ Database Schema

## Database Overview

| Table | Purpose | Rows Type |
|-------|---------|-----------|
| users | User accounts & profiles | Master |
| password_reset_tokens | Password reset tokens | Transactional |
| courses | Programming courses | Master |
| problems | Practice problems | Master |
| progress | User progress tracking | Transactional |

---

## Users Table

### Schema
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500),
    problems_solved INT DEFAULT 0,
    learning_streak INT DEFAULT 0,
    skill_rating DOUBLE DEFAULT 0,
    skills VARCHAR(500),
    provider VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

### Columns Description

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | Primary key, auto-increment |
| username | VARCHAR(50) | Unique identifier, searchable |
| email | VARCHAR(100) | Unique, used for login |
| password | VARCHAR(255) | Hashed password |
| profile_image | VARCHAR(500) | Base64 or URL |
| problems_solved | INT | Counter, default 0 |
| learning_streak | INT | Days, default 0 |
| skill_rating | DOUBLE | 0-5 scale, default 0 |
| skills | VARCHAR(500) | Comma-separated list |
| provider | VARCHAR(20) | 'local', 'google', etc. |
| created_at | TIMESTAMP | Auto-set on insert |
| last_login | TIMESTAMP | Updated on login |
| updated_at | TIMESTAMP | Auto-updated on change |

### Constraints
- username: Unique, Not Null
- email: Unique, Not Null
- password: Not Null
- provider: Defaults to 'local'

### Example Data
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...", // BCrypt hash
  "profile_image": "data:image/jpeg;base64,...",
  "problems_solved": 45,
  "learning_streak": 12,
  "skill_rating": 4.5,
  "skills": "Java,Python,C",
  "provider": "local",
  "created_at": "2025-01-15 10:30:00",
  "last_login": "2025-01-25 14:20:00",
  "updated_at": "2025-01-25 14:20:00"
}
```

---

## Password Reset Tokens Table (NEW)

### Schema
```sql
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expiry_time (expiry_time),
    INDEX idx_used (used)
);
```

### Columns Description

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | Primary key |
| token | VARCHAR(255) | UUID, unique, searchable |
| user_id | BIGINT | Foreign key to users |
| expiry_time | TIMESTAMP | 24 hours from creation |
| used | BOOLEAN | Whether already used |
| created_at | TIMESTAMP | When token created |

### Constraints
- token: Unique, Not Null
- user_id: Foreign Key, Not Null
- expiry_time: Not Null
- used: Default false

### Example Data
```json
{
  "id": 1,
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": 1,
  "expiry_time": "2025-01-26 10:30:00",
  "used": false,
  "created_at": "2025-01-25 10:30:00"
}
```

### Token Lifecycle
1. **Created:** When user requests password reset
2. **Sent:** Via email to user
3. **Used:** When user submits new password
4. **Expires:** After 24 hours
5. **Deleted:** (Optional) After expiry period

---

## Entity Relationships

### Diagram
```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ password    │
│ ...         │
└──────┬──────┘
       │ 1
       │
       │ N
       │
┌──────┴──────────────────────┐
│PasswordResetTokens          │
├─────────────────────────────┤
│ id (PK)                     │
│ token                       │
│ user_id (FK) ──────────────┘
│ expiry_time                 │
│ used                        │
└─────────────────────────────┘
```

### Relationships
- **1 User** has **Many PasswordResetTokens**
- **1 PasswordResetToken** belongs to **1 User**
- Delete user → Delete all tokens (CASCADE)

---

## Indexes

### Performance Indexes
```sql
-- Users table
CREATE INDEX idx_username ON users(username);       -- Fast username lookup
CREATE INDEX idx_email ON users(email);             -- Fast email lookup
CREATE INDEX idx_created_at ON users(created_at);   -- Date range queries

-- Password Reset Tokens table
CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_expiry_time ON password_reset_tokens(expiry_time);
CREATE INDEX idx_used ON password_reset_tokens(used);
```

### Query Optimization
- Username/email lookup: O(log n)
- Token lookup: O(log n)
- User by ID: O(1)
- Expiry check: O(log n)

---

## Sample Queries

### Get User by Email
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

### Check Username Availability
```sql
SELECT COUNT(*) FROM users WHERE username = 'john_doe';
```

### Find Valid Reset Token
```sql
SELECT * FROM password_reset_tokens 
WHERE token = 'uuid' 
AND expiry_time > NOW() 
AND used = false;
```

### Get User's Tokens
```sql
SELECT * FROM password_reset_tokens 
WHERE user_id = 1 
ORDER BY created_at DESC;
```

### Mark Token as Used
```sql
UPDATE password_reset_tokens SET used = true WHERE id = 1;
```

### Get User Stats
```sql
SELECT 
    username,
    problems_solved,
    learning_streak,
    skill_rating,
    created_at
FROM users 
WHERE id = 1;
```

### Find Expired Tokens (for cleanup)
```sql
SELECT * FROM password_reset_tokens 
WHERE expiry_time < NOW() AND used = false;
```

---

## Data Constraints

### Users Table
- **username:** 3-50 characters, alphanumeric + underscore
- **email:** Valid email format
- **password:** Minimum 8 chars, hashed (BCrypt)
- **profile_image:** Optional
- **problems_solved:** Non-negative integer
- **learning_streak:** Non-negative integer
- **skill_rating:** 0-5 range

### Password Reset Tokens
- **token:** Must be unique UUID
- **expiry_time:** Must be future timestamp
- **used:** Boolean only

---

## Database Maintenance

### Cleanup Expired Tokens (Scheduled)
```sql
DELETE FROM password_reset_tokens 
WHERE expiry_time < DATE_SUB(NOW(), INTERVAL 30 DAY) 
AND used = true;
```

### User Statistics Update (Periodic)
```sql
UPDATE users SET 
    skill_rating = CASE 
        WHEN problems_solved > 100 THEN 5
        WHEN problems_solved > 50 THEN 4
        WHEN problems_solved > 25 THEN 3
        WHEN problems_solved > 10 THEN 2
        ELSE 1
    END
WHERE problems_solved > 0;
```

### Reset Streaks (Daily at Midnight)
```sql
UPDATE users SET learning_streak = 0 
WHERE last_login < DATE_SUB(CURDATE(), INTERVAL 1 DAY);
```

---

## Backup & Recovery

### Backup Command
```bash
mysqldump -h localhost -u appuser -p techyspine > backup.sql
```

### Restore Command
```bash
mysql -h localhost -u appuser -p techyspine < backup.sql
```

### Scheduled Backup
```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * mysqldump -u appuser -p techyspine > /backups/techyspine_$(date +\%Y\%m\%d).sql
```

---

## Future Schema Extensions

### Courses Table
```sql
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    level VARCHAR(20),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Problems Table
```sql
CREATE TABLE problems (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20),
    description TEXT,
    solution TEXT,
    test_cases TEXT,
    points INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Progress Table
```sql
CREATE TABLE progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    status VARCHAR(20),
    attempts INT,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (problem_id) REFERENCES problems(id)
);
```

---

**Database schema designed for scalability and performance! 💾**
