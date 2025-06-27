package com.example.backend.repo;
import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UserEntity, Long>{
    // Did not declare findById because we're already using the one from JpaRepository
    
    UserEntity findByEmail(String email);  // used for login and registration
}