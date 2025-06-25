package com.example.backend.controller;

import com.example.backend.entity.Port;
import com.example.backend.entity.Vessel;
import com.example.backend.repo.VesselRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

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
}
