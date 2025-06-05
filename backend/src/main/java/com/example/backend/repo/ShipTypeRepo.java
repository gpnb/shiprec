package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.ShipType;

public interface ShipTypeRepo extends JpaRepository<ShipType, Integer>  {
     public List<ShipType> findAll();
}
