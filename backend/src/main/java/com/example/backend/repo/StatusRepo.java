package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.NavigationalStatus;

public interface StatusRepo extends JpaRepository<NavigationalStatus, Integer> {

    public List<NavigationalStatus> findAll();
}

