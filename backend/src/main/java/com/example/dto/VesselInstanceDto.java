package com.example.dto;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter


public class VesselInstanceDto {
    
    private Date time_received;
    
    private String ship_name;
    
    private String ship_type;
    
    private int imonumber;
    
    private String navigational_status;

    private double course_over_ground;

    private double speed_over_ground;

    private Date eta;

    private double draught;

}
