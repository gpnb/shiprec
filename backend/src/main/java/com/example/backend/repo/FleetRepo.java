package com.example.backend.repo;
import com.example.backend.entity.Fleet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entity.VesselInstance;
import com.example.dto.FltCustDto;

public interface FleetRepo extends JpaRepository<Fleet, Integer>{
    Page<Fleet> findById(Integer id, Pageable pageable);

    List<Fleet> findByUserId(Integer userId);
    Page<Fleet> findAllByUserId(Integer userId, Pageable pageable);
    void deleteById(Integer id);

    @Query(value = "select v.mmsi from vessel v, fleet_has_ships c, fleet f where f.id = c.fleet_id and v.mmsi = c.vessel_id and f.fleet_name = :name and f.user_id = :uid", nativeQuery = true)
    Page<Object[]> getFltName(@Param("name") String name, @Param("uid") Integer uid,  Pageable pageable);
   
    @Query(value = "SELECT f.id AS ID, f.fleet_name AS NAME, SUM(c.active) AS ACTIVE, count(v.mmsi) AS NUMBER FROM fleet f, vessel v, fleet_has_ships c WHERE f.id = c.fleet_id AND v.mmsi = c.vessel_id AND f.user_id = :uid GROUP BY f.id", nativeQuery = true)
    Page<Object[]> getFltDat(@Param("uid") Integer uid, Pageable pageable);

    @Query(value = "select v.mmsi, v.name, v.imonumber, v.shiptype, c.active from vessel v, fleet_has_ships c, fleet f where f.id = c.fleet_id and v.mmsi = c.vessel_id and f.id = :id", nativeQuery = true)
    Page<Object[]> getFltDtl(@Param("id") Integer id, Pageable pageable);
}