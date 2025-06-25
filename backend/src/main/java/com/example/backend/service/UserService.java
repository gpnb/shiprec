package com.example.backend.service;
import com.example.backend.entity.UserEntity;
import com.example.backend.repo.UserRepo;
import com.example.dto.UserDto;
// import com.example.backend.entity.Role;
// import com.example.backend.repo.RoleRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    // @Autowired
    // private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // for secure password storage
    
    // Creates a new user 
    public void createUser(UserDto userDto) throws Exception {

        // DEBUGGING 
        // System.out.println("Checking for email: " + userDto.getEmail());
        // System.out.println("FirstName: " + userDto.getFirstName());
        // System.out.println("LastName: " + userDto.getLastName());
        // System.out.println("Country: " + userDto.getCountry());
        // System.out.println("Password: " + userDto.getPassword());
        // System.out.println("Phone: " + userDto.getPhoneNumber());
        // System.out.println("Business: " + userDto.getBusiness());
        // System.out.println("Education: " + userDto.getEducation());
        // System.out.println("NotificationsActive: " + userDto.getNotificationsActive());
        // System.out.println("Received user DTO: " + userDto);


        // UserEntity existing = userRepo.findByEmail(userDto.getEmail().toLowerCase());
        // System.out.println("Existing user: " + (existing != null ? existing.getEmail() : "null"));
        // Throw exception if user exists already - keep this after removing debugs.
        // if (existing != null) {
        //     throw new RuntimeException("This email is already in use.");
        // }
        // END OF DEBUGGING

        // Create a new user instance
        UserEntity user = new UserEntity();

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword())); // update here
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setCountry(userDto.getCountry());
        user.setBusiness(userDto.getBusiness());
        user.setEducation(userDto.getEducation());
        user.setNotificationsActive(userDto.getNotificationsActive());
        user.setIsRegistered(true);

        // // Set new user's role to user
        // Role role = roleRepo.findByRole("user");
        // user.setRole(role);

        // Save the user to the database
        userRepo.save(user);
    }

    // Handles login logic
    // password is the "raw" password
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
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBusiness(user.getBusiness());
        dto.setEducation(user.getEducation());
        dto.setNotificationsActive(user.getNotificationsActive());
        dto.setIsRegistered(user.getIsRegistered());
        // dto.setRoleId(user.getRole() != null ? user.getRole().getId() : null);

        return dto;

    }

}
