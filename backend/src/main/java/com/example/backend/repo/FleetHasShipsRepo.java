package com.example.backend.repo;
import com.example.backend.entity.Fleet;
import com.example.backend.entity.Vessel;
import com.example.backend.entity.FleetShipKey;
import com.example.backend.entity.FleetHasShips;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entity.VesselInstance;
import com.example.dto.FltCustDto;

// Don't forget: the id now is class FleetShipKey (instead of Integer/Long)
public interface FleetHasShipsRepo extends JpaRepository<FleetHasShips, FleetShipKey>{
    void deleteByFleet(Fleet fleet);
    void deleteByFleetAndVessel(Fleet fleet, Vessel vessel);
}