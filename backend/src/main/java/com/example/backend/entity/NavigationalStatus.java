package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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

    public NavigationalStatus(int code,String status) {
        this.code = code;
        this.status = status;
    }
}
