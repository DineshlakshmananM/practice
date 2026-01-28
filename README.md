# TechySpine - Professional Learning Platform

## 🚀 Quick Start

```bash
# Build
mvn clean package

# Run
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

**Access:** http://localhost:8082/

---

## 📚 Documentation

All comprehensive documentation is available in the `docs/` folder:

- **[COMPREHENSIVE_DOCUMENTATION.md](docs/COMPREHENSIVE_DOCUMENTATION.md)** - Complete guide covering:
  - Project overview
  - Architecture & design
  - Feature implementation
  - API endpoints
  - Database schema
  - Configuration setup
  - Testing guide
  - Troubleshooting
  - Deployment guide

---

## ✨ Key Features

✅ **Professional Landing Page** - Modern UI/UX with conversion optimization  
✅ **User Authentication** - Login, registration, Google OAuth  
✅ **Password Recovery** - Email-based password reset (24-hour tokens)  
✅ **User Profiles** - Profile editing with stats tracking  
✅ **Responsive Design** - Mobile, tablet, and desktop support  
✅ **Security First** - Secure authentication, CORS, validation  
✅ **REST API** - Well-designed endpoints with JSON responses  

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Spring Boot 3.5.10 |
| Security | Spring Security 6.4.3 |
| Database | MySQL 8.0 |
| Frontend | Vanilla JavaScript ES6+ |
| Java | Java 21 |

---

## 📂 Project Structure

```
/workspaces/practice/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── config/        (Configuration classes)
│   │   │   ├── controller/     (REST controllers)
│   │   │   ├── service/        (Business logic)
│   │   │   ├── entity/         (Database models)
│   │   │   ├── repository/     (Data access)
│   │   │   └── dto/            (Request/Response DTOs)
│   │   └── resources/
│   │       ├── static/         (HTML, CSS, JS)
│   │       └── application.properties
│   └── test/
├── docs/                       (All documentation)
├── pom.xml                     (Maven dependencies)
├── docker-compose.yml          (Docker setup)
└── README.md                   (This file)
```

---

## 🔧 Configuration

Create `src/main/resources/application.properties`:

```properties
# Server
server.port=8082

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/techyspine
spring.datasource.username=appuser
spring.datasource.password=password

# Email (for password recovery)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.base-url=http://localhost:8082
app.mail.from=noreply@techyspine.com

# Google OAuth (optional)
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

---

## 📖 Full Documentation

For complete documentation including setup, API endpoints, testing guide, and troubleshooting, see: [docs/COMPREHENSIVE_DOCUMENTATION.md](docs/COMPREHENSIVE_DOCUMENTATION.md)

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/user/profile/{userId} | Get user profile |
| PUT | /api/user/profile/{userId} | Update user profile |

---

## 📄 Pages

- **index.html** - Professional landing page
- **login.html** - Login & registration
- **dashboard.html** - Main dashboard
- **profile.html** - User profile
- **learning.html** - Learning center
- **practice.html** - Practice problems

---

## 🧪 Testing

See [docs/COMPREHENSIVE_DOCUMENTATION.md#-testing-guide](docs/COMPREHENSIVE_DOCUMENTATION.md#-testing-guide) for detailed testing scenarios.

---

## 🚀 Deployment

See [docs/COMPREHENSIVE_DOCUMENTATION.md#-build--deployment](docs/COMPREHENSIVE_DOCUMENTATION.md#-build--deployment) for deployment instructions.

---

## 📋 Requirements

- Java 21+
- Maven 3.6+
- MySQL 8.0+
- Docker (optional, for database)

---

## 🤝 Support

For issues and troubleshooting, see [docs/COMPREHENSIVE_DOCUMENTATION.md#-troubleshooting](docs/COMPREHENSIVE_DOCUMENTATION.md#-troubleshooting)

---

**Last Updated:** January 25, 2026  
**Status:** ✅ Production Ready