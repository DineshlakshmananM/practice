# TODO: Language Dropdown in Sidebar

## Objective:
Update learning page to show topics as dropdown in left sidebar instead of center. Move navigation controls to bottom of page.

## Changes Required:

### 1. `src/main/resources/static/learning.html`
- [x] Add expandable dropdown sections in sidebar for topics
- [x] Remove topics grid container from center
- [x] Move nav controls (prev/next) to bottom of page
- [x] Update CSS for sidebar dropdown styling

### 2. `src/main/resources/static/js/learning.js`
- [x] Update language click handler to expand topics in sidebar
- [x] Add accordion/expandable functionality for dropdowns
- [x] Remove topics grid display from center area
- [x] Update navigation controls positioning logic

## Implementation Steps:
1. [x] Modify learning.html - add sidebar dropdown styling
2. [x] Move nav controls to bottom
3. [x] Modify learning.js - update topic display logic
4. [ ] Test the implementation

## Visual Flow After Changes:
- **Sidebar**: Language list with expand/collapse arrows → Click language → Shows topics as dropdown → Click topic → Loads content
- **Center**: Shows iframe content directly
- **Bottom**: Navigation controls (prev/next) at bottom of page

## Changes Made:
1. **Sidebar Dropdown**: Languages now have expand arrows (▶) that when clicked, show topics below them in a dropdown style
2. **Topics in Sidebar**: Topics appear nested under each language in the sidebar
3. **Bottom Navigation**: Previous/Next buttons moved to bottom of page
4. **Cleaner Center Area**: Only iframe content is shown in center
5. **Animation**: Smooth slide-down animation for dropdown expansion

