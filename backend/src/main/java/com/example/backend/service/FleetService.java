package com.example.backend.service;

import com.example.backend.entity.Fleet;
import com.example.backend.repo.FleetRepo;
import com.example.backend.repo.VesselRepo;
import com.example.backend.entity.Vessel;
import com.example.backend.repo.FleetHasShipsRepo;
import com.example.backend.entity.FleetHasShips;
import com.example.backend.entity.FleetShipKey;
import com.example.dto.FleetDto;
import com.example.dto.VesselStatusDto;
import com.example.dto.FleetListDto;
import com.example.dto.FleetShipsDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service 
public class FleetService {

    @Autowired
    private FleetRepo fleetRepo;

    @Autowired
    private VesselRepo vesselRepo;

    @Autowired
    private FleetHasShipsRepo fleetHasShipsRepo;

    public FleetDto createFleet(FleetDto fleetDto) throws Exception {

        // Create fleet instance
        Fleet fleet = new Fleet();

        fleet.setFleetName(fleetDto.getName());
        fleet.setUserId(fleetDto.getUserId());

        // save fleet to db
        fleetRepo.save(fleet);

        FleetDto retDto = new FleetDto();
        retDto.setName(fleet.getFleetName());
        retDto.setUserId(fleet.getUserId());

        return retDto;
    }

    // create fleet with vessels
    public void createFleet2(FleetDto fleetDto) {
        Fleet fleet = new Fleet();

        fleet.setFleetName(fleetDto.getName());
        fleet.setUserId(fleetDto.getUserId());

        fleetRepo.save(fleet);

        // fleet.getId();   
        List<Vessel> vessels = vesselRepo.findAllById(fleetDto.getVesselIds());
        
        for (Vessel vessel : vessels) {
            FleetHasShips relation = new FleetHasShips(fleet, vessel, true);

            fleet.getVessels().add(relation);
            vessel.getFleets().add(relation);

            fleetHasShipsRepo.save(relation);
        }
    }

    // add vessels to existing fleet
    public ResponseEntity<String> addToFleet(FleetDto fleetDto) {
        Fleet fleet = fleetRepo.findById(fleetDto.getId().intValue()).orElseThrow();

        List<Vessel> vessels = vesselRepo.findAllById(fleetDto.getVesselIds());
        
        for (Vessel vessel : vessels) {
            FleetHasShips relation = new FleetHasShips(fleet, vessel, true);

            fleet.getVessels().add(relation);
            vessel.getFleets().add(relation);

            fleetHasShipsRepo.save(relation);
        }

        fleetRepo.save(fleet);
        
        return ResponseEntity.ok("vessels added");
    }

    public void deleteShipsFromFleet(Integer fleetId, List<Integer> vesselIds) {
        // return;
        Fleet fleet = fleetRepo.findById(fleetId).orElseThrow();

        for (int vid : vesselIds) {
            Vessel vessel = vesselRepo.findById(vid).orElseThrow();

            // aparently, if we create the fleetShipKey id again with the same fleet and vessel, it will be the same.
            // can be used for deleteById in fleetHasShips table
            FleetShipKey id = new FleetShipKey(fleet.getId(), vessel.getMmsi());
            fleetHasShipsRepo.deleteById(id);
        }
    } 

    public void switchShipStatus(VesselStatusDto vesselStatusDto) {
        FleetShipKey id = new FleetShipKey(vesselStatusDto.getFleetId(), vesselStatusDto.getVesselId());
        FleetHasShips relation = fleetHasShipsRepo.findById(id).orElseThrow();
        relation.setActive(vesselStatusDto.getStatus());
        fleetHasShipsRepo.save(relation);
    }

    // get fleet data
    public Page<FleetListDto> getFltDat(Integer uid, Pageable pageable) {
        Page<Object[]> result = fleetRepo.getFltDat(uid.intValue(), pageable);
        Page<FleetListDto> ret = result.map(object -> new FleetListDto(
            (Integer) object[0],
            (String) object[1],
            ((BigDecimal) object[2]).intValueExact(),
            ((Long) object[3]).intValue()
        ));
        return ret;
    }

    public Page<Object[]> getFleetDetByName(String name, Integer uid, Pageable pageable) {
        return fleetRepo.getFltName(name, uid, pageable);
    }

    // get fleet details
    // new problem unlocked the conversion does not play well with boolean here:
    // the frontend reads the boolean value as prototype 
    // this function is ignored untill a fix can be found
    public Page<FleetShipsDto> getFltDtl(Integer id, Pageable pageable) {
        Page<Object[]> result = fleetRepo.getFltDtl(id, pageable);
        Page<FleetShipsDto> ret = result.map(object -> new FleetShipsDto(
            (Integer) object[0],
            (String) object[1],
            (Integer) object[2],
            (String) object[3],
            (boolean) object[4]
        ));
        return ret;
    }
}