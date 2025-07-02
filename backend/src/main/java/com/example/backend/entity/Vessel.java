package com.example.backend.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import java.util.Set;
import java.util.HashSet;

@Entity
public class Vessel {

    @Id
    private int mmsi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "country_id")
    private CountryCode country;


    @OneToMany(fetch=FetchType.LAZY)
    @JsonIgnore
    List<VesselInstance> vessel_instances;

    @OneToMany(fetch=FetchType.LAZY)
    @JsonIgnore
    List<VesselInstance> child_vessels;

    @OneToMany(mappedBy = "vessel", orphanRemoval = true)
    @JsonIgnore
    private Set<FleetHasShips> fleets = new HashSet<>();

    @Column
    private int imonumber;

    @Column
    private String name;

    @Column
    private String callsign;

    @Column
    private int shiptype_code;

    @Column
    private String shiptype;

    @Column
    private int to_bow;

    @Column
    private int toport;

    @Column
    private int to_starboard;

    @Column
    private int to_stern;


    public Vessel() {
        // no-args constructor
    }

    public Vessel(int mmsi, int imonumber, String callsign, String shipname, int shiptype, int to_bow, int to_stern, int to_starboard, int toport) {
        this.mmsi = mmsi;
        this.imonumber = imonumber;
        this.callsign = callsign;
        this.name = shipname;
        this.shiptype_code = shiptype;
        this.to_bow = to_bow;
        this.to_stern = to_stern;
        this.to_starboard = to_starboard;
        this.toport = toport;
    }

    public int getMmsi() {
        return mmsi;
    }

    public void setMmsi(int mmsi) {
        this.mmsi = mmsi;
    }

    public CountryCode getCountry() {
        return country;
    }

    public void setCountry(CountryCode country) {
        this.country = country;
    }

    public int getImonumber() {
        return imonumber;
    }

    public void setImonumber(int imonumber) {
        this.imonumber = imonumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCallsign() {
        return callsign;
    }

    public void setCallsign(String callsign) {
        this.callsign = callsign;
    }

    public int getShiptype_code() {
        return shiptype_code;
    }

    public void setShiptype_code(int shiptype_code) {
        this.shiptype_code = shiptype_code;
    }

    public String getShiptype() {
        return shiptype;
    }

    public void setShiptype(String shiptype) {
        this.shiptype = shiptype;
    }

    public int getTo_bow() {
        return to_bow;
    }

    public void setTo_bow(int to_bow) {
        this.to_bow = to_bow;
    }

    public int getToport() {
        return toport;
    }

    public void setToport(int toport) {
        this.toport = toport;
    }

    public int getTo_starboard() {
        return to_starboard;
    }

    public void setTo_starboard(int to_starboard) {
        this.to_starboard = to_starboard;
    }

    public int getTo_stern() {
        return to_stern;
    }

    public void setTo_stern(int to_stern) {
        this.to_stern = to_stern;
    }

    public Set<FleetHasShips> getFleets() {
        return fleets;
    }
}

