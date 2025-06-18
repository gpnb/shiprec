package com.example.backend.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class VesselInstance {
    
    @EmbeddedId
    private VesselInstanceId id;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mmsi")
    @MapsId("mmsi")  
    private Vessel mmsi;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status")
    private NavigationalStatus status_id;

    @Column
    private double rate_of_turn;

    @Column
    private double speed_over_ground;

    @Column
    private double course_over_ground;

    @Column
    private double heading;

    @Column
    private double longitude;

    @Column
    private double latitude;

    @Column
    private Date eta;

    @Column
    private String destination;


    @Column
    private double draught;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mothership_mmsi")
    private Vessel mothership_mmsi;

}
