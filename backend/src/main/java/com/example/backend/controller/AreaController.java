package com.example.backend.controller;

import com.example.dto.AreaDto;
import com.example.backend.service.AreaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
public class AreaController {
    private final AreaService areaService;

    public AreaController(AreaService areaService) {
        this.areaService = areaService;
    }

    // create a new area
    @PostMapping
    public ResponseEntity<AreaDto> create(@RequestBody AreaDto dto) {
        AreaDto created = areaService.createArea(dto);
        return ResponseEntity.ok(created);
    }

    // list all areas for a given user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AreaDto>> listForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(areaService.listAreasForUser(userId));
    }

    // delete one
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        areaService.deleteArea(id);
        return ResponseEntity.noContent().build();
    }
}