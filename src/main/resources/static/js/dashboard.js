// ===== AUTH GUARD =====
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.username) {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// ===== USER INFO =====
document.getElementById("username").innerText =
    "Welcome, " + user.username;

// ===== STATIC LEARNING DATA (BACKEND-READY) =====
const data = {
    java: {
        name: "Java",
        topics: {
            "Introduction": "Java is a high-level, class-based, object-oriented programming language.",
            "Installation": "Learn how to install Java and set up your development environment.",
            "Syntax": "Understand Java syntax, structure, and basic rules.",
            "OOP Concepts": "Learn classes, objects, inheritance, polymorphism, and encapsulation.",
            "Collections": "Work with List, Set, Map, and Java Collection Framework.",
            "Multithreading": "Understand threads, concurrency, and parallel execution."
        }
    },
    mysql: {
        name: "MySQL",
        topics: {
            "Introduction": "MySQL is an open-source relational database management system.",
            "SELECT": "Learn how to retrieve data from tables.",
            "WHERE": "Filter records using conditions.",
            "JOIN": "Combine rows from multiple tables.",
            "Indexes": "Improve database performance using indexes."
        }
    },
    c: {
        name: "C",
        topics: {
            "Introduction": "C is a powerful general-purpose programming language.",
            "Variables": "Learn variables and data types in C.",
            "Loops": "Understand for, while, and do-while loops.",
            "Pointers": "Master pointers and memory management."
        }
    },
    cpp: {
        name: "C++",
        topics: {
            "Introduction": "C++ is an extension of C with object-oriented features.",
            "OOP": "Classes, objects, inheritance, and polymorphism.",
            "STL": "Standard Template Library overview.",
            "Memory Management": "Understand stack, heap, and smart pointers."
        }
    }
};

// ===== DOM REFERENCES =====
const sidebar = document.getElementById("sidebar");
const sidebarTitle = document.getElementById("sidebar-title");
const content = document.getElementById("content");

// ===== LOAD LANGUAGES =====
function loadLanguages() {
    sidebarTitle.innerText = "Languages";
    sidebar.innerHTML = "";

    Object.keys(data).forEach(key => {
        const btn = document.createElement("button");
        btn.innerText = data[key].name;
        btn.onclick = () => loadTopics(key);
        sidebar.appendChild(btn);
    });
}

// ===== LOAD TOPICS =====
function loadTopics(langKey) {
    sidebarTitle.innerText = data[langKey].name + " Topics";
    sidebar.innerHTML = "";

    Object.keys(data[langKey].topics).forEach(topic => {
        const btn = document.createElement("button");
        btn.innerText = topic;
        btn.onclick = () => loadContent(langKey, topic);
        sidebar.appendChild(btn);
    });

    // Auto-load first topic
    const firstTopic = Object.keys(data[langKey].topics)[0];
    loadContent(langKey, firstTopic);
}

// ===== LOAD CONTENT =====
function loadContent(langKey, topic) {
    content.innerHTML = `
        <h1>${data[langKey].name} - ${topic}</h1>
        <p>${data[langKey].topics[topic]}</p>
    `;
}

// ===== INIT =====
loadLanguages();
