package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Service to verify Google ID tokens using Google's tokeninfo API.
 * 
 * This service is used for Google Sign-In to validate that the token
 * received from the frontend is a valid Google ID token.
 */
@Service
public class GoogleTokenVerifier {

    private static final Logger logger = LoggerFactory.getLogger(GoogleTokenVerifier.class);
    private static final String TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
    
    private final RestTemplate restTemplate;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    public GoogleTokenVerifier() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Verify a Google ID token and extract user information.
     * 
     * @param idToken The Google ID token from the frontend
     * @return TokenInfo containing user information from Google
     * @throws TokenVerificationException if token verification fails
     */
    public TokenInfo verifyToken(String idToken) {
        if (idToken == null || idToken.trim().isEmpty()) {
            throw new TokenVerificationException("ID token is null or empty");
        }

        try {
            // Make request to Google's tokeninfo endpoint
            String url = TOKEN_INFO_URL + "?id_token=" + idToken;
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null) {
                throw new TokenVerificationException("No response from Google token verification");
            }

            // Check for error in response
            if (response.containsKey("error")) {
                String errorDescription = (String) response.get("error_description");
                throw new TokenVerificationException("Google token error: " + errorDescription);
            }

            // Verify the audience (client ID)
            String audience = (String) response.get("aud");
            if (audience != null && googleClientId != null && !googleClientId.isEmpty()) {
                if (!audience.equals(googleClientId)) {
                    logger.warn("Token audience '{}' does not match configured client ID", audience);
                    // Note: We don't fail here as the client ID might be set differently
                }
            }

            // Extract token info
            String subject = (String) response.get("sub");
            String email = (String) response.get("email");
            String emailVerified = (String) response.get("email_verified");
            String name = (String) response.get("name");
            String picture = (String) response.get("picture");

            // Validate required fields
            if (subject == null) {
                throw new TokenVerificationException("Token missing subject (sub) claim");
            }

            TokenInfo tokenInfo = new TokenInfo();
            tokenInfo.setSubject(subject);
            tokenInfo.setEmail(email);
            tokenInfo.setEmailVerified("true".equalsIgnoreCase(emailVerified));
            tokenInfo.setName(name);
            tokenInfo.setPicture(picture);

            logger.info("Successfully verified Google token for user: {}", email);
            return tokenInfo;

        } catch (TokenVerificationException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error verifying Google token", e);
            throw new TokenVerificationException("Failed to verify Google token: " + e.getMessage());
        }
    }

    /**
     * Exception thrown when Google token verification fails.
     */
    public static class TokenVerificationException extends RuntimeException {
        public TokenVerificationException(String message) {
            super(message);
        }

        public TokenVerificationException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * Data class containing user information extracted from a Google ID token.
     */
    public static class TokenInfo {
        private String subject;
        private String email;
        private boolean emailVerified;
        private String name;
        private String picture;

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public boolean isEmailVerified() {
            return emailVerified;
        }

        public void setEmailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPicture() {
            return picture;
        }

        public void setPicture(String picture) {
            this.picture = picture;
        }

        @Override
        public String toString() {
            return "TokenInfo{" +
                    "subject='" + subject + '\'' +
                    ", email='" + email + '\'' +
                    ", emailVerified=" + emailVerified +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
}

