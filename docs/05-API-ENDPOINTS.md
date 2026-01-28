# 🔌 API Endpoints Reference

## Base URL
```
http://localhost:8082/api
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Username already exists"
}
```

---

### Login User
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "url_or_base64"
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Logout User
```
POST /auth/logout

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Forgot Password (Request Reset)
```
POST /auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "john@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset link sent to email",
  "expiryHours": 24
}

Error Response (400):
{
  "success": false,
  "message": "Email not found"
}

Note: Email contains link like:
http://localhost:8082/reset-password?token=uuid-token-here
```

---

### Reset Password (Confirm Reset)
```
POST /auth/reset-password
Content-Type: application/json

Request Body:
{
  "token": "uuid-token-from-email",
  "newPassword": "NewSecurePass123"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset successfully"
}

Error Responses:
{
  "success": false,
  "message": "Token is invalid or expired"
}

OR

{
  "success": false,
  "message": "Password does not meet requirements"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)

---

## User Profile Endpoints

### Get User Profile
```
GET /user/profile/{userId}

Path Parameters:
- userId: Long (required)

Response (200 OK):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "url_or_base64",
    "problemsSolved": 45,
    "learningStreak": 12,
    "skillRating": 4.5,
    "skills": "Java, Python",
    "createdAt": "2025-01-15T10:30:00",
    "lastLogin": "2025-01-25T14:20:00",
    "provider": "local"
  }
}

Error Response (404):
{
  "success": false,
  "message": "User not found"
}
```

---

### Update User Profile
```
PUT /user/profile/{userId}
Content-Type: application/json

Path Parameters:
- userId: Long (required)

Request Body (all optional):
{
  "username": "new_username",
  "email": "new_email@example.com",
  "profileImage": "base64_string_or_url"
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "new_username",
    "email": "new_email@example.com",
    "profileImage": "url_or_base64"
  }
}

Error Responses:
{
  "success": false,
  "message": "Username already taken"
}

OR

{
  "success": false,
  "message": "Email already in use"
}

OR

{
  "success": false,
  "message": "User not found"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication failed |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication

### Session Management (Frontend)
```javascript
// Login - Save to localStorage
localStorage.setItem('userId', response.user.id);
localStorage.setItem('userEmail', response.user.email);
localStorage.setItem('profileImage', response.user.profileImage);

// Logout - Clear localStorage
localStorage.removeItem('userId');
localStorage.removeItem('userEmail');
localStorage.removeItem('profileImage');

// Check if logged in
function isLoggedIn() {
  return localStorage.getItem('userId') !== null;
}
```

### CORS Headers
All requests include CORS headers allowing:
- Origin: * (configurable)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

---

## Request Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8082/api/user/profile/1
```

**Update Profile:**
```bash
curl -X PUT http://localhost:8082/api/user/profile/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username",
    "email": "new_email@example.com"
  }'
```

### Using JavaScript Fetch

```javascript
// Register
fetch('http://localhost:8082/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Login
fetch('http://localhost:8082/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123'
  })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('userId', data.user.id);
});
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Invalid input | Missing/invalid fields | Check request format |
| 401 Unauthorized | Wrong credentials | Verify email/password |
| 404 Not found | Resource doesn't exist | Check userId exists |
| 500 Server error | Server issue | Check server logs |

### Validation Errors

**Username:**
- Required, 3-50 characters
- Alphanumeric + underscore
- Unique in database

**Email:**
- Required, valid format
- Unique in database
- Must be registered

**Password:**
- Required, minimum 8 characters
- Must contain uppercase, lowercase, number
- Never shown in responses

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- 100 requests per minute per IP
- 10 login attempts per 15 minutes
- Email sending: 5 per hour per email

---

## API Versioning

Current API version: `v1` (implicit)

Future versions will use URL prefix:
```
/api/v2/auth/login
/api/v2/user/profile
```

---

## Documentation Tools

- **OpenAPI/Swagger:** Can be added for interactive API docs
- **Postman:** API collection available
- **Thunder Client:** VS Code extension for testing

---

**API endpoints ready for integration! 🚀**
