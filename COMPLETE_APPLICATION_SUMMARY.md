# TechySpine - Complete Learning Application

## Project Overview
**TechySpine** is a unified learning platform that merges the capabilities of **W3Schools** (learning/tutorial platform) and **LeetCode** (practice/assessment platform).

## Architecture

### 1. **Learning Module (W3Schools-Style)**
- **Structured Content:** Organized tutorials for programming languages
- **Progressive Learning:** Topics arranged from basics to advanced
- **Real Code Examples:** Hands-on examples in every lesson
- **Visual Content:** HTML5 formatted learning pages

### 2. **Practice Module (LeetCode-Style)**
- **Skill Assessment:** Track learning progress by difficulty
- **Performance Metrics:** Easy/Medium/Hard difficulty tracking
- **User Stats:** Problems solved, streaks, skill ratings
- **Dynamic Progress:** Real-time updates as users learn

## Current Content

### **C Programming** ✅
1. 01-Introduction.html - What is C, Key Features
2. 02-Structure.html - Program Structure, Components
3. 03-Datatypes.html - Primitive Types, Type Modifiers
4. 04-Operators.html - Arithmetic, Relational, Logical Operators
5. 05-Control-Statements.html - If/Else, Switch, Loops

### **Java Programming** ✅
1. 01-Introduction.html - Java Basics, Key Features
2. 02-Installation.html - JDK Installation, Environment Setup
3. 03-Syntax.html - Syntax Rules, Naming Conventions
4. More topics in progress...

### **MySQL Database** ✅
1. 01-Introduction.html - What is MySQL, RDBMS Concepts
2. 02-Installation.html - Installation on all platforms
3. More topics in progress...

## Technology Stack

### **Backend**
- **Framework:** Spring Boot 3.5.10
- **Language:** Java 21
- **Database:** MySQL
- **ORM:** Hibernate JPA

### **Frontend**
- **HTML5/CSS3/JavaScript**
- **Responsive Design:** Mobile-first approach
- **Color Scheme:** Dark theme (professional, easy on eyes)
  - Primary: `#22c55e` (Green accent)
  - Background: `#0f172a` (Dark blue-black)
  - Cards: `#1e293b` (Slightly lighter)

### **API Architecture**
- RESTful endpoints
- JSON responses
- Cross-origin enabled (CORS)

## Database Schema

### **User Entity**
```
- id (Long)
- username (String, unique)
- email (String, unique)
- password (String, nullable for Google OAuth)
- provider (LOCAL/GOOGLE)
- problemsSolved (int)
- learningStreak (int)
- skillRating (double)
- skills (String, comma-separated)
- createdAt (LocalDateTime)
- lastLogin (LocalDateTime)
```

### **LearningProgress Entity**
```
- id (Long)
- userId (Long, FK)
- language (String: JAVA, C, CPP, MYSQL)
- topic (String)
- progress (int: 0-100)
- completed (boolean)
- lastAccessed (LocalDateTime)
```

### **PracticeHistory Entity**
```
- id (Long)
- userId (Long, FK)
- problemId (Long)
- solved (boolean)
- timeSpent (int)
- timestamp (LocalDateTime)
```

## Key Features Implemented

### **1. User Profile Dashboard (LeetCode-Style)**
✅ Left Sidebar:
- Profile avatar with initials
- Username and user badge
- Meta information (location, college, email, join date)
- Community stats (views, solutions, discussions, reputation)

✅ Main Content Area:
- 4-column stats grid (topics, problems, streak, skill rating)
- Difficulty-based progress bars (Easy/Medium/Hard)
- Activity calendar (365-day grid)
- Tabbed section (Recent Activity, Top Problems, Badges)

### **2. Learning Content Structure**
✅ Features:
- Breadcrumb navigation
- Progress indicators
- Code blocks with syntax highlighting
- Key points/important notes sections
- Navigation buttons between topics
- Responsive design for all devices

### **3. API Endpoints**
```
GET  /api/user/profile/{userId}      - Get user profile with stats
GET  /api/user/progress/{userId}     - Get learning progress
GET  /api/user/practice/{userId}     - Get practice history
```

### **4. Real-Time Data Calculation**
✅ Difficulty Progress:
- **Easy:** C introductions, basic topics
- **Medium:** Java, C++, MySQL
- **Hard:** Advanced topics, pointers, inheritance

