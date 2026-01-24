package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for API calls
            .authorizeHttpRequests(authz -> authz
                // Allow all static resources
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/css/**").permitAll()
                .requestMatchers("/js/**").permitAll()
                .requestMatchers("/assets/**").permitAll()
                .requestMatchers("/content/**").permitAll()
                
                // Allow public HTML pages
                .requestMatchers("/").permitAll()
                .requestMatchers("/index.html").permitAll()
                .requestMatchers("/login.html").permitAll()
                .requestMatchers("/register.html").permitAll()
                .requestMatchers("/learning.html").permitAll()  // Public - no auth required
                .requestMatchers("/dashboard.html").permitAll()  // Public - no auth required
                .requestMatchers("/profile.html").permitAll()    // Public - no auth required
                .requestMatchers("/skills.html").permitAll()     // Public - no auth required
                .requestMatchers("/practice.html").permitAll()   // Public - no auth required
                
                // Allow all API auth endpoints (register, login, logout, google)
                .requestMatchers("/api/auth/**").permitAll()
            )
            .httpBasic(basic -> {});
        
        return http.build();
    }
}
