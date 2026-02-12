package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.PasswordResetToken;
import com.example.demo.entity.User;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    public AuthController(UserRepository userRepository, 
                        PasswordResetTokenRepository passwordResetTokenRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Map<String, Object> response = new HashMap<>();
        
        logger.info("Registration request received for email: " + request.getEmail());
        logger.info("Registration request received for username: " + request.getUsername());

        // Email check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warning("Email already exists: " + request.getEmail());
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Username check
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            logger.warning("Username already exists: " + request.getUsername());
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setProvider("LOCAL");
        user.setProfileImage(null);

        userRepository.save(user);

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
                    userData.put("fullName", user.getFullName());
                    userData.put("profileImage", user.getProfileImage());
                    userData.put("provider", user.getProvider());
                    userData.put("role", user.getRole());
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

    // ================= CHECK EMAIL EXISTS =================
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        boolean exists = userRepository.findByEmail(email).isPresent();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    // ================= CHECK USERNAME EXISTS =================
    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        boolean exists = userRepository.findByUsername(username).isPresent();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}
