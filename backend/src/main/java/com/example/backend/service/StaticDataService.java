package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.repo.CountryRepo;

import jakarta.annotation.PostConstruct;

@Service
public class StaticDataService {
    
    @Autowired
    private CountryRepo countryRepo;


    @PostConstruct
    public void init() {
        


    }
}
