package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "area")
@Getter
@Setter
@NoArgsConstructor
public class Area {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // owner of this area
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name="name", nullable=false, unique=true)
    private String name;

    @Column(name = "southwest_lat", nullable = false)
    private Double southWestLat;

    @Column(name = "southwest_lng", nullable = false)
    private Double southWestLng;

    @Column(name = "northeast_lat", nullable = false)
    private Double northEastLat;

    @Column(name = "northeast_lng", nullable = false)
    private Double northEastLng;

    @Column(name = "creation_timestamp", updatable = false)
    private LocalDateTime creationTimestamp;

    @PrePersist
    protected void onCreate() {
        this.creationTimestamp = LocalDateTime.now();
    }
}