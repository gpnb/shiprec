package com.example.backend.controller;


import com.example.backend.entity.Vessel;
import com.example.backend.repo.VesselRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vessels")
@CrossOrigin(origins = "http://localhost:3000")
public class VesselController {

    @Autowired
    private VesselRepo vesselRepo;

    @GetMapping("/all")
    public List<Vessel> getAllVessels() {
        return vesselRepo.findAll();
    }

    @GetMapping
    public Page<Vessel> getVessels(Pageable pageable) {
        System.out.println("Fetching paginated vessels...");
        return vesselRepo.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Vessel getVesselById(@PathVariable Integer id) {
        return vesselRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Vessel not found"));
    }

    @GetMapping("/byname/{name}")
    public Page<Object[]> getIdsByName(@PathVariable String name, Pageable pageable) {
        return vesselRepo.getIdByName(name, pageable);
    }

    @PutMapping("/{id}/type")
    public ResponseEntity<?> updateShipType(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        String newType = payload.get("shipType");
        Optional<Vessel> optionalVessel = vesselRepo.findById(id);

        if (optionalVessel.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vessel vessel = optionalVessel.get();
        vessel.setShiptype(newType);
        vesselRepo.save(vessel);

        return ResponseEntity.ok("Ship type updated successfully.");
    }
}
