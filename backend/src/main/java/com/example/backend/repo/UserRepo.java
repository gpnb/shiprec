package com.example.backend.repo;
import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<UserEntity, Long>{
    // Did not declare findById because we're already using the one from JpaRepository
    
    // Used for login and registration. Can change to UserEntity findByEmail(String email); later, this is to be sure
    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.email) = LOWER(:email)")
    UserEntity findByEmail(@Param("email") String email);  // used for login and registration
}