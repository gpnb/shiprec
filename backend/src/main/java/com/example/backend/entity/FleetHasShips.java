// This entity is the many to many relation between fleets and vessels. It has to be seperate due to the active vessel attribute

package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime; // for creation timestamp

import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;

import java.util.Set;
import java.util.HashSet;
import java.util.List;
import lombok.NoArgsConstructor;
import jakarta.persistence.FetchType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.MapsId;



@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "fleet_has_ships")
public class FleetHasShips {
    @EmbeddedId
    FleetShipKey id;

    @ManyToOne
    @MapsId("fleetId")
    @JoinColumn(name = "fleet_id")
    Fleet fleet;

    @ManyToOne
    @MapsId("vesselId")
    @JoinColumn(name = "vessel_id")
    Vessel vessel;

    @Column(name = "active")
    private Boolean active;

    public FleetHasShips(Fleet fleet, Vessel vessel, Boolean active) {
        this.fleet = fleet;
        this.vessel = vessel;
        this.active = active;
        this.id = new FleetShipKey(fleet.getId(), vessel.getMmsi());
    }
}