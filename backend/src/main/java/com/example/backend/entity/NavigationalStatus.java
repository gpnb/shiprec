package com.example.backend.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class NavigationalStatus {

    @Id
    private int code;

    @Column
    private String status;



    @OneToMany(fetch=FetchType.LAZY)
    List<VesselInstance> vessel_instances;

    public NavigationalStatus(int code,String status) {
        this.code = code;
        this.status = status;
    }
}
