package com.example.backend.controller;

import com.example.backend.service.FleetService;

import com.example.dto.FleetDto;
import com.example.dto.VesselStatusDto;
import com.example.dto.FleetListDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entity.Fleet;
import com.example.backend.repo.FleetRepo;
import java.util.List;

@RestController
@RequestMapping("/api/fleets")
@CrossOrigin(origins = "http://localhost:3000")
public class FleetController {
    @Autowired
    private FleetService fleetService;

    @Autowired
    private FleetRepo fleetRepo;

    // not used
    @PostMapping("/create")
    public ResponseEntity<FleetDto> createFleet(@RequestBody FleetDto fleetDto) {
        try {
            FleetDto createdFleet = fleetService.createFleet(fleetDto);
            return ResponseEntity.ok(createdFleet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // used when creating fleet from vessels page
    @PostMapping("/create2")
    public ResponseEntity<String> createFleet2(@RequestBody FleetDto fleetDto) {
        fleetService.createFleet2(fleetDto);
        return ResponseEntity.ok("fleet created");
    }

    // used when adding vessels to existing fleet from vessels page
    @PostMapping("/add")
    public ResponseEntity<String> addToFleet(@RequestBody FleetDto fleetDto) {
        return fleetService.addToFleet(fleetDto);
    }

    // used on MyAccount/fleets page (return details about fleets)
    @GetMapping("/tpag2/{uid}")
    public Page<FleetListDto> getDat(@PathVariable Long uid, Pageable pageable) {
        return fleetService.getFltDat(uid.intValue(), pageable);
    }

    // used on MyAccount/fleets/id (return details about specific fleet)
    @GetMapping("/{id}")
    public Page<Object[]> getFleetDet(@PathVariable Integer id, Pageable pageable) {
        return fleetRepo.getFltDtl(id, pageable);
    }

    @GetMapping("/byname/{uid}/{name}")
    public Page<Object[]> getFleetDetByName(@PathVariable Integer uid, @PathVariable String name, Pageable pageable) {
        return fleetService.getFleetDetByName(name, uid, pageable);
    }

    // delete fleets (in bulk) from MyAccount/fleets
    @PostMapping("/delbulk")
    public ResponseEntity<String> bulkDelete(@RequestBody List<Integer> ids) {
        fleetRepo.deleteAllById(ids);
        return ResponseEntity.ok("Fleets deleted");
    }

    @PostMapping("/del2/{fid}")
    public ResponseEntity<String> deleteShipFromFleet(@PathVariable Long fid, @RequestBody List<Integer> vids) {
        fleetService.deleteShipsFromFleet(fid.intValue(), vids);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/list/{uid}")
    public Page<Fleet> getAllFleets(@PathVariable Long uid, Pageable pageable) {
        return fleetRepo.findAllByUserId(uid.intValue(), pageable);
    }

    @PostMapping("/changestat")
    public ResponseEntity<String> switchShipStatus(@RequestBody VesselStatusDto vesselStatusDto) {
        fleetService.switchShipStatus(vesselStatusDto);
        return ResponseEntity.noContent().build();
    }
}