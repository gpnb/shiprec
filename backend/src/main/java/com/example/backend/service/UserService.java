package com.example.backend.service;
import com.example.backend.entity.UserEntity;
import com.example.backend.repo.UserRepo;
import com.example.dto.EmailChangeDto;
import com.example.dto.PasswordChangeDto;
import com.example.dto.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // for secure password storage
    
    // Creates a new user
    public UserDto createUser(UserDto userDto) throws Exception {

        // Create a new user instance
        UserEntity user = new UserEntity();

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setCountry(userDto.getCountry());
        user.setBusiness(userDto.getBusiness());
        user.setEducation(userDto.getEducation());
        user.setNotificationsActive(userDto.getNotificationsActive() != null ? userDto.getNotificationsActive() : true);   // set to true by default
        user.setIsRegistered(true);

        if ("admin@shiprec.com".equalsIgnoreCase(userDto.getEmail())) {
            user.setIsAdmin(true);
        } else {
            user.setIsAdmin(false);
        }
        // Save the user to the database
        userRepo.save(user);

        // Make the dto that the function will return, with user's data
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBusiness(user.getBusiness());
        dto.setEducation(user.getEducation());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setIsRegistered(true);
        dto.setCreationTimestamp(user.getCreationTimestamp());
        dto.setIsAdmin(user.getIsAdmin());

        return dto;
    }

    // Handles login logic
    // Return UserDto instead of UserEntity, so as to not expose everything to the frontend
    public UserDto loginUser(String email, String password) throws Exception {

        UserEntity user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Check if current password matches the password in the database
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Get the corresponding fields
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBusiness(user.getBusiness());
        dto.setEducation(user.getEducation());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setIsRegistered(user.getIsRegistered());
        dto.setIsAdmin(user.getIsAdmin());

        return dto;
    }

    // Handles update logic, for example in the user's "Edit Profile" function
    public UserDto updateUser(Long id, UserDto userDto) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);   
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Extra password checking 
        if (userDto.getPassword() != null && !passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password is incorrect");
        }

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setCountry(userDto.getCountry());
        user.setEducation(userDto.getEducation());
        user.setBusiness(userDto.getBusiness());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setNotificationsActive(userDto.getNotificationsActive());

        userRepo.save(user);

        UserDto dto = new UserDto();    // the updated user info we will return
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setEducation(user.getEducation());
        dto.setBusiness(user.getBusiness());
        dto.setPhoneNumber(user.getPhoneNumber());

        dto.setEmail(user.getEmail());
        dto.setIsRegistered(user.getIsRegistered());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setId(user.getId());

        return dto;
    }

    // Handles just updating the email 
    // Like above, uses id and dto 
    public UserDto updateEmail(Long id, EmailChangeDto changeDto) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);   
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(changeDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password is incorrect");
        }

        // Check if user has already used this email
        if (userRepo.findByEmail(changeDto.getEmail()) != null) {
            throw new RuntimeException("Email already in use");
        }

        // Set the new email
        user.setEmail(changeDto.getEmail());
        userRepo.save(user);

        // Return updated information
        UserDto dto = new UserDto();

        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setEducation(user.getEducation());
        dto.setBusiness(user.getBusiness());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setIsRegistered(user.getIsRegistered());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setId(user.getId());
        dto.setCreationTimestamp(user.getCreationTimestamp());

        return dto;
    }


    // Handles just updating the password
    public UserDto updatePassword(Long id, PasswordChangeDto changeDto) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);   
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Check if user inputs their current password correctly
        if (!passwordEncoder.matches(changeDto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Check if user inputs their "new password confirmation" correctly
        if (!changeDto.getNewPassword().equals(changeDto.getConfirmPassword())) {
            throw new RuntimeException("Confirmation does not match new password");
        }

        // Set the new password
        user.setPassword(passwordEncoder.encode(changeDto.getNewPassword()));
        userRepo.save(user);

        // Return updated information
        UserDto dto = new UserDto();

        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setEducation(user.getEducation());
        dto.setBusiness(user.getBusiness());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setIsRegistered(user.getIsRegistered());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setId(user.getId());
        dto.setCreationTimestamp(user.getCreationTimestamp());
        dto.setIsAdmin(user.getIsAdmin());

        return dto;
    }

    // Handles user deletion
    public void deleteUser(Long id) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        userRepo.delete(user);
    }

    public UserDto setRegistrationStatus(Long id, boolean status) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
    
        user.setIsRegistered(status);
        userRepo.save(user);
    
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBusiness(user.getBusiness());
        dto.setEducation(user.getEducation());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setIsRegistered(user.getIsRegistered());
        dto.setIsAdmin(user.getIsAdmin());
        dto.setCreationTimestamp(user.getCreationTimestamp());
    
        return dto;
    }
    

    public Page<UserEntity> getPaginatedUsers(Pageable pageable) {
        return userRepo.findAll(pageable);
    }
}
