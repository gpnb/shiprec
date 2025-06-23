package com.example.backend.controller;

import com.example.backend.entity.UserEntity;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.UserService;
import com.example.dto.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


// @CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;
    
    // @PostMapping("/login")
    // public UserEntity login(@RequestBody UserEntity loginData) {
    //     return userService.loginUser(loginData.getEmail(), loginData.getPassword());
    // }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {

        System.out.println("Received request in controller with email: " + userDto.getEmail());

        try {
            userService.createUser(userDto);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}