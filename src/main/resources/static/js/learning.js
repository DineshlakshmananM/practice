/**
 * Learning Page JavaScript
 * Handles topic navigation, progress tracking, and user authentication
 * Dynamically loads courses from manifest.json
 */

// ======================
// AUTH GUARD
// ======================
(function() {
    const user = localStorage.getItem("user");
    
    if (!user) {
        location.href = "login.html";
        return;
    }
    
    window.user = JSON.parse(user);
})();

// ======================
// DYNAMIC COURSE LOADING
// ======================
let courses = {};
let courseOrder = {};
let isLoading = false;

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupKeyboardNavigation();
});

async function initializePage() {
    // Set user info in topbar
    if (window.user && window.user.username) {
        document.getElementById("userInfo").innerText = "Welcome, " + window.user.username;
        const initial = window.user.username.charAt(0).toUpperCase();
        document.getElementById("avatarInitial").innerText = initial;
    }

    // Load courses dynamically from manifest
    await loadCoursesFromManifest();
    
    // Load saved progress
    loadProgress();
    
    // Update progress display
    updateProgressDisplay();
}

async function loadCoursesFromManifest() {
    try {
        const response = await fetch('content/manifest.json');
        const manifest = await response.json();
        
        // Build courses object from manifest
        courses = {};
        courseOrder = manifest.topicOrder || {};
        
        for (const [key, value] of Object.entries(manifest.courses)) {
            courses[key] = {
                name: value.name,
                path: key,
                description: value.description || '',
                icon: value.icon || '📚'
            };
        }
        
        // Update sidebar with dynamic buttons
        updateSidebarButtons();
        
        console.log('Courses loaded:', Object.keys(courses));
    } catch (error) {
        console.error('Error loading manifest:', error);
        // Fallback to default courses if manifest fails
        loadDefaultCourses();
    }
}

function loadDefaultCourses() {
    courses = {
        java: {
            name: "Java",
            path: "java",
            description: "Master Java programming from basics to advanced concepts",
            icon: "☕"
        },
        c: {
            name: "C",
            path: "c",
            description: "Learn the fundamentals of C programming language",
            icon: "⚡"
        },
        cpp: {
            name: "C++",
            path: "cpp",
            description: "Explore object-oriented programming with C++",
            icon: "🚀"
        },
        mysql: {
            name: "MySQL",
            path: "mysql",
            description: "Learn database management with MySQL",
            icon: "🗄️"
        }
    };
    
    // Default topic order
    courseOrder = {
        java: [
            "01-introduction.html", "02-installation.html", "03-syntax.html",
            "04-datatypes.html", "05-operators.html", "06-control-statements.html",
            "07-arrays.html", "08-strings.html", "09-oop-concepts.html",
            "10-inheritance.html", "11-polymorphism.html", "12-abstraction.html",
            "13-interfaces.html", "14-exception-handling.html", "15-collections.html",
            "16-stream-api.html", "17-file-handling.html", "18-multithreading.html",
            "19-advanced-java.html"
        ],
        c: [
            "01-introduction.html", "02-structure.html", "03-datatypes.html",
            "04-operators.html", "05-control-statements.html", "06-functions.html",
            "07-arrays.html", "08-pointers.html", "09-strings.html",
            "10-structures.html", "11-file-handling.html", "12-advanced-c.html"
        ],
        cpp: [
            "01-introduction.html", "02-syntax.html", "03-oop.html",
            "04-constructors.html", "05-inheritance.html", "06-polymorphism.html",
            "07-templates.html", "08-stl.html", "09-file-handling.html",
            "10-advanced-cpp.html"
        ],
        mysql: [
            "01-introduction.html", "02-installation.html", "03-database-basics.html",
            "04-tables.html", "05-crud.html", "06-constraints.html",
            "07-joins.html", "08-subqueries.html", "09-indexes.html",
            "10-views.html", "11-stored-procedures.html", "12-triggers.html",
            "13-advanced-sql.html"
        ]
    };
    
    updateSidebarButtons();
}

function updateSidebarButtons() {
    const sidebar = document.getElementById('sidebar');
    const languagesTitle = document.getElementById('languagesTitle');
    
    // Update title
    languagesTitle.innerText = 'Languages';
    
    // Remove existing language buttons (keep title, search, topics div, progress)
    const existingButtons = sidebar.querySelectorAll('.sidebar > button:not(.search-container):not(#topics)');
    existingButtons.forEach(btn => btn.remove());
    
    // Add buttons for each course in order
    for (const [key, course] of Object.entries(courses)) {
        const btn = document.createElement('button');
        btn.id = `btn-${key}`;
        btn.innerHTML = `${course.icon} ${course.name}`;
        btn.title = course.description || '';
        btn.onclick = () => loadTopics(key);
        sidebar.insertBefore(btn, document.getElementById('topics'));
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !document.getElementById('prevBtn').disabled) {
            navigateTopic(-1);
        } else if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
            navigateTopic(1);
        }
    });
}

// ======================
// PROGRESS TRACKING
// ======================
function getProgressKey() {
    return `learning_progress_${window.user.id}`;
}

function loadProgress() {
    const progressKey = getProgressKey();
    const saved = localStorage.getItem(progressKey);
    if (saved) {
        window.userProgress = JSON.parse(saved);
    } else {
        window.userProgress = {};
    }
}

function saveProgress() {
    localStorage.setItem(getProgressKey(), JSON.stringify(window.userProgress));
}

function markTopicCompleted(lang, topicFile) {
    const key = `${lang}_${topicFile}`;
    window.userProgress[key] = true;
    saveProgress();
    updateProgressDisplay();
}

function isTopicCompleted(lang, topicFile) {
    const key = `${lang}_${topicFile}`;
    return window.userProgress[key] === true;
}

function updateProgressDisplay() {
    if (!currentLanguage) {
        document.getElementById('progressText').textContent = 'Progress: 0%';
        document.getElementById('progressFill').style.width = '0%';
        return;
    }

    const langTopics = getTopicsForLanguage(currentLanguage);
    const completed = langTopics.filter(t => isTopicCompleted(currentLanguage, t)).length;
    const percentage = langTopics.length > 0 ? Math.round((completed / langTopics.length) * 100) : 0;

    document.getElementById('progressText').textContent = `Progress: ${percentage}% (${completed}/${langTopics.length})`;
    document.getElementById('progressFill').style.width = `${percentage}%`;
}

function getTotalCompleted() {
    let total = 0;
    for (const lang in courses) {
        const langTopics = getTopicsForLanguage(lang);
        total += langTopics.filter(t => isTopicCompleted(lang, t)).length;
    }
    return total;
}

// ======================
// GET TOPICS FOR LANGUAGE
// ======================
function getTopicsForLanguage(lang) {
    // First check if we have ordered topics in manifest
    if (courseOrder[lang]) {
        return courseOrder[lang];
    }
    
    // Fallback: try to get from folder using dynamic discovery
    return [];
}

// ======================
// LOAD TOPICS
// ======================
async function loadTopics(lang) {
    if (isLoading) return;
    isLoading = true;
    
    console.log("Loading topics for:", lang);
    
    // Update active language button
    document.querySelectorAll('.sidebar > button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    currentLanguage = lang;
    currentTopicIndex = 0;

    const topicsDiv = document.getElementById("topics");
    
    if (!topicsDiv) {
        console.error("Topics div not found!");
        isLoading = false;
        return;
    }
    
    // Get topics for this language
    const topics = getTopicsForLanguage(lang);
    
    // If no topics in manifest, try to discover them dynamically
    if (topics.length === 0) {
        await discoverTopicsDynamically(lang);
    }
    
    // Rebuild topics display
    topicsDiv.innerHTML = `<h3>${courses[lang].name} Topics</h3>`;
    
    const currentTopics = getTopicsForLanguage(lang);
    
    currentTopics.forEach((file, index) => {
        const btn = document.createElement("button");
        const topicName = file.replace(".html", "").replace(/-/g, " ");
        btn.innerText = topicName;
        btn.dataset.file = file;
        btn.dataset.index = index;
        
        // Mark as completed if user has viewed it
        if (isTopicCompleted(lang, file)) {
            btn.classList.add('completed');
        }
        
        btn.onclick = () => loadContent(lang, file, index);
        topicsDiv.appendChild(btn);
    });

    // Update breadcrumb
    updateBreadcrumb(lang, null);
    
    // Update progress display
    updateProgressDisplay();
    
    console.log("Total topics added:", currentTopics.length);
    
    // Auto-load first topic
    if (currentTopics.length > 0) {
        loadContent(lang, currentTopics[0], 0);
    }
    
    isLoading = false;
}

async function discoverTopicsDynamically(lang) {
    try {
        // Fetch the directory listing by trying to get all HTML files
        // Since we can't list directories directly, we check what's available
        const response = await fetch(`content/${lang}/`);
        const html = await response.text();
        
        // Parse HTML to find links to HTML files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href$=".html"]');
        
        const topics = [];
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html')) {
                topics.push(href);
            }
        });
        
        // Sort topics numerically by their prefix
        topics.sort((a, b) => {
            const numA = parseInt(a.split('-')[0]) || 0;
            const numB = parseInt(b.split('-')[0]) || 0;
            return numA - numB;
        });
        
        if (topics.length > 0) {
            courseOrder[lang] = topics;
            console.log(`Discovered ${topics.length} topics for ${lang}`);
        }
    } catch (error) {
        console.error('Error discovering topics:', error);
    }
}

// ======================
// FILTER TOPICS
// ======================
function filterTopics(searchTerm) {
    if (!currentLanguage) return;
    
    const buttons = document.querySelectorAll('#topics button');
    const term = searchTerm.toLowerCase();
    
    buttons.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        btn.style.display = text.includes(term) ? '' : 'none';
    });
}

// ======================
// LOAD CONTENT
// ======================
function loadContent(lang, file, index) {
    console.log("Loading content:", lang, file);
    
    currentTopicIndex = index || 0;
    
    // Mark topic as completed
    markTopicCompleted(lang, file);
    
    // Update active topic button
    document.querySelectorAll('#topics button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.file === file) {
            btn.classList.add('active');
        }
    });
    
    // Load content in iframe
    document.getElementById("contentFrame").src = `content/${lang}/${file}`;
    
    // Update breadcrumb
    updateBreadcrumb(lang, file);
    
    // Update navigation
    updateNavigation(lang, index);
}

function updateBreadcrumb(lang, file) {
    const breadcrumb = document.getElementById('breadcrumb');
    
    if (file) {
        const topicName = file.replace(".html", "").replace(/-/g, " ");
        breadcrumb.innerHTML = `
            <a href="#" onclick="loadTopics('${lang}'); return false;">${courses[lang].name}</a>
            <span>></span>
            <span>${topicName}</span>
        `;
    } else {
        breadcrumb.innerHTML = `<span>Select a language to begin</span>`;
    }
}

function updateNavigation(lang, index) {
    const langData = courses[lang];
    const topics = getTopicsForLanguage(lang);
    const totalTopics = topics.length;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const counter = document.getElementById('topicCounter');
    
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= totalTopics - 1;
    
    counter.textContent = `Topic ${index + 1} of ${totalTopics}`;
}

// ======================
// NAVIGATION
// ======================
function navigateTopic(direction) {
    if (!currentLanguage) return;
    
    const topics = getTopicsForLanguage(currentLanguage);
    const newIndex = currentTopicIndex + direction;
    
    if (newIndex >= 0 && newIndex < topics.length) {
        const newFile = topics[newIndex];
        loadContent(currentLanguage, newFile, newIndex);
        
        // Scroll topic button into view
        const topicBtn = document.querySelector(`#topics button[data-index="${newIndex}"]`);
        if (topicBtn) {
            topicBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// ======================
// LOGOUT
// ======================
function logout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// ======================
// HELPER: ADD NEW COURSE
// ======================
/**
 * To add a new course (e.g., Python):
 * 
 * 1. Create a new folder: src/main/resources/static/content/python/
 * 2. Add HTML topic files with numeric prefixes: 01-introduction.html, 02-setup.html, etc.
 * 3. Update manifest.json to add the course:
 * 
 *    "courses": {
 *      "python": {
 *        "name": "Python",
 *        "description": "Learn Python programming",
 *        "icon": "🐍"
 *      }
 *    },
 *    "topicOrder": {
 *      "python": [
 *        "01-introduction.html",
 *        "02-setup.html",
 *        ...
 *      ]
 *    }
 * 
 * The course will automatically appear in the sidebar!
 */

