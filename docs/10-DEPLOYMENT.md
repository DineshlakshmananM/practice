# 🚀 Deployment Guide

## Deployment Overview

### Deployment Options
| Option | Best For | Complexity |
|--------|----------|------------|
| Docker | Production containers | Medium |
| Docker Compose | Local multi-container | Low |
| Direct JAR | Simple VPS | Medium |
| Cloud Platforms | Scalability | Medium-High |
| Kubernetes | Enterprise | High |

---

## Local Docker Deployment

### Prerequisites
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify installation
docker --version
docker-compose --version
```

### Build Docker Image

#### Option 1: Using Dockerfile
```dockerfile
# Create src/main/docker/Dockerfile

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy built JAR
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher -health

# Expose port
EXPOSE 8082

# Run application
ENTRYPOINT ["java","-jar","app.jar"]
```

#### Option 2: Multi-stage Build (Optimized)
```dockerfile
# Build stage
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /build
COPY . .
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]
```

#### Build Command
```bash
# Build Docker image
docker build -t techyspine:1.0 -f src/main/docker/Dockerfile .

# Tag for registry
docker tag techyspine:1.0 yourusername/techyspine:latest

# Verify build
docker images | grep techyspine
```

---

### Docker Compose Setup

#### docker-compose.yml
```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: techyspine_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: techyspine
      MYSQL_USER: appuser
      MYSQL_PASSWORD: app_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - techyspine_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Spring Boot Application
  app:
    build:
      context: .
      dockerfile: src/main/docker/Dockerfile
    container_name: techyspine_app
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/techyspine?useSSL=false
      SPRING_DATASOURCE_USERNAME: appuser
      SPRING_DATASOURCE_PASSWORD: app_password
      SPRING_MAIL_HOST: smtp.gmail.com
      SPRING_MAIL_PORT: 587
      SPRING_MAIL_USERNAME: ${MAIL_USERNAME}
      SPRING_MAIL_PASSWORD: ${MAIL_PASSWORD}
      SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      APP_BASE_URL: http://localhost:8082
    ports:
      - "8082:8082"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - techyspine_network
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  techyspine_network:
    driver: bridge
```

#### Environment File (.env)
```env
# Database
MYSQL_ROOT_PASSWORD=root_password
MYSQL_USER=appuser
MYSQL_PASSWORD=app_password

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App Configuration
APP_BASE_URL=http://localhost:8082
```

#### Launch Containers
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

---

## VPS Deployment (Direct JAR)

### Step 1: Prepare Server

```bash
# SSH to server
ssh user@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install openjdk-21-jdk -y

# Install MySQL
sudo apt install mysql-server -y

# Verify installations
java -version
mysql --version
```

### Step 2: Setup Database

```bash
# SSH to VPS
ssh user@your-vps-ip

# Create database and user
mysql -u root -p
> CREATE DATABASE techyspine;
> CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'secure_password';
> GRANT ALL PRIVILEGES ON techyspine.* TO 'appuser'@'localhost';
> FLUSH PRIVILEGES;
> EXIT;
```

### Step 3: Deploy Application

```bash
# Create application directory
mkdir -p /opt/techyspine

# Upload JAR file (from local machine)
scp target/demo-0.0.1-SNAPSHOT.jar user@your-vps-ip:/opt/techyspine/

# SSH to VPS
ssh user@your-vps-ip

# Create application properties
cat > /opt/techyspine/application.properties << EOF
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/techyspine?useSSL=false
spring.datasource.username=appuser
spring.datasource.password=secure_password
spring.jpa.hibernate.ddl-auto=update

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-client-secret

app.base-url=https://yourdomain.com
app.mail.from=noreply@yourdomain.com
app.mail.from-name=TechySpine Support
EOF
```

### Step 4: Create Systemd Service

```bash
# Create service file
sudo cat > /etc/systemd/system/techyspine.service << EOF
[Unit]
Description=TechySpine Application
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/techyspine
ExecStart=java -jar -Dspring.config.location=file:/opt/techyspine/application.properties demo-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Create app user
sudo useradd -r -s /bin/bash appuser

# Change ownership
sudo chown -R appuser:appuser /opt/techyspine

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable techyspine
sudo systemctl start techyspine

# Check status
sudo systemctl status techyspine
sudo journalctl -u techyspine -f
```

### Step 5: Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo cat > /etc/nginx/sites-available/techyspine << EOF
upstream techyspine_backend {
    server localhost:8082;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Client upload limit
    client_max_body_size 10M;
    
    # Proxy configuration
    location / {
        proxy_pass http://techyspine_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/html text/css text/javascript application/json;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/techyspine /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Cloud Deployment (AWS Example)

### AWS EC2 + RDS Setup

#### 1. Launch EC2 Instance
```bash
# AMI: Ubuntu 22.04
# Instance type: t3.medium
# Security group: Allow 80, 443, 3306 (RDS)
```

#### 2. RDS MySQL Database
```bash
# Create RDS MySQL 8.0
# DB instance class: db.t3.small
# Multi-AZ: Yes (for high availability)
# Backup retention: 7 days
# Storage: 20 GB, gp3
```

#### 3. Environment Variables
```bash
# Set in .env or export
export DB_HOST=rds-instance.xxx.amazonaws.com
export DB_USER=appuser
export DB_PASSWORD=your-secure-password
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export OAUTH2_CLIENT_ID=your-client-id
export OAUTH2_CLIENT_SECRET=your-client-secret
```

#### 4. Deploy Application
```bash
# Same as VPS deployment steps above
# Update application.properties with RDS endpoint
spring.datasource.url=jdbc:mysql://rds-instance.xxx.amazonaws.com:3306/techyspine

# Deploy and run
./deploy.sh
```

---

## Kubernetes Deployment

### Prerequisites
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Create deployment manifests
mkdir -p k8s/
```

### Deployment YAML
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: techyspine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: techyspine
  template:
    metadata:
      labels:
        app: techyspine
    spec:
      containers:
      - name: techyspine
        image: yourusername/techyspine:latest
        ports:
        - containerPort: 8082
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:mysql://mysql-service:3306/techyspine"
        - name: SPRING_DATASOURCE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /
            port: 8082
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Service YAML
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: techyspine-service
spec:
  type: LoadBalancer
  selector:
    app: techyspine
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8082
```

### Deploy to Kubernetes
```bash
# Create secret for database credentials
kubectl create secret generic db-secret \
  --from-literal=username=appuser \
  --from-literal=password=secure_password

# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/techyspine
```

---

## Monitoring & Health Checks

### Spring Boot Actuator
```properties
# Enable actuator endpoints
management.endpoints.web.exposure.include=health,metrics,info
management.endpoint.health.show-details=always
```

### Health Check Endpoint
```bash
# Check application health
curl http://localhost:8082/actuator/health

# Response:
# {
#   "status": "UP",
#   "components": {
#     "db": {"status": "UP"},
#     "mail": {"status": "UP"}
#   }
# }
```

### Monitoring Stack (Prometheus + Grafana)
```yaml
# docker-compose-monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

---

## Performance Optimization

### JVM Tuning
```bash
# Set in service or environment
export JAVA_OPTS="-Xms1g -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_created ON users(created_at);

-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Caching Configuration
```properties
# Enable caching
spring.cache.type=simple

# Or use Redis
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.type=redis
```

---

## Deployment Checklist

- [ ] Build successful (`./mvnw clean package`)
- [ ] Docker image built and tested
- [ ] Database created and migrations run
- [ ] Email credentials configured
- [ ] OAuth credentials configured
- [ ] SSL certificate obtained
- [ ] Reverse proxy (Nginx) configured
- [ ] Health checks passing
- [ ] Logs monitoring setup
- [ ] Backup strategy implemented
- [ ] Database backups scheduled
- [ ] Performance tests passed
- [ ] Security scan completed
- [ ] DNS records updated
- [ ] Monitoring alerts configured
- [ ] Runbook documentation created

**Deployment complete! Application is live.** 🚀
