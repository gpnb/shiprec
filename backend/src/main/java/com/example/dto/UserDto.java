package com.example.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor // lombok generates α default constructor with this
@Getter            // with getter and setter, there is no need to write anything manually
@Setter 

public class UserDto {

    // private Long roleId;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private Long phoneNumber;

    private String country;

    private String business;

    private String education;

    private Boolean notificationsActive;

    private Boolean isRegistered;

}