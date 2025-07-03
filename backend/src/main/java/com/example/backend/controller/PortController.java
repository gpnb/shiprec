package com.example.backend.controller;

import com.example.backend.entity.Port;
import com.example.backend.repo.PortRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/ports")
@CrossOrigin(origins = "http://localhost:3000")
public class PortController {

    @Autowired
    private PortRepo portRepo;

    @GetMapping("/all")
    public List<Port> getAllPorts() {
        return portRepo.findAll();
    }

    @GetMapping
    public Page<Port> getPorts(Pageable pageable) {
        return portRepo.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Port getPortById(@PathVariable Integer id) {
        return portRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Port not found with id: " + id));
    }

    @GetMapping("/byname/{name}")
    public Page<Object[]> getIdByName(@PathVariable String name, Pageable pageable) {
        return portRepo.getIdByName(name, pageable);
    }
}
