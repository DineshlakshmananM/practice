package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.email).isPresent()) {
            return "Email already registered";
        }

        User user = new User();
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPassword(request.password); // plain text (learning phase)

        userRepository.save(user);

        return "Registration successful";
    }

    // LOGIN (EMAIL + PASSWORD)
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userRepository.findByEmail(request.email)
                .map(user ->
                        user.getPassword().equals(request.password)
                                ? "Login successful"
                                : "Invalid email or password"
                )
                .orElse("Invalid email or password");
    }
}
