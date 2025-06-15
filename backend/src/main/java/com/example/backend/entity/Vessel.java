package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
public class Vessel{

    @Id
    private int mmsi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id") 
    private CountryCode country;

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



    

}
