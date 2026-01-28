# ⚙️ Configuration Guide

## Environment Setup

### Prerequisites
- Java 21
- Maven 3.6+
- MySQL 8.0+
- Git

### Development Environment

#### 1. Project Setup
```bash
# Clone or extract project
cd /workspaces/practice

# Build project
./mvnw clean package

# Run application
./mvnw spring-boot:run
```

#### 2. Access Points
- Frontend: http://localhost:8082
- API Swagger: http://localhost:8082/swagger-ui.html (if added)
- Database: localhost:3306/techyspine

---

## Application Properties Configuration

### File Location
```
src/main/resources/application.properties
```

### Core Application Properties

```properties
# Server Configuration
server.port=8082
server.servlet.context-path=/
spring.application.name=techyspine

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Database Connection
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/techyspine?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.hikari.maximum-pool-size=10

# Logging
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
```

---

## Email Configuration (Gmail SMTP)

### Step 1: Enable Gmail App Password
1. Go to myaccount.google.com
2. Navigate to Security → 2-Step Verification (enable if not active)
3. Go back to Security
4. Find "App passwords" at the bottom
5. Select Mail and Windows Computer
6. Google generates 16-character password
7. Copy the password (without spaces)

### Step 2: Configure application.properties

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# Custom App Email Config
app.mail.from=noreply@techyspine.com
app.mail.from-name=TechySpine Support
app.base-url=http://localhost:8082
```

### Step 3: Test Email Configuration
```java
// In EmailService, send test email
@Test
void testEmailConfiguration() {
    String testEmail = "your-test@gmail.com";
    String message = "Test email from TechySpine";
    
    // This will use configured SMTP settings
    simpleMailMessage.setTo(testEmail);
    simpleMailMessage.setSubject("Test");
    simpleMailMessage.setText(message);
    mailSender.send(simpleMailMessage);
}
```

---

## Google OAuth Configuration

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "TechySpine"
3. Enable OAuth 2.0 Consent Screen:
   - User Type: External
   - Fill required scopes: email, profile

### Step 2: Create OAuth Credentials
1. Go to Credentials → Create OAuth 2.0 Client ID
2. Application Type: Web application
3. Authorized Redirect URIs:
   - `http://localhost:8082/login/oauth2/code/google` (dev)
   - `https://yourdomain.com/login/oauth2/code/google` (prod)
4. Copy Client ID and Client Secret

### Step 3: Configure application.properties

```properties
# Google OAuth Configuration
spring.security.oauth2.client.registration.google.client-id=your-client-id.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=your-client-secret
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.client-name=Google

# Provider configuration
spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/v2/auth
spring.security.oauth2.client.provider.google.token-uri=https://www.googleapis.com/oauth2/v4/token
spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v1/userinfo
spring.security.oauth2.client.provider.google.jwk-set-uri=https://www.googleapis.com/oauth2/v3/certs
spring.security.oauth2.client.provider.google.user-name-attribute=sub
```

### Step 4: Test OAuth Login Flow
1. Go to http://localhost:8082
2. Click "Login with Google"
3. Authenticate with Google account
4. Redirected back to dashboard

---

## MySQL Database Setup

### Step 1: Create Database
```sql
CREATE DATABASE techyspine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Create User (Optional but Recommended)
```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON techyspine.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Update Connection String
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/techyspine?useSSL=false&serverTimezone=UTC
spring.datasource.username=appuser
spring.datasource.password=secure_password
```

### Step 4: Run Application
- Hibernate auto-creates tables (ddl-auto=update)
- Connection pool: HikariCP (default)

### View Database
```bash
# Connect to MySQL
mysql -u appuser -p techyspine

# Show tables
SHOW TABLES;

# Describe users table
DESCRIBE users;

# View sample users
SELECT * FROM users LIMIT 5;
```

---

## Spring Security Configuration

### Current Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/", "/login", "/register", "/public/**").permitAll()
                .antMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .oauth2Login()
                .defaultSuccessUrl("/dashboard")
            .and()
            .logout();
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:8082", "https://yourdomain.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## Property Binding with AppProperties

### AppProperties.java
```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String baseUrl;
    private Mail mail;
    
    public static class Mail {
        private String from;
        private String fromName;
        
        // Getters and setters
    }
    
    // Getters and setters
}
```

### Usage in Service
```java
@Service
public class EmailService {
    
    private final AppProperties appProperties;
    
    @Autowired
    public EmailService(AppProperties appProperties, JavaMailSender mailSender) {
        this.appProperties = appProperties;
        this.mailSender = mailSender;
    }
    
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(appProperties.getMail().getFrom());
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
```

---

## Performance Tuning

### Database Connection Pool
```properties
# HikariCP Configuration
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
```

### JPA/Hibernate Optimization
```properties
# Batch size for bulk operations
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Query optimization
spring.jpa.properties.hibernate.generate_statistics=false
spring.jpa.properties.hibernate.use_sql_comments=true

# Cache settings
spring.jpa.properties.hibernate.cache.use_second_level_cache=false
```

### Logging Configuration (logback.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
    </root>
    
    <logger name="com.example.demo" level="DEBUG" />
</configuration>
```

---

## Profile-Specific Configuration

### application-dev.properties
```properties
server.port=8082
spring.jpa.hibernate.ddl-auto=update
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
```

### application-prod.properties
```properties
server.port=8080
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
spring.datasource.hikari.maximum-pool-size=30
```

### Run with Profile
```bash
# Development
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Production
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

---

## Environment Variables

### For Production Deployment
```bash
# Export before running
export DB_HOST=your-db-host
export DB_USER=your-db-user
export DB_PASSWORD=your-secure-password
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export OAUTH2_CLIENT_ID=your-client-id
export OAUTH2_CLIENT_SECRET=your-client-secret
export APP_BASE_URL=https://yourdomain.com
```

### Docker Environment File (.env)
```env
MYSQL_HOST=mysql
MYSQL_USER=appuser
MYSQL_PASSWORD=secure_password
MYSQL_DATABASE=techyspine

MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

OAUTH2_CLIENT_ID=your-client-id
OAUTH2_CLIENT_SECRET=your-client-secret
APP_BASE_URL=https://yourdomain.com
```

---

## Configuration Validation Checklist

- [ ] Database connection working
- [ ] Email SMTP configured and tested
- [ ] Google OAuth credentials added
- [ ] Base URL configured correctly
- [ ] Password encoder set to BCrypt
- [ ] CORS settings configured
- [ ] Logging level appropriate
- [ ] Connection pool settings optimized
- [ ] Profiles set for environment
- [ ] All required properties defined

**Configuration complete! Ready for development or deployment.** ⚙️
