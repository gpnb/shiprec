package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entity.Vessel;

public interface VesselRepo extends JpaRepository<Vessel, Integer>{
    @Query(value = "SELECT v.mmsi FROM vessel v WHERE v.name LIKE CONCAT(:name, '%')", nativeQuery = true)
    Page<Object[]> getIdByName(@Param("name") String name, Pageable pageable);
}
