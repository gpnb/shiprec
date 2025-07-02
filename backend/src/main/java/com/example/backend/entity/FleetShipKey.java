// This entity acts as the id (key) for the many to many relation between fleets and vessels.
// since it is a seperate class, it has to be in a seperate file from FleetHasShips.

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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import lombok.NoArgsConstructor;
import jakarta.persistence.FetchType;



@Embeddable 
@Setter
@Getter
@NoArgsConstructor
public class FleetShipKey implements Serializable {
    @Column(name = "fleet_id")
    int fleetId;

    @Column(name = "vessel_id")
    int vesselId;

    public FleetShipKey(int fid, int vid) {
        this.fleetId = fid;
        this.vesselId = vid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FleetShipKey)) return false;
        FleetShipKey comp = (FleetShipKey) o;
        return Objects.equals(fleetId, comp.fleetId) && Objects.equals(vesselId, comp.vesselId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fleetId, vesselId);
    }
}