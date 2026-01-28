# Google OAuth Implementation Plan

## Overview
Implement Google OAuth authentication for the TechySpine application using Google ID Token verification.

## TODOs to Complete
- [x] 1. Create GoogleTokenVerifier service to verify Google ID tokens
- [x] 2. Update AuthController.java - Implement token verification in googleSignIn()
- [x] 3. Add google-callback endpoint for OAuth flow
- [x] 4. Update application.properties with proper redirect URI
- [x] 5. Update api.js with better error handling
- [x] 6. Update login.html to handle OAuth callback
- [ ] 7. Test the implementation

## Implementation Details

### 1. GoogleTokenVerifier Service ✅
- Location: `src/main/java/com/example/demo/service/GoogleTokenVerifier.java`
- Purpose: Verify Google ID tokens using Google's tokeninfo API
- Method: verifyToken(String idToken) returns TokenInfo or throws exception
- API endpoint: https://oauth2.googleapis.com/tokeninfo?id_token=TOKEN

### 2. AuthController Updates ✅
- Inject GoogleTokenVerifier service
- Modify googleSignIn() to:
  - Verify the Google ID token first
  - Extract email, name, picture from verified token
  - Create/update user based on verified email
- Add google-callback endpoint for OAuth redirect flow
- Add google-token endpoint for token exchange

### 3. Configuration Updates ✅
- Update application.properties with redirect URI and OAuth endpoints
- Configure CORS if needed

## Files Modified/Created
1. ✅ `src/main/java/com/example/demo/service/GoogleTokenVerifier.java` (NEW)
2. ✅ `src/main/java/com/example/demo/controller/AuthController.java` (UPDATE)
3. ✅ `src/main/resources/application.properties` (UPDATE)
4. ✅ `src/main/resources/static/js/api.js` (UPDATE)
5. ✅ `src/main/resources/static/login.html` (UPDATE)

## API Endpoints
- `POST /api/auth/google-signin` - Verify Google ID token and sign in
- `GET /api/auth/google` - Get Google OAuth consent URL
- `GET /api/auth/google-callback` - Handle OAuth callback
- `POST /api/auth/google-token` - Exchange authorization code for tokens

## Configuration Required
Before testing, update `application.properties`:
```
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_GOOGLE_CLIENT_SECRET
app.base-url=http://localhost:8082
```

## Testing Steps
1. Start the application
2. Test Google login from frontend
3. Verify token verification works
4. Check user creation/updating
5. Verify redirect to dashboard

