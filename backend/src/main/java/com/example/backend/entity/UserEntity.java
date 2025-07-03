package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime; // for creation timestamp

@Entity
@Getter
@Setter
@Table(name = "user")
public class UserEntity {
    
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(unique = true, nullable = false, name = "email")
    private String email;
    
    @Column(nullable = false, name = "password")
    private String password;
    
    @Column(name = "phone_number")
    private Long phoneNumber;
    
    @Column(name = "country")
    private String country;

    @Column(name = "business")
    private String business;

    @Column(name = "education")
    private String education;

    @Column(name = "notifications_active")
    private Boolean notificationsActive;

    @Column(updatable = false, name = "creation_timestamp")
    private LocalDateTime creationTimestamp;

    // Using this instead of role_id
    @Column(name = "is_registered")
    private Boolean isRegistered = false; 

    @Column(name = "is_admin")
    private Boolean isAdmin = false;

    // Constructor. Must be public for it to be visible in service
    public UserEntity() {
    }

    // Generate creation time stamp. Using this for constructor to stay clean
    @PrePersist
    protected void onCreate() {
        this.creationTimestamp = LocalDateTime.now();
    }

}
