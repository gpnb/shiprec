package com.example.backend.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class VesselInstance {
    
    @Id
    private Date timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mmsi")
    private Vessel mmsi;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status")
    private NavigationalStatus status_id;

    // @Column
    // private 


}
