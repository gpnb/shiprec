// Dto created specifically for an email change request in Settings

package com.example.dto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EmailChangeDto {

    private String email;

    private String password;
}
