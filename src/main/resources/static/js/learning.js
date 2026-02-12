/**
 * Learning Page JavaScript
 * Dynamically loads courses from content folder structure
 * Shows folder names with expandable dropdown for topics
 * Displays HTML file names without extension
 * Renders actual HTML content when topic is selected
 */

// ======================
// AUTH GUARD
// ======================
(function () {
    const user = localStorage.getItem("user");
    if (!user) {
        location.href = "login.html";
        return;
    }
    window.user = JSON.parse(user);
})();

// ======================
// GLOBAL STATE
// ======================
let availableFolders = [];
let availableTopics = {};
let currentLanguage = null;
let currentTopicIndex = 0;
let expandedLanguage = null; // Track which language dropdown is expanded
window.userProgress = {};

// ======================
// INITIALIZATION
// ======================
document.addEventListener("DOMContentLoaded", async () => {
    await initializePage();
    setupKeyboardNavigation();
});

async function initializePage() {
    // Set user info in topbar
    if (window.user) {
        const userName = window.user.fullName || window.user.username || "User";
        document.getElementById("userName").textContent = userName;
        document.getElementById("userAvatar").textContent = userName.charAt(0).toUpperCase();

        // Show admin link if user is admin
        if (window.user.role === "ADMIN") {
            const adminLink = document.createElement("a");
            adminLink.href = "admin.html";
            adminLink.className = "nav-link";
            adminLink.innerText = "Admin";
            document.querySelector(".topbar-nav")?.appendChild(adminLink);
        }
    }

    // Load available folders from content directory
    await loadAvailableFolders();
    
    // Load progress from localStorage
    loadProgress();
    
    // Check if language is specified in URL
    const lang = new URLSearchParams(location.search).get("lang");
    if (lang && availableFolders.includes(lang)) {
        expandLanguage(lang);
        loadTopicContent(lang, (await getTopicsForLanguage(lang))[0], 0);
    }
}

// ======================
// FOLDER DETECTION
// ======================
async function loadAvailableFolders() {
    try {
        // Fetch the manifest.json to get folder structure
        const res = await fetch("content/manifest.json");
        const manifest = await res.json();
        
        // Extract folder names from courses object
        availableFolders = Object.keys(manifest.courses);
        
        // Store topic order from manifest
        if (manifest.topicOrder) {
            availableTopics = manifest.topicOrder;
        } else {
            // If no topicOrder in manifest, we'll scan folders directly
            await scanFoldersForTopics();
        }
        
        // Update sidebar with folder names and dropdowns
        updateSidebar();
    } catch (error) {
        console.error("Error loading manifest:", error);
        // Fallback: try to scan folders directly
        await scanFoldersForTopics();
        updateSidebar();
    }
}

async function scanFoldersForTopics() {
    // If manifest fails, we'll try to discover folders by attempting to fetch content
    const potentialFolders = ['java', 'python', 'c', 'cpp', 'html', 'css', 'javascript', 'mysql'];
    availableFolders = [];
    availableTopics = {};
    
    for (const folder of potentialFolders) {
        try {
            const res = await fetch(`content/${folder}/01-introduction.html`);
            if (res.ok) {
                availableFolders.push(folder);
                // Try to get list of files by checking if folder has content
                availableTopics[folder] = await scanFolderTopics(folder);
            }
        } catch {
            // Folder doesn't exist or is not accessible
        }
    }
}

async function scanFolderTopics(folder) {
    // We can't directly list files, so we'll use known topic patterns
    // This is a fallback - ideally manifest.json should be used
    const topics = [];
    let i = 1;
    while (true) {
        try {
            const topicNum = String(i).padStart(2, '0');
            const res = await fetch(`content/${folder}/${topicNum}-introduction.html`);
            if (!res.ok) break;
            
            // Get the title from the HTML content
            const text = await res.text();
            const titleMatch = text.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                             text.match(/<title[^>]*>([^<]+)<\/title>/i);
            
            if (titleMatch) {
                topics.push(`${topicNum}-introduction.html`);
            } else {
                topics.push(`${topicNum}-topic.html`);
            }
            i++;
        } catch {
            break;
        }
    }
    
    return topics.length > 0 ? topics : [];
}

