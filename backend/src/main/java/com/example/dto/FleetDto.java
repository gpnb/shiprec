package com.example.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@NoArgsConstructor
@Getter           
@Setter

public class FleetDto {
    
    private Long id;

    private String name;

    private Integer userId;

    private List<Integer> vesselIds;
}