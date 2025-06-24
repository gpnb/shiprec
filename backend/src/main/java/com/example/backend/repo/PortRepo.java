package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Port;

public interface PortRepo extends JpaRepository<Port, Integer> {}


