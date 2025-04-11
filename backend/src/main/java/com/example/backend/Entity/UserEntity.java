package com.example.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "User")
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private long id;
    
    @Column
    private String firstName;
    
    @Column
    private String lastName;
    
    @Column
    private String email;
    
    @Column
    private String password;
    
    @Column
    private long phoneNumber;
    
    @Column
    private String country;

    @Column
    private String business;

    UserEntity() {}
}
