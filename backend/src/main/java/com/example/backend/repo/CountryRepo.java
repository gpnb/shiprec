package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.CountryCodes;

public interface CountryRepo extends JpaRepository<CountryCodes,int> {
    List <CountryCodes> findAll();
}