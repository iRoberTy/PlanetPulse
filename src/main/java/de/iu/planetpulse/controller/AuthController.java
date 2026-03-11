package de.iu.planetpulse.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${admin.username}")
    private String correctUsername;

    @Value("${admin.password}")
    private String correctPassword;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (correctUsername.equals(username) && correctPassword.equals(password)) {
            return Map.of("success", true);
        }
        return Map.of("success", false);
    }
}