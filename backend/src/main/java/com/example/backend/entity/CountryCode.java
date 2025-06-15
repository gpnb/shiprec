package com.example.backend.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name="Countries")
@Getter
@Setter
@NoArgsConstructor
public class CountryCode {
    
    @Id
    private int id;

    @Column
    private String country;

    @OneToMany(fetch=FetchType.LAZY)
    List<Vessel> country_vessels;

    public CountryCode(int id, String country) {
        this.id = id;
        this.country = country;
    }
}
