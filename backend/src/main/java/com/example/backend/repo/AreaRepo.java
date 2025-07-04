package com.example.backend.repo;

import com.example.backend.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AreaRepo extends JpaRepository<Area, Long> {
    List<Area> findByUserId(Long userId);
    boolean existsByUserIdAndName(Long userId, String name);
}