# ⚡ Quick Start Guide

## Build & Run

### Build the Application
```bash
cd /workspaces/practice
mvn clean package
```

Or skip tests for faster build:
```bash
mvn clean package -DskipTests
```

### Run the Application
```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Or using Spring Boot Maven plugin:
```bash
mvn spring-boot:run
```

---

## Access the Application

| Page | URL |
|------|-----|
| Landing Page | http://localhost:8082/ |
| Login Page | http://localhost:8082/login.html |
| Dashboard | http://localhost:8082/dashboard.html |
| Profile | http://localhost:8082/profile.html |
| Learning | http://localhost:8082/learning.html |
| Practice | http://localhost:8082/practice.html |

---

## Requirements

- **Java:** 21 or higher
- **Maven:** 3.6 or higher
- **MySQL:** 8.0 or higher
- **Browser:** Modern browser (Chrome, Firefox, Safari, Edge)

---

## First Time Setup

1. **Build the project**
   ```bash
   mvn clean package
   ```

2. **Configure application.properties** (see [Configuration Setup](08-CONFIGURATION.md))
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/techyspine
   spring.datasource.username=appuser
   spring.datasource.password=password
   ```

3. **Start MySQL database** (if using Docker)
   ```bash
   docker-compose up -d
   ```

4. **Run the application**
   ```bash
   java -jar target/demo-0.0.1-SNAPSHOT.jar
   ```

5. **Open in browser**
   ```
   http://localhost:8082/
   ```

---

## Basic Usage

### Register an Account
1. Go to http://localhost:8082/login.html
2. Click "Create New Account"
3. Fill in username, email, password
4. Click "Register"
5. Auto-logged in, redirected to dashboard

### Login
1. Go to http://localhost:8082/login.html
2. Enter email and password
3. Click "Login"
4. Redirected to dashboard

### Edit Profile
1. Login to the application
2. Click profile icon in navbar
3. Click "My Profile"
4. Click "Edit Profile"
5. Update information and save

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `mvn clean package` | Full build with tests |
| `mvn clean package -DskipTests` | Fast build, skip tests |
| `mvn spring-boot:run` | Run from Maven |
| `mvn clean -U package` | Force update dependencies |
| `docker-compose up -d` | Start MySQL with Docker |
| `docker-compose down` | Stop Docker containers |

---

## Project Structure

```
/workspaces/practice/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   └── resources/
│   │       ├── static/ (HTML, CSS, JS)
│   │       └── application.properties
│   └── test/
├── docs/ (Documentation)
├── target/ (Build output)
├── pom.xml
├── docker-compose.yml
└── README.md
```

---

## Build Output

After building, find these files:
```
target/
├── demo-0.0.1-SNAPSHOT.jar (Executable JAR)
├── demo-0.0.1-SNAPSHOT.jar.original
├── classes/ (Compiled classes)
├── generated-sources/
└── maven-status/
```

---

## Next Steps

1. **Understand the architecture:** See [Architecture & Design](03-ARCHITECTURE.md)
2. **Configure email & OAuth:** See [Configuration Setup](08-CONFIGURATION.md)
3. **Test all features:** See [Testing Guide](09-TESTING-GUIDE.md)
4. **Deploy to production:** See [Deployment Guide](11-DEPLOYMENT.md)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8082
sudo kill -9 $(lsof -t -i:8082)
```

### Database Connection Error
```bash
# Check MySQL status
docker ps | grep mysql

# Restart MySQL
docker restart mysql-db
```

### Maven Build Issues
```bash
# Clear cache and rebuild
mvn clean -U package
```

See [Troubleshooting Guide](10-TROUBLESHOOTING.md) for more help.

---

**Ready to go! 🚀**
