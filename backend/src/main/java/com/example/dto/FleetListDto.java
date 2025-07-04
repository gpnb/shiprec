package com.example.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter           
@Setter

public class FleetListDto {
    
    private Integer id;

    private String name;

    private Integer active_Vessels;

    private Integer total_Vessels;

    public FleetListDto(Integer id, String name, Integer num_active, Integer num) {
        this.id = id;
        this.name = name;
        this.active_Vessels = num_active;
        this.total_Vessels = num;
    }
}