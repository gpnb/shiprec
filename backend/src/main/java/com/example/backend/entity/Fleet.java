package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


import jakarta.persistence.OneToMany;


import java.util.Set;
import java.util.HashSet;

import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "fleet")
public class Fleet {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "fleet_name")
    private String fleetName;

    @Column(name = "user_id")
    private Integer userId;

    // we need orphanRemoval to be able to delete fleets. it also removes the many to many relations of that fleet
    @OneToMany(mappedBy = "fleet", orphanRemoval = true)
    @JsonIgnore
    private Set<FleetHasShips> vessels = new HashSet<>();
}