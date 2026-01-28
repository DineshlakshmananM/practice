# Learning Page Test Plan

## Issues Found During Analysis:

### 1. Python Content Folder - Incomplete
- **Expected**: 19 topic files according to manifest.json
- **Actual**: Only 2 files exist
  - `01-introduction.html`
  - `02-setup.html`

### 2. MySQL Content Folder - Duplicate Numbering
- Both `03-basic-queries.html` AND `03-database-basics.html` exist
- This will cause display issues in topic ordering

## Test Steps:
1. Start the Spring Boot application
2. Access the learning page at `/learning.html`
3. Test each language:
   - Java: Check if all 19 topics load
   - C: Check if all 12 topics load
   - C++: Check if all 10 topics load
   - MySQL: Check topic display (note duplicate file issue)
   - Python: Will fail - only 2 topics available
4. Click on a topic to verify content loads in iframe
5. Test navigation (Previous/Next buttons)
6. Test progress tracking

## Fixes Needed:
1. Create missing Python content files (17 files missing)
2. Remove or rename duplicate MySQL file `03-basic-queries.html` or `03-database-basics.html`

