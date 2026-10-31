package com.orgpilot.backend1.controller;
import com.orgpilot.backend1.dto.LoginRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.orgpilot.backend1.entity.User;
import com.orgpilot.backend1.dto.RegisterRequest;
import com.orgpilot.backend1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
})
public class HelloController {
    @Autowired
    private UserService userService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from OrgPilot AI Backend!";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        User user = userService.findByEmail(request.getEmail());

        if (user == null) {
            return "Invalid Email or Password";
        }

        if (user.getPassword().equals(request.getPassword())) {
            return "Login Successful";
        }

        return "Invalid Email or Password";
    }
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        System.out.println("Register API called");
        System.out.println(request.getName());
        System.out.println(request.getEmail());

        if (userService.findByEmail(request.getEmail()) != null) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userService.saveUser(user);

        System.out.println("User saved successfully");

        return "Registration Successful";
    }
}