# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## Build & Compilation Issues

### Issue: "Maven build fails"

#### Error: `java.lang.RuntimeException: Unsupported class version`
```
Error: Unsupported class version 65.0
```

**Solution:**
```bash
# Check Java version (should be 21)
java -version

# Update if needed
export JAVA_HOME=/path/to/java-21

# Clean and rebuild
./mvnw clean install
```

---

### Issue: "Package not found during build"

#### Error: `[ERROR] Failed to execute goal on project demo`

**Solution:**
```bash
# Update Maven cache
./mvnw clean install -U

# Check internet connection
ping repo.maven.apache.org

# Use alternative Maven mirror
./mvnw -Dmaven.wagon.http.ssl.insecure=true clean install
```

---

### Issue: "Module source level issue"

#### Error: `[ERROR] Source option X is not supported. Use 21 or less`

**Solution - Edit pom.xml:**
```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
</properties>
```

---

## Database Connection Issues

### Issue: "Cannot connect to MySQL"

#### Error: `com.mysql.cj.jdbc.exceptions.CommunicationsException`

**Checklist:**
```bash
# 1. Check MySQL is running
sudo systemctl status mysql

# 2. Check connection credentials
mysql -h localhost -u root -p techyspine

# 3. Verify connection string in application.properties
# Should be: jdbc:mysql://localhost:3306/techyspine

# 4. Check user permissions
SHOW GRANTS FOR 'root'@'localhost';

# 5. Check database exists
SHOW DATABASES;

# 6. Restart MySQL
sudo systemctl restart mysql
```

**Solution - application.properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/techyspine?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

---

### Issue: "MySQL server has gone away"

#### Error: `The server closed the connection unexpectedly`

**Solution:**
```properties
# Add connection pool configuration
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000

# Add validation query
spring.datasource.hikari.validation-query=SELECT 1
```

---

### Issue: "Tables not created automatically"

#### Problem: Tables missing after first run

**Solution:**
```properties
# Check hibernate.ddl-auto setting
spring.jpa.hibernate.ddl-auto=create  # Creates fresh on each start

# OR for update (safer for production)
spring.jpa.hibernate.ddl-auto=update

# Check logs
./mvnw spring-boot:run | grep "CREATE TABLE"

# Manual table creation
mysql -u root -p techyspine < schema.sql
```

---

## Email Service Issues

### Issue: "Emails not sending"

#### Error: `javax.mail.AuthenticationFailedException`

**Solution - Check Gmail App Password:**
```bash
# 1. Go to myaccount.google.com
# 2. Security → App passwords
# 3. Generate new app-specific password
# 4. Use 16-character password (without spaces)

# In application.properties:
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx  # Without spaces
```

---

### Issue: "SMTP connection timeout"

#### Error: `Connection timed out to SMTP server`

**Solution - Update SMTP config:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Timeout configuration
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=10000
spring.mail.properties.mail.smtp.timeout=10000
spring.mail.properties.mail.smtp.writetimeout=10000

# For corporate networks using proxy
spring.mail.properties.mail.smtp.socks.host=proxy.company.com
spring.mail.properties.mail.smtp.socks.port=1080
```

---

### Issue: "TLS handshake failure"

#### Error: `javax.net.ssl.SSLHandshakeException`

**Solution:**
```properties
# Disable SSL certificate verification (dev only!)
spring.mail.properties.mail.smtp.ssl.protocols=TLSv1.2

# OR update trust store
-Djavax.net.ssl.trustStore=/path/to/cacerts
```

---

### Issue: "Email template not found"

**Solution - Check file paths:**
```bash
# Email templates should be in
src/main/resources/templates/

# If using inline HTML:
String htmlBody = "<html><body>...</body></html>";
message.setText(htmlBody, "UTF-8");
```

---

## OAuth Login Issues

### Issue: "OAuth login not working"

#### Error: `Client ID mismatch or redirect URI mismatch`

**Checklist:**
```bash
# 1. Verify Google Cloud credentials
# Go to console.cloud.google.com
# Check Credentials section for:
#   - Valid Client ID
#   - Valid Client Secret

# 2. Check redirect URIs match exactly
# In Google Cloud Console:
# http://localhost:8082/login/oauth2/code/google

# In application.properties:
spring.security.oauth2.client.registration.google.client-id=xxx
spring.security.oauth2.client.registration.google.client-secret=xxx

# 3. Verify scopes
spring.security.oauth2.client.registration.google.scope=profile,email
```

---

### Issue: "Invalid redirect URI"

#### Error: `The redirect URI in the request does not match the redirect URI in the authorization request`

**Solution:**
```properties
# Ensure exact match in Google Cloud Console
# EXACTLY as registered:
http://localhost:8082/login/oauth2/code/google

# Production URL must also be registered:
https://yourdomain.com/login/oauth2/code/google
```

---

### Issue: "OAuth provider configuration missing"

#### Error: `Unable to resolve Configuration for Registration ID 'google'`

**Solution - Add provider config:**
```properties
spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/v2/auth
spring.security.oauth2.client.provider.google.token-uri=https://www.googleapis.com/oauth2/v4/token
spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v1/userinfo
spring.security.oauth2.client.provider.google.jwk-set-uri=https://www.googleapis.com/oauth2/v3/certs
spring.security.oauth2.client.provider.google.user-name-attribute=sub
```

---

## Password Reset Issues

### Issue: "Reset token not found"

#### Error: `Invalid or expired token`

**Solution:**
```bash
# 1. Check token in password_reset_tokens table
mysql -u root -p techyspine
SELECT * FROM password_reset_tokens WHERE token = 'your-token';

# 2. Verify token hasn't expired
# Expiry is 24 hours from creation
SELECT CURRENT_TIMESTAMP, expiry_time FROM password_reset_tokens LIMIT 1;

# 3. Check token hasn't been used
SELECT used FROM password_reset_tokens WHERE token = 'your-token';

# 4. Regenerate if needed
DELETE FROM password_reset_tokens WHERE user_id = 1;
```

---

### Issue: "Token expired but user still trying"

**Solution:**
```bash
# Auto-cleanup expired tokens (scheduled task)
DELETE FROM password_reset_tokens 
WHERE expiry_time < NOW() AND used = true;

# Send new reset link
POST /api/auth/forgot-password
{
    "email": "user@example.com"
}
```

---

### Issue: "Password reset page not loading"

#### Problem: Token from URL not recognized

**Solution - Check URL format:**
```
Correct: http://localhost:8082/reset-password?token=550e8400-e29b-41d4-a716-446655440000
Wrong: http://localhost:8082/reset-password.html?token=xxx
```

**Check reset-password.html:**
```javascript
// In reset-password.html, get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    document.body.innerHTML = '<p>Invalid reset link</p>';
}
```

---

## Authentication & Security Issues

### Issue: "Session expires too quickly"

**Solution - Configure session timeout:**
```properties
server.servlet.session.timeout=30m
spring.session.timeout=30m
```

---

### Issue: "JWT token invalid"

#### Error: `Invalid JWT token`

**Solution:**
```java
// Check token generation in AuthController
String token = jwtProvider.generateToken(user);

// Verify token expiry
Long expiryTime = jwtProvider.getExpiryTime();

// Check secret key
spring.jwt.secret=your-secret-key-here
spring.jwt.expiration=86400000  // 24 hours
```

---

### Issue: "CORS error in browser"

#### Error: `Access to XMLHttpRequest blocked by CORS policy`

**Solution - Configure CORS:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:8082")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## Frontend Issues

### Issue: "Page not loading styles"

#### Problem: CSS files not found

**Solution:**
```bash
# Check CSS file location
ls src/main/resources/static/css/

# Correct paths in HTML
<link rel="stylesheet" href="/css/theme.css">
<link rel="stylesheet" href="/css/dashboard.css">

# Ensure static resources are included in build
# Check pom.xml includes <include>**/*.css</include>
```

---

### Issue: "JavaScript errors in console"

#### Error: `Cannot read property 'localStorage' of undefined`

**Solution:**
```javascript
// Check localStorage availability
if (typeof(Storage) !== "undefined") {
    localStorage.setItem("token", token);
} else {
    console.error("localStorage not available");
}
```

---

### Issue: "Images not loading"

**Solution:**
```bash
# Check image paths
# Static images: src/main/resources/static/assets/images/

# In HTML:
<img src="/assets/images/logo.png">

# Build includes images
./mvnw clean package
ls target/classes/static/assets/images/
```

---

### Issue: "Login redirect not working"

**Solution - Check navigation logic:**
```javascript
// In auth.js
if (response.token) {
    localStorage.setItem('token', response.token);
    window.location.href = '/dashboard';  // Redirect to dashboard
}
```

---

## Performance Issues

### Issue: "Application runs slowly"

**Solution:**
```bash
# 1. Check database queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

# 2. Monitor JVM memory
jps -l
jmap -heap <process-id>

# 3. Profile with Spring Boot Actuator
http://localhost:8082/actuator

# 4. Check connection pool
spring.datasource.hikari.maximum-pool-size=20

# 5. Enable query caching
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
```

---

### Issue: "High memory usage"

**Solution:**
```bash
# Set JVM memory limits
export JAVA_OPTS="-Xms512m -Xmx1024m"
./mvnw spring-boot:run

# Check memory leaks
# Profile application
# Review long-running operations
```

---

## Port & Network Issues

### Issue: "Port 8082 already in use"

```bash
# Find process using port
lsof -i :8082

# Kill process (if safe)
kill -9 <PID>

# OR use different port
export SERVER_PORT=8083
./mvnw spring-boot:run
```

---

### Issue: "Cannot access application from another machine"

**Solution:**
```properties
# Change server binding from localhost to all interfaces
server.address=0.0.0.0
server.port=8082

# Update CORS for remote access
spring.security.oauth2.client.registration.google.redirect-uris=http://your-ip:8082/login/oauth2/code/google
```

---

## Logging & Debugging

### Enable Debug Logging

```properties
# In application.properties
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.mail=DEBUG
logging.level.org.springframework.oauth2=DEBUG
```

### View Logs
```bash
# While running
./mvnw spring-boot:run | tee app.log

# View specific component
tail -f app.log | grep "EmailService"

# Check SQL statements
grep "Hibernate" app.log
```

---

## Quick Diagnostic Commands

```bash
# Check application status
curl http://localhost:8082/

# Check API health
curl http://localhost:8082/api/auth/

# Test database connection
mysql -h localhost -u root -p techyspine -e "SELECT 1;"

# Check logs for errors
./mvnw spring-boot:run 2>&1 | grep -i error

# Monitor system resources
watch -n 1 'ps aux | grep java'
```

---

## Getting Help

### When asking for help, provide:
1. **Error message** (complete stack trace)
2. **Steps to reproduce**
3. **Configuration** (sanitized application.properties)
4. **Logs** (last 50 lines of output)
5. **Environment** (Java version, MySQL version, OS)

### Useful Links
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Security: https://spring.io/projects/spring-security
- MySQL Documentation: https://dev.mysql.com/doc/
- OAuth2: https://tools.ietf.org/html/rfc6749

**Troubleshooting complete! Your issue should be resolved.** ✅
