package com.example.backend.service;
import com.example.backend.entity.UserEntity;
import com.example.backend.repo.UserRepo;
import com.example.dto.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
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
        user.setNotificationsActive(userDto.getNotificationsActive());
        user.setIsRegistered(true);

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

        return dto;
    }

    // Handles update logic, for example in the user's "Edit Profile" function
    public UserDto updateUser(Long id, UserDto userDto) throws Exception {
        UserEntity user = userRepo.findById(id).orElse(null);   
        if (user == null) {
            throw new RuntimeException("User not found");
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


}
