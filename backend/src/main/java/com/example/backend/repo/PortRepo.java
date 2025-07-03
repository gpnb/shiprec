package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Port;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PortRepo extends JpaRepository<Port, Integer> {
    @Query(value = "SELECT p.wpi FROM port p WHERE p.port LIKE CONCAT(:name, '%')", nativeQuery = true)
    Page<Object[]> getIdByName(@Param("name") String name, Pageable pageable);
}
