// This entity acts as the id (key) for the many to many relation between fleets and vessels.
// since it is a seperate class, it has to be in a seperate file from FleetHasShips.

package com.example.backend.entity;

import jakarta.persistence.Column;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Embeddable;
import java.io.Serializable;

import java.util.Objects;
import lombok.NoArgsConstructor;



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