package com.example.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.lang.Object;

@NoArgsConstructor
@Getter           
@Setter

public class FleetListDto {
    
    private Integer id;

    private String name;

    private Integer totalVessels;

    public FleetListDto(Integer id, String name, Integer num) {
        this.id = id;
        this.name = name;
        this.totalVessels = num;
    }
}