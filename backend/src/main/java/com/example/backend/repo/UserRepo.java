package com.example.backend.repo;
import com.example.backend.entity.UserEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<UserEntity, Long>{
    // Did not declare findById because we're already using the one from JpaRepository
    
    UserEntity findByEmail(String email);  // used for login and registration

    @Query("SELECT u FROM UserEntity u WHERE u.isAdmin IS NULL OR u.isAdmin = false")
    Page<UserEntity> findAllNonAdmins(Pageable pageable);

    @Query(value = "SELECT u.id FROM user u WHERE u.email LIKE CONCAT(:name, '%')", nativeQuery = true)
    Page<Object[]> getIdByName(@Param("name") String name, Pageable pageable);
}