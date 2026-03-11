package de.iu.planetpulse.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        Map<String, Object> response = new HashMap<>();

        // Logik für Rollentrennung (Prototyp-Modus)
        if ("admin".equals(username) && "admin123".equals(password)) {
            response.put("success", true);
            response.put("role", "EDITOR");
        } 
        else if ("science".equals(username) && "science123".equals(password)) {
            response.put("success", true);
            response.put("role", "SCIENTIST");
        } 
        else {
            response.put("success", false);
            response.put("role", null);
        }

        return response;
    }
}