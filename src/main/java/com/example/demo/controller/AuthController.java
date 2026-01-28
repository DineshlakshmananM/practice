package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.PasswordResetToken;
import com.example.demo.entity.User;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.GoogleTokenVerifier;
import com.example.demo.config.AppProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final AppProperties appProperties;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    public AuthController(UserRepository userRepository, 
                        PasswordResetTokenRepository passwordResetTokenRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        EmailService emailService,
                        GoogleTokenVerifier googleTokenVerifier,
                        AppProperties appProperties) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.googleTokenVerifier = googleTokenVerifier;
        this.appProperties = appProperties;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Map<String, Object> response = new HashMap<>();

        // Email check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Username check
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("LOCAL");
        user.setProfileImage(null);

        userRepository.save(user);
        
        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        response.put("success", true);
        response.put("message", "Registration successful");

        return ResponseEntity.ok(response);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Map<String, Object> response = new HashMap<>();

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {

                    if (user.getPassword() == null ||
                        !passwordEncoder.matches(request.getPassword(), user.getPassword())) {

                        response.put("success", false);
                        response.put("message", "Invalid email or password");
                        return ResponseEntity.badRequest().body(response);
                    }

                    // Update last login time
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);

                    response.put("success", true);
                    response.put("message", "Login successful");

                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("email", user.getEmail());
                    userData.put("profileImage", user.getProfileImage());
                    userData.put("provider", user.getProvider());
                    userData.put("createdAt", user.getCreatedAt());

                    response.put("user", userData);

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Invalid email or password");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    // Create password reset token
                    PasswordResetToken token = new PasswordResetToken(user);
                    passwordResetTokenRepository.save(token);

                    // Send reset email
                    emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token.getToken());

                    response.put("success", true);
                    response.put("message", "Password reset link sent to your email");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Email not found");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();

        return passwordResetTokenRepository.findByToken(request.getToken())
                .map(token -> {
                    if (!token.isValid()) {
                        response.put("success", false);
                        response.put("message", "Token expired or invalid");
                        return ResponseEntity.badRequest().body(response);
                    }

                    User user = token.getUser();
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(user);

                    token.setUsed(true);
                    passwordResetTokenRepository.save(token);

                    response.put("success", true);
                    response.put("message", "Password reset successful");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Invalid token");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    // ================= GOOGLE OAUTH =================
    
    /**
     * Handle Google Sign-In with ID Token.
     * Verifies the Google ID token and creates/updates user account.
     */
    @PostMapping("/google-signin")
    public ResponseEntity<?> googleSignIn(@RequestBody GoogleSignInRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String idToken = request.getToken();
            
            if (idToken == null || idToken.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Google ID token is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Verify Google ID token using Google API
            GoogleTokenVerifier.TokenInfo tokenInfo = googleTokenVerifier.verifyToken(idToken);
            
            // Get user info from verified token
            String email = tokenInfo.getEmail();
            String name = tokenInfo.getName();
            String picture = tokenInfo.getPicture();
            
            if (email == null) {
                response.put("success", false);
                response.put("message", "Email not found in Google token");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        // Generate unique username from name or email
                        String baseUsername = name != null && !name.isEmpty() 
                            ? name.replaceAll("[^a-zA-Z0-9]", "") 
                            : email.split("@")[0];
                        String username = baseUsername;
                        int counter = 1;
                        while (userRepository.findByUsername(username).isPresent()) {
                            username = baseUsername + counter++;
                        }
                        newUser.setUsername(username);
                        newUser.setProvider("GOOGLE");
                        newUser.setPassword(null); // No password for OAuth users
                        return newUser;
                    });
            
            // Update profile picture if provided
            if (picture != null && !picture.isEmpty()) {
                user.setProfileImage(picture);
            }
            
            // Update username if name changed and user was just created
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                String baseUsername = name != null && !name.isEmpty() 
                    ? name.replaceAll("[^a-zA-Z0-9]", "") 
                    : email.split("@")[0];
                String username = baseUsername;
                int counter = 1;
                while (userRepository.findByUsername(username).isPresent()) {
                    username = baseUsername + counter++;
                }
                user.setUsername(username);
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Google sign-in successful");
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("profileImage", user.getProfileImage());
            userData.put("provider", user.getProvider());
            userData.put("createdAt", user.getCreatedAt());
            
            response.put("user", userData);
            return ResponseEntity.ok(response);
            
        } catch (GoogleTokenVerifier.TokenVerificationException e) {
            response.put("success", false);
            response.put("message", "Invalid Google token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Google sign-in failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Redirect to Google OAuth consent screen.
     * This initiates the OAuth2 authorization code flow.
     */
    @GetMapping("/google")
    public ResponseEntity<?> googleLogin() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Build Google OAuth consent URL
            String baseUrl = appProperties.getBaseUrl();
            if (baseUrl == null || baseUrl.isEmpty()) {
                baseUrl = "http://localhost:8082";
            }
            
            String redirectUri = baseUrl + "/api/auth/google-callback";
            
            String authUrl = UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                    .queryParam("client_id", googleClientId != null ? googleClientId : "")
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("response_type", "code")
                    .queryParam("scope", "openid email profile")
                    .queryParam("prompt", "consent")
                    .build()
                    .toUriString();
            
            response.put("success", true);
            response.put("authUrl", authUrl);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to initiate Google login: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Handle Google OAuth callback.
     * Receives the authorization code and exchanges it for tokens.
     */
    @GetMapping("/google-callback")
    public ResponseEntity<?> googleCallback(@RequestParam("code") String code) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (code == null || code.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Authorization code not received");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Exchange authorization code for tokens (Spring auto-configures this via provider.google.token-uri)
            
            // Build redirect URI
            String redirectUri = appProperties.getBaseUrl() + "/api/auth/google-callback";
            
            // Note: In a production environment, you would make a proper token exchange
            // For now, we'll redirect back to frontend with the code for client-side handling
            response.put("success", true);
            response.put("message", "Authorization code received. Complete sign-in from frontend.");
            response.put("code", code);
            response.put("redirectUri", redirectUri);
            response.put("instructions", "Use this code with /api/auth/google-token endpoint to complete authentication");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Google callback failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Exchange authorization code for ID token.
     * This is called after the OAuth callback to complete the authentication.
     */
    @PostMapping("/google-token")
    public ResponseEntity<?> exchangeCodeForToken(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code");
            if (code == null || code.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Authorization code is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // In a real implementation, you would:
            // 1. Exchange the code for tokens using Google's token endpoint
            // 2. Verify the ID token
            // 3. Create/update user account
            
            // For now, return instructions for completing the flow
            response.put("success", true);
            response.put("message", "Code received. Use /api/auth/google-signin with the ID token.");
            response.put("note", "For full OAuth flow, implement server-side token exchange here");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Token exchange failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