✅ Auto-Updates:
- Progress bars based on completion percentage
- Completion counters (X/Y format)
- Automatic calculation from database

## File Structure

```
/src/main/java/com/example/demo/
├── entity/
│   ├── User.java
│   ├── LearningProgress.java
│   └── PracticeHistory.java
├── dto/
│   ├── ProfileResponse.java
│   └── Other DTOs
├── controller/
│   ├── UserProfileController.java
│   └── Other Controllers
├── repository/
│   ├── UserRepository.java
│   ├── LearningProgressRepository.java
│   └── PracticeHistoryRepository.java
└── service/
    └── Service classes

/src/main/resources/static/
├── css/
│   ├── theme.css (Color variables)
│   ├── dashboard.css
│   └── profile.css
├── js/
│   ├── auth.js
│   ├── api.js
│   ├── profile.js
│   └── Other JS files
├── content/
│   ├── c/
│   │   ├── 01-introduction.html
│   │   ├── 02-structure.html
│   │   ├── 03-datatypes.html
│   │   ├── 04-operators.html
│   │   └── 05-control-statements.html
│   ├── java/
│   │   ├── 01-introduction.html
│   │   ├── 02-installation.html
│   │   └── 03-syntax.html
│   └── mysql/
│       ├── 01-introduction.html
│       └── 02-installation.html
└── *.html (Home, Dashboard, Profile, etc.)
```

## Color Scheme
```
Primary Color:       #22c55e (Green)
Dark Background:     #0f172a (Navy)
Card Background:     #1e293b (Slate)
Border Color:        #334155 (Light Slate)
Text Primary:        #f8fafc (Off-white)
Text Secondary:      #cbd5e1 (Light gray)
Text Muted:          #94a3b8 (Medium gray)
```

## How Content is Displayed

### **Learning Page** (`learning.html`)
1. User selects a language (C, Java, C++, MySQL)
2. Topics are displayed in a sidebar
3. Content is loaded based on selection
4. Progress is tracked in database
5. Profile shows completed topics

### **Profile Page** (`profile.html`)
1. Fetches user data from `/api/user/profile/{userId}`
2. Calculates difficulty stats from learning progress
3. Displays real-time progress bars
4. Shows activity calendar
5. Tabs for different information sections

## Next Steps for Completion

### **Content Files to Create:**
- [ ] C: 06-Functions.html, 07-Arrays.html, 08-Pointers.html, ... 12-Advanced-C.html
- [ ] Java: 04-Datatypes, 05-Operators, 06-Control, 07-Arrays, ... 19-Advanced
- [ ] C++: All topics (01-20)
- [ ] MySQL: 03-Basic-Queries.html, 04-Advanced, etc.

### **Features to Add:**
- [ ] Interactive code editor for practice problems
- [ ] Automated quiz system
- [ ] Code submission and testing
- [ ] Achievement badges
- [ ] Leaderboard system
- [ ] Real-time notifications
- [ ] Discussion forum

### **Backend Enhancements:**
- [ ] Problem/Quiz entity and endpoints
- [ ] Test case execution engine
- [ ] Code validation and scoring
- [ ] Email notifications
- [ ] OAuth integration (Google, GitHub)

## Running the Application

### **Build:**
```bash
cd /workspaces/practice
./mvnw clean package -DskipTests
```

### **Run:**
```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### **Access:**
```
Frontend:  http://localhost:8082
Database:  MySQL (default port 3306)
```

## Color Scheme Usage Guide

- **Primary Color (#22c55e):** Buttons, active states, highlights, stats numbers
- **Dark Background (#0f172a):** Main page background
- **Card Background (#1e293b):** Cards, panels, sections
- **Border Color (#334155):** Dividers, borders
- **Text Primary (#f8fafc):** Headings, main text
- **Text Secondary (#cbd5e1):** Paragraph text, descriptions
- **Text Muted (#94a3b8):** Breadcrumbs, metadata, timestamps

## Deployment Ready
✅ Responsive design (mobile, tablet, desktop)
✅ Database integrated
✅ API endpoints working
✅ Real-time data updates
✅ Professional UI/UX
✅ Color scheme consistent throughout
✅ Content formatted and styled

---

**Created:** January 24, 2026
**Version:** 1.0
**Status:** Production Ready (Content Expansion in Progress)
