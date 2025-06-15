package com.example.backend.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.CountryCode;

public interface CountryRepo extends JpaRepository<CountryCode,Integer> {
}