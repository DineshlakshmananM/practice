# TODO: Learning Page Update

## Objective:
Update the learning page to be dynamically connected to the content folder, show only folder names, display HTML file names without extension, and move logout to profile page.

## Requirements:
1. ✅ Remove logout button from learning page
2. ✅ Remove emoji icons - show only folder names
3. ✅ Dynamically scan content folder to auto-detect new folders
4. ✅ When clicking a language, show list of HTML files (names without ".html")
5. ✅ When clicking a topic, display actual HTML content in the iframe
6. ✅ Move logout to profile page (already exists in profile.html)

## Files Modified:
- [x] `src/main/resources/static/learning.html`
- [x] `src/main/resources/static/js/learning.js`
- [x] `src/main/resources/static/profile.html` (logout button already present)

## Progress:
- [x] Create TODO file (COMPLETED)
- [x] Modify learning.html (remove logout, add topics container, remove emojis from sidebar)
- [x] Modify learning.js (complete rewrite for dynamic functionality)
- [x] Modify profile.html (logout button already exists - NO CHANGES NEEDED)

## Implementation Notes:
- ✅ Used fetch to dynamically scan content folder structure
- ✅ Display folder names without any icons/emojis
- ✅ Show HTML file names without the ".html" extension
- ✅ Display actual HTML content in the iframe when a topic is selected
- ✅ Ensure logout functionality works from profile page
- ✅ Auto-detection: Add new folders to content/ and they automatically appear

