package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// simple DTO for transferring area data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AreaDto {
    private Long id;
    private Long userId;
    private String name;
    private Double southWestLat;
    private Double southWestLng;
    private Double northEastLat;
    private Double northEastLng;
}