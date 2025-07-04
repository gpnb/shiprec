package com.example.backend.service;
import com.example.backend.exception.AreaAlreadyExistsException;

import com.example.dto.AreaDto;
import com.example.backend.entity.Area;
import com.example.backend.entity.UserEntity;
import com.example.backend.repo.AreaRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AreaService {
    private final AreaRepo areaRepo;
    private final UserRepo userRepo;

    public AreaService(AreaRepo areaRepo, UserRepo userRepo) {
        this.areaRepo = areaRepo;
        this.userRepo = userRepo;
    }

    public AreaDto createArea(AreaDto dto) {
        UserEntity user = userRepo.findById(dto.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid user id"));
        if (areaRepo.existsByUserIdAndName(dto.getUserId(), dto.getName())) {
            throw new AreaAlreadyExistsException();
        }
        Area a = new Area();
        a.setUser(user);
        a.setName(dto.getName());
        a.setSouthWestLat(dto.getSouthWestLat());
        a.setSouthWestLng(dto.getSouthWestLng());
        a.setNorthEastLat(dto.getNorthEastLat());
        a.setNorthEastLng(dto.getNorthEastLng());
        Area saved = areaRepo.save(a);
        return toDto(saved);
    }

    public List<AreaDto> listAreasForUser(Long userId) {
        return areaRepo.findByUserId(userId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public void deleteArea(Long id) {
        areaRepo.deleteById(id);
    }

    private AreaDto toDto(Area a) {
        return new AreaDto(
            a.getId(),
            a.getUser().getId(),
            a.getName(),
            a.getSouthWestLat(),
            a.getSouthWestLng(),
            a.getNorthEastLat(),
            a.getNorthEastLng()
        );
    }
}