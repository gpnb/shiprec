// this dto is not used yet

package com.example.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.lang.Object;
import com.fasterxml.jackson.annotation.JsonProperty;

@NoArgsConstructor
@Getter           
@Setter

public class FleetShipsDto {
    
    private Integer mmsi;

    private String name;

    private Integer imo;

    private String type;

    private Boolean status;

    public FleetShipsDto(Integer id, String name, Integer num, String type, Boolean status) {
        this.mmsi = id;
        this.name = name;
        this.imo = num;
        this.type = type;
        this.status = status;
    }

    // @JsonProperty("status")
    // public boolean isStatus() {
    //     return status;
    // }

    // public void setStatus(boolean status) {
    //     this.status = status;
    // }
}