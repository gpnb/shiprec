package com.example.backend.repo;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entity.Vessel;
import com.example.backend.entity.VesselInstance;
import com.example.backend.entity.VesselInstanceId;

public interface VesselInstanceRepo extends JpaRepository<VesselInstance, VesselInstanceId>{
    
       @Query("SELECT vi.destination FROM VesselInstance vi " +"WHERE vi.mmsi = :vessel " +"AND vi.id.timestamp <= :timestamp " +"AND vi.id.timestamp = (SELECT MAX(vi2.id.timestamp) FROM VesselInstance vi2 " +"WHERE vi2.mmsi = :vessel AND vi2.id.timestamp <= :timestamp)")   
       Optional<String> findLastDestination(@Param("vessel") Vessel vessel,@Param("timestamp") Date timestamp);

       @Query("SELECT vi.draught FROM VesselInstance vi " +"WHERE vi.mmsi = :vessel " +"AND vi.id.timestamp <= :timestamp " +"AND vi.id.timestamp = (SELECT MAX(vi2.id.timestamp) FROM VesselInstance vi2 " +"WHERE vi2.mmsi = :vessel AND vi2.id.timestamp <= :timestamp)")    
       Optional<Double> findLastDraught(@Param("vessel") Vessel vessel,@Param("timestamp") Date timestamp);

       @Query("SELECT vi.eta FROM VesselInstance vi " +"WHERE vi.mmsi = :vessel " +"AND vi.id.timestamp <= :timestamp " +"AND vi.eta <= :timestamp " +"AND vi.id.timestamp = (SELECT MAX(vi2.id.timestamp) FROM VesselInstance vi2 " +"WHERE vi2.mmsi = :vessel AND vi2.id.timestamp <= :timestamp)")       
       Optional<Date>  findLastETA(@Param("vessel") Vessel vessel,@Param("timestamp") Date timestamp);

}
