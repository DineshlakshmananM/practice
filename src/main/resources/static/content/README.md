# Content Management Guide

This directory contains all learning content for the TechySpine platform. The system now uses a **manifest-based approach** to dynamically load courses.

## Structure

```
content/
├── manifest.json          # Course configuration (REQUIRED)
├── java/                  # Java course
│   ├── 01-introduction.html
│   ├── 02-installation.html
│   └── ...
├── c/                     # C course
│   ├── 01-introduction.html
│   └── ...
├── cpp/                   # C++ course
│   └── ...
├── mysql/                 # MySQL course
│   └── ...
└── python/                # Python course (example)
    ├── 01-introduction.html
    ├── 02-setup.html
    └── ...
```

## How to Add a New Course

### Step 1: Create Course Folder

Create a new folder in `src/main/resources/static/content/` with your course name (lowercase, no spaces):

```bash
# Example: Adding a JavaScript course
mkdir javascript
```

### Step 2: Add HTML Topic Files

Create HTML files with **numeric prefixes** in the folder:

```
content/javascript/
├── 01-introduction.html
├── 02-basics.html
├── 03-variables.html
└── ...
```

**Important:**
- Use 2-digit numeric prefixes: `01-`, `02-`, `03-`, etc.
- Files must end with `.html`
- Use hyphens in filenames (e.g., `01-introduction-to-js.html`)

### Step 3: Update manifest.json

Add your course to the `manifest.json` file:

```json
{
  "courses": {
    "javascript": {
      "name": "JavaScript",
      "description": "Learn JavaScript from basics to advanced",
      "icon": "🟨"
    }
  },
  "topicOrder": {
    "javascript": [
      "01-introduction.html",
      "02-basics.html",
      "03-variables.html",
      "04-functions.html",
      ...
    ]
  }
}
```

## HTML Content File Format

Each topic HTML file should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Topic Title</title>
    <style>
        /* Optional: Use theme CSS variables */
        :root {
            --primary: #38bdf8;
            --bg-main: #020617;
            --text-main: #e5e7eb;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1000px;
            margin: 0;
            padding: 20px;
            background: #0f172a;
            color: #e2e8f0;
        }
        h1 { color: var(--primary); }
        pre {
            background: #1e293b;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Topic Title</h1>
    
    <h2>Section 1</h2>
    <p>Your content here...</p>
    
    <h2>Section 2</h2>
    <pre><code>// Code example
console.log("Hello");</code></pre>
    
    <!-- Navigation Buttons -->
    <div class="nav-buttons">
        <button class="btn btn-secondary" onclick="location.href='01-previous.html'">← Previous</button>
        <button class="btn btn-primary" onclick="location.href='03-next.html'">Next →</button>
    </div>
</body>
</html>
```

## Theme CSS Variables Available

You can use these CSS variables in your content:

```css
:root {
    --bg-main: #020617;       /* Main background */
    --bg-dark: #0f172a;       /* Dark background */
    --border-color: #1e293b;  /* Border color */
    --text-main: #e5e7eb;     /* Main text */
    --text-muted: #94a3b8;    /* Muted text */
    --primary: #38bdf8;       /* Primary color (blue) */
    --primary-hover: #0ea5e9; /* Primary hover */
}
```

## Quick Reference

| Item | Format | Example |
|------|--------|---------|
| Course folder | lowercase, no spaces | `python`, `machine-learning` |
| Topic files | `NN-name.html` | `01-introduction.html` |
| Manifest course key | lowercase, no spaces | `python`, `machine_learning` |
| Topic order in manifest | Array of filenames | `["01-intro.html", "02-setup.html"]` |

## Testing Your Changes

1. Run the Spring Boot application
2. Navigate to the learning page
3. Your new course should appear in the sidebar
4. Click the course to see all topics
5. Verify navigation between topics works

## Troubleshooting

### Course not appearing?
- Check `manifest.json` is valid JSON (use a JSON validator)
- Ensure the course key matches exactly (lowercase)
- Verify topic files exist in the folder

### Topics in wrong order?
- Make sure numeric prefixes are 2 digits (01, 02, ..., 10, 11)
- Check the `topicOrder` array in manifest.json

### Navigation not working?
- Verify `onclick` links match exact filenames
- Ensure previous/next files exist

