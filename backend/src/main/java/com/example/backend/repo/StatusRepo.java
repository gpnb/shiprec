package com.example.backend.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.NavigationalStatus;

public interface StatusRepo extends JpaRepository<NavigationalStatus, Integer> {
}

