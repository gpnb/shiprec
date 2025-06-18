package com.example.backend.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class VesselInstanceId implements Serializable{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mmsi")
    private Vessel mmsi;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    // Default constructor
    public VesselInstanceId() {}

    public VesselInstanceId(Vessel mmsi, Date timestamp) {
        this.mmsi = mmsi;
        this.timestamp = timestamp;
    }

    // equals() and hashCode() are mandatory
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VesselInstanceId)) return false;
        VesselInstanceId that = (VesselInstanceId) o;
        return Objects.equals(mmsi, that.mmsi) &&
            Objects.equals(timestamp, that.timestamp); // Exact match
    }

    @Override
    public int hashCode() {
        return Objects.hash(mmsi, timestamp);
    }
}
