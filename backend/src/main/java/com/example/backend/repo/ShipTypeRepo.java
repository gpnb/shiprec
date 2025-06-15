package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entity.ShipType;

public interface ShipTypeRepo extends JpaRepository<ShipType, Integer>  {
     @Query("SELECT s.ais_type FROM ShipType s WHERE :shipTypeId BETWEEN s.shiptype_min AND s.shiptype_max")
     public  String findType(@Param("shipTypeId") int shiptypeId);
}
