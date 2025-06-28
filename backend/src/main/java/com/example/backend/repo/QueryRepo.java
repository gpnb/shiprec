package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Query;

public interface QueryRepo extends JpaRepository<Query, Integer> {}
