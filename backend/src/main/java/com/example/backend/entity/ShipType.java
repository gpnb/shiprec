package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class ShipType {
    @Id
    private int id_shiptype;

    @Column
    private int shiptype_min;

    @Column
    private int shiptype_max;

    @Column
    private String ais_type;

    @Column
    private String detailed_ais_type;
    

    public ShipType(int id, int min, int max, String details, String type) {
        this.id_shiptype = id;
        this.shiptype_min = min;
        this.shiptype_max = max;
        this.detailed_ais_type = details;
        this.ais_type = type;
    }


}