// ======================
// SIDEBAR WITH DROPDOWNS
// ======================
async function updateSidebar() {
    const container = document.getElementById("sidebarContent");
    if (!container) return;

    container.innerHTML = "";
    
    if (availableFolders.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); padding: 20px;">No content folders found</div>';
        return;
    }

    // Sort folders alphabetically
    availableFolders.sort();

    for (const folder of availableFolders) {
        // Get topics for this language
        const topics = await getTopicsForLanguage(folder);
        
        // Create language button container
        const langContainer = document.createElement("div");
        
        // Language button
        const langBtn = document.createElement("button");
        langBtn.className = "lang-btn";
        langBtn.dataset.lang = folder;
        langBtn.innerHTML = `
            ${formatFolderName(folder)}
            <span class="expand-arrow">▶</span>
        `;
        langBtn.onclick = () => toggleLanguageDropdown(folder);
        
        // Topics dropdown container
        const dropdown = document.createElement("div");
        dropdown.className = "topics-dropdown";
        dropdown.id = `dropdown-${folder}`;
        
        // Add topic buttons
        if (topics.length > 0) {
            topics.forEach((topicFile, index) => {
                const topicBtn = document.createElement("button");
                topicBtn.className = "topic-btn";
                topicBtn.textContent = formatTopicName(topicFile);
                topicBtn.dataset.file = topicFile;
                topicBtn.dataset.lang = folder;
                topicBtn.dataset.index = index;
                
                // Check if completed
                if (isTopicCompleted(folder, topicFile)) {
                    topicBtn.classList.add("completed");
                }
                
                topicBtn.onclick = () => loadTopicContent(folder, topicFile, index);
                dropdown.appendChild(topicBtn);
            });
        } else {
            dropdown.innerHTML = '<div style="color: var(--text-muted); padding: 10px; font-size: 12px;">No topics found</div>';
        }
        
        langContainer.appendChild(langBtn);
        langContainer.appendChild(dropdown);
        container.appendChild(langContainer);
    }
}

function toggleLanguageDropdown(lang) {
    const dropdown = document.getElementById(`dropdown-${lang}`);
    const langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    
    if (!dropdown || !langBtn) return;
    
    // Toggle the dropdown
    if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        langBtn.classList.remove("expanded");
    } else {
        // Close any other expanded dropdown
        document.querySelectorAll(".topics-dropdown.show").forEach(d => d.classList.remove("show"));
        document.querySelectorAll(".lang-btn.expanded").forEach(b => b.classList.remove("expanded"));
        
        dropdown.classList.add("show");
        langBtn.classList.add("expanded");
        expandedLanguage = lang;
    }
}

function expandLanguage(lang) {
    const dropdown = document.getElementById(`dropdown-${lang}`);
    const langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    
    if (dropdown && langBtn) {
        dropdown.classList.add("show");
        langBtn.classList.add("expanded");
        expandedLanguage = lang;
    }
}

function formatFolderName(folder) {
    // Convert folder name to readable format
    // e.g., "javascript" -> "JavaScript", "cpp" -> "C++"
    const nameMap = {
        'cpp': 'C++',
        'javascript': 'JavaScript',
        'mysql': 'MySQL'
    };
    
    if (nameMap[folder]) {
        return nameMap[folder];
    }
    
    // Capitalize first letter
    return folder.charAt(0).toUpperCase() + folder.slice(1);
}

function formatTopicName(topicFile) {
    // Remove ".html" extension
    let name = topicFile.replace(".html", "");
    
    // Remove leading numbers and dashes (e.g., "01-introduction" -> "introduction")
    name = name.replace(/^\d+-/, "");
    
    // Replace hyphens with spaces
    name = name.replace(/-/g, " ");
    
    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    return name;
}

// ======================
// CONTENT LOADING
// ======================
async function loadTopicContent(lang, topicFile, index) {
    currentLanguage = lang;
    currentTopicIndex = index;
    markTopicCompleted(lang, topicFile);

    // Update iframe source to load the actual HTML content
    const contentFrame = document.getElementById("contentFrame");
    contentFrame.src = `content/${lang}/${topicFile}`;
    contentFrame.style.display = "block";
    
    // Update navigation
    updateNavigation(lang, index);
    
    // Update topic buttons active state
    updateTopicButtonsActiveState(lang, topicFile);
    
    // Update header
    document.getElementById("langTitle").textContent = formatFolderName(lang);
    
    // Update breadcrumb
    const topicName = formatTopicName(topicFile);
    document.getElementById("breadcrumb").innerHTML = 
        `${formatFolderName(lang)} / ${topicName}`;
}

function updateTopicButtonsActiveState(lang, topicFile) {
    // Deactivate all topic buttons
    document.querySelectorAll(".topic-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Activate current topic button
    const activeBtn = document.querySelector(`.topic-btn[data-file="${topicFile}"][data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
    
    // Update language button active state
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    const langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (langBtn) {
        langBtn.classList.add("active");
    }
}

async function updateNavigation(lang, index) {
    const topics = await getTopicsForLanguage(lang);
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const counter = document.getElementById("topicCounter");
    
    if (topics.length === 0) {
        counter.textContent = "No topics available";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }
    
    counter.textContent = `Topic ${index + 1} of ${topics.length}`;
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= topics.length - 1;
}

function navigateTopic(dir) {
    if (!currentLanguage) return;
    
    const dropdown = document.getElementById(`dropdown-${currentLanguage}`);
    if (!dropdown) return;
    
    const buttons = dropdown.querySelectorAll(".topic-btn");
    const next = currentTopicIndex + dir;
    
    if (next >= 0 && next < buttons.length) {
        const btn = buttons[next];
        loadTopicContent(currentLanguage, btn.dataset.file, next);
    }
}

// ======================
// KEYBOARD NAVIGATION
// ======================
function setupKeyboardNavigation() {
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") navigateTopic(-1);
        if (e.key === "ArrowRight") navigateTopic(1);
    });
}

// ======================
// PROGRESS TRACKING
// ======================
function getProgressKey() {
    return `learning_progress_${window.user.id}`;
}

function loadProgress() {
    const saved = localStorage.getItem(getProgressKey());
    window.userProgress = saved ? JSON.parse(saved) : {};
}

function saveProgress() {
    localStorage.setItem(getProgressKey(), JSON.stringify(window.userProgress));
}

function markTopicCompleted(lang, file) {
    window.userProgress[`${lang}_${file}`] = true;
    saveProgress();
    updateProgressDisplay();
    
    // Update topic button to show completed
    const btn = document.querySelector(`.topic-btn[data-file="${file}"][data-lang="${lang}"]`);
    if (btn) {
        btn.classList.add("completed");
    }
}

function isTopicCompleted(lang, file) {
    return window.userProgress[`${lang}_${file}`] === true;
}

function updateProgressDisplay() {
    // Calculate overall progress
    let totalTopics = 0;
    let completedTopics = 0;
    
    availableFolders.forEach(lang => {
        const topics = availableTopics[lang] || [];
        totalTopics += topics.length;
        topics.forEach(topic => {
            if (isTopicCompleted(lang, topic)) {
                completedTopics++;
            }
        });
    });
    
    const percent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
    document.getElementById("progressText").textContent = `${percent}% Complete`;
    document.getElementById("overallProgress").style.width = `${percent}%`;
}

// ======================
// UTILITY FUNCTIONS
// ======================
async function getTopicsForLanguage(lang) {
    // First try to get from manifest/topicOrder
    if (availableTopics[lang] && availableTopics[lang].length > 0) {
        return availableTopics[lang];
    }
    
    // Fallback: try to get from manifest
    try {
        const res = await fetch("content/manifest.json");
        const manifest = await res.json();
        
        if (manifest.topicOrder && manifest.topicOrder[lang]) {
            return manifest.topicOrder[lang];
        }
    } catch {
        // Continue to fallback
    }
    
    // Last fallback: return empty array
    return [];
}

// Make functions globally available
window.expandLanguage = expandLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.navigateTopic = navigateTopic;

