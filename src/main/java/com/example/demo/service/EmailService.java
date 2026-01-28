package com.example.demo.service;

import com.example.demo.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AppProperties appProperties;

    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        try {
            String resetLink = appProperties.getBaseUrl() + "/reset-password?token=" + resetToken;

            String emailContent = "Hello " + username + ",\n\n" +
                    "We received a request to reset your password. Click the link below to create a new password:\n\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "If you didn't request a password reset, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "TechySpine Team";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(appProperties.getMail().getFrom());
            message.setTo(toEmail);
            message.setSubject("TechySpine - Password Reset Request");
            message.setText(emailContent);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            String emailContent = "Welcome to TechySpine, " + username + "!\n\n" +
                    "Your account has been successfully created.\n\n" +
                    "Start your learning journey: " + appProperties.getBaseUrl() + "\n\n" +
                    "Happy Learning!\n\n" +
                    "Best regards,\n" +
                    "TechySpine Team";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(appProperties.getMail().getFrom());
            message.setTo(toEmail);
            message.setSubject("Welcome to TechySpine!");
            message.setText(emailContent);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
}
