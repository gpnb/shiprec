package com.example.backend.repo;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QueryRepo extends JpaRepository<com.example.backend.entity.Query, Integer> {

    @Query(value = "SELECT q.id FROM `query` q WHERE q.email LIKE CONCAT(:name, '%')", nativeQuery = true)
    Page<Object[]> getIdByName(@Param("name") String name, Pageable pageable);
}
