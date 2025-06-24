package com.example.backend.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Port {

    @Id
    private int wpi;

    @Column
    private String port;
    
    @Column
    private String country;
    
    @Column
    private String size;

    @Column
    private String type;

    @Column
    private double tidal_range;

    @Column
    private double entrance_width;

    @Column
    private double channel_depth;

    @Column
    private double latitude;

    @Column
    private double longitude;

}
