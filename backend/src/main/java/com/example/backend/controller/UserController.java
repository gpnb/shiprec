package com.example.backend.controller;

import com.example.backend.entity.UserEntity;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.UserService;
import com.example.dto.UserDto;
import com.example.dto.EmailChangeDto;
import com.example.dto.PasswordChangeDto;
import com.example.dto.LoginDto;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    // Create a user and save their data
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {

        try {
            UserDto createdUser = userService.createUser(userDto);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Save logged in user's data and check their credentials
    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody LoginDto loginDto) {
        try {
            UserDto loggedInUser = userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
            return ResponseEntity.ok(loggedInUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // To update the user's information, like on their profile
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        try {
            UserDto updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // if updating sth that doesn't exist
        }
    }

    // To update the user's email (settings)
    // This will respond to en email and password pair that will be given by the frontend in ChangeEmailPopup.jsx, included in settings page
    @PutMapping("/{id}/email")
    public ResponseEntity<UserDto> updateEmail(@PathVariable Long id, @RequestBody EmailChangeDto changeDto) {
        try {
            UserDto updatedUser = userService.updateEmail(id, changeDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // To update the user's password (settings)
    @PutMapping("/{id}/password")
    public ResponseEntity<UserDto> updatePassword(@PathVariable Long id, @RequestBody PasswordChangeDto changeDto) {
        try {
            UserDto updatedUser = userService.updatePassword(id, changeDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // To delete a user from the database (settings)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());   // user doesn't exist
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();    // internal error on deletion
        }
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<UserDto> toggleBanUser(@PathVariable Long id, @RequestBody Boolean isRegistered) {
        try {
            UserDto updatedUser = userService.setRegistrationStatus(id, isRegistered);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public Page<UserEntity> getUsers(Pageable pageable) {
        System.out.println("Fetching paginated Users...");
        return userService.getPaginatedUsers(pageable);
    }

    @PostMapping("/delbulk")
    public ResponseEntity<String> bulkDelete(@RequestBody List<Long> ids) {
        userRepo.deleteAllById(ids);
        return ResponseEntity.ok("Queries deleted");
    }

    @GetMapping("/byname/{name}")
    public Page<Object[]> getIdByName(@PathVariable String name, Pageable pageable) {
        return userRepo.getIdByName(name, pageable);
    }

}   