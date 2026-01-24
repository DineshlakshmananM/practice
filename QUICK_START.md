# TechySpine - Quick Start Guide

## 🚀 What is TechySpine?

TechySpine is a **unified learning platform** combining:
- **W3Schools-style tutorials** - Structured learning content
- **LeetCode-style assessments** - Progress tracking & difficulty levels

## 📚 Currently Available Content

### **C Programming** (5 lessons)
✅ Introduction, Program Structure, Data Types, Operators, Control Statements, Functions

### **Java Programming** (4 lessons)  
✅ Introduction, Installation, Syntax, Data Types

### **MySQL Database** (3 lessons)
✅ Introduction, Installation, Basic Queries

### **More Coming Soon**
- C Arrays, Pointers, Strings, Structures, File Handling, Advanced C
- Java Operators, Control Statements, OOP, Collections, Streams, Exception Handling
- MySQL Joins, Subqueries, Views, Transactions, Optimization

## 🎯 Key Features

### **Learning Content**
- 📖 Professional tutorials with code examples
- 🎨 Consistent dark theme design
- 🔍 Code blocks with syntax highlighting
- 📊 Progress tracking
- 🧭 Easy navigation between topics

### **User Profile (LeetCode-Style)**
- 👤 Profile avatar and user information
- 📊 Statistics dashboard with 4 main metrics
- 📈 Difficulty-based progress bars (Easy/Medium/Hard)
- 📅 Activity calendar (365-day grid)
- 🏆 Badges and achievements
- 💬 Recent activity and solutions tabs

### **Dynamic Data**
- ✨ Real-time progress calculation
- 🔄 Auto-updating statistics
- 📱 Mobile responsive design
- 🎯 Personalized learning paths

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Spring Boot 3.5.10 |
| **Database** | MySQL 8.0 |
| **ORM** | Hibernate JPA |
| **Java Version** | Java 21 |

## 🎨 Color Scheme

```
Primary Color:       #22c55e (Green) - Buttons, highlights, stats
Dark Background:     #0f172a (Navy) - Main background
Card Background:     #1e293b (Slate) - Content sections
Border Color:        #334155 (Light slate) - Dividers
Text Primary:        #f8fafc (Off-white) - Headings
Text Secondary:      #cbd5e1 (Light gray) - Body text
Text Muted:          #94a3b8 (Medium gray) - Breadcrumbs
```

## 🚀 Getting Started

### **Access the Application**
```
URL: http://localhost:8082
```

### **Navigate to Learning**
1. Click "Learning" from home page
2. Select a programming language (C, Java, MySQL, C++)
3. Choose a topic from the list
4. Start learning with interactive content

### **Check Your Profile**
1. Click "Profile" link
2. View your learning statistics
3. Track your progress by difficulty
4. See your achievements and activity

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user/profile/{id}` | GET | Get user profile & stats |
| `/api/user/progress/{id}` | GET | Get learning progress |
| `/api/user/practice/{id}` | GET | Get practice history |

### **Sample Profile Response**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "problemsSolved": 45,
  "learningStreak": 12,
  "skillRating": 3.8,
  "learningCount": 8,
  "easyStats": { "completed": 5, "total": 10, "percentage": 50 },
  "mediumStats": { "completed": 2, "total": 10, "percentage": 20 },
  "hardStats": { "completed": 1, "total": 10, "percentage": 10 },
  "createdAt": "2026-01-24T08:00:00Z"
}
```

## 📁 Content File Structure

```
/static/content/
├── c/
│   ├── 01-introduction.html
│   ├── 02-structure.html
│   ├── 03-datatypes.html
│   ├── 04-operators.html
│   ├── 05-control-statements.html
│   └── 06-functions.html
├── java/
│   ├── 01-introduction.html
│   ├── 02-installation.html
│   ├── 03-syntax.html
│   └── 04-datatypes.html
└── mysql/
    ├── 01-introduction.html
    ├── 02-installation.html
    └── 03-basic-queries.html
```

## ✨ Each Content File Includes

- 📌 **Breadcrumb Navigation** - Easy path tracking
- 📊 **Progress Bar** - Visual progress indicator
- 💡 **Key Concepts** - Highlighted important points
- 💻 **Code Examples** - Syntax-highlighted examples
- 📝 **Explanations** - Clear descriptions
- 🎯 **Best Practices** - Professional tips
- ➡️ **Navigation Buttons** - Move between topics

## 🔧 Building the Project

### **Prerequisites**
- Java 21 JDK
- Maven 3.8+
- MySQL 8.0+
- Git

### **Build Command**
```bash
cd /workspaces/practice
./mvnw clean package -DskipTests
```

### **Run Application**
```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### **Access**
- Frontend: http://localhost:8082
- MySQL: localhost:3306

## 📈 Progress Tracking System

### **Difficulty Classification**
- **Easy** (40%): C introductions, basic concepts
- **Medium** (40%): Java, MySQL, core features  
- **Hard** (20%): Advanced topics, complex concepts

### **Automatic Calculation**
The system calculates:
```
completed_topics = COUNT(WHERE completed = true)
total_topics = COUNT(*)
percentage = (completed / total) * 100
```

## 🎯 Learning Pathways

### **Beginner Path**
1. **C Fundamentals** → Introduction → Data Types → Operators
2. **Java Basics** → Introduction → Syntax → Data Types
3. **Database Intro** → MySQL Introduction

### **Intermediate Path**
Continue with:
- Control Statements & Loops
- Functions & Arrays
- OOP Concepts
- SQL Queries

### **Advanced Path**
Progress to:
- Pointers & Memory Management
- Advanced OOP (Inheritance, Polymorphism)
- Database Optimization
- Multithreading

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
# Kill existing process
pkill -f "java -jar"

# Or use different port
java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=8083
```

### **Database Connection Error**
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;
```

### **Content Files Not Showing**
1. Check file exists: `/src/main/resources/static/content/`
2. Rebuild: `./mvnw clean package`
3. Clear browser cache
4. Restart application

## 🚀 Next Steps to Complete

### **Content Creation** (80% Complete)
- [ ] Create remaining C topics (7-12)
- [ ] Create remaining Java topics (5-19)
- [ ] Create C++ content (20 files)
- [ ] Add MySQL advanced topics

### **Features to Build** (0% Complete)
- [ ] Interactive code editor
- [ ] Automated problem judge
- [ ] Quiz/assessment system
- [ ] Achievement badges
- [ ] Leaderboard
- [ ] Discussion forum
- [ ] Code submission engine

### **Enhancements** (0% Complete)
- [ ] User authentication (JWT/OAuth)
- [ ] Social features (follow users, share progress)
- [ ] Certificates on completion
- [ ] Mobile app
- [ ] Real-time collaboration

## 📞 Support

For issues or questions:
1. Check existing content files for patterns
2. Review database schema in entities folder
3. Check API responses in `/api/user/profile/`
4. Review application logs: `tail -f app.log`

## 📄 License

This project is open source and available for educational purposes.

---

**Version:** 1.0  
**Last Updated:** January 24, 2026  
**Status:** Production Ready (Content Expansion in Progress)
