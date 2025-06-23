package com.example.backend.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Role;

public interface  RoleRepo extends JpaRepository<Role, Long> {
    Role findById(long role_id);
    Role findByRole(String role);
}