package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Vessel;

public interface VesselRepo extends JpaRepository<Vessel, Integer>{}
