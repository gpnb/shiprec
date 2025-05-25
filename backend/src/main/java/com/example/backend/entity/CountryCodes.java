package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Countries")
@NoArgsConstructor
@Getter
@Setter

public class CountryCodes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private int id;

    @Column
    private String country;

}
