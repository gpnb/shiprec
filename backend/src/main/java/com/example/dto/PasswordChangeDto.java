// Dto created specifically for a password change request in Settings

package com.example.dto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PasswordChangeDto {

    private String currentPassword;

    private String newPassword;

    private String confirmPassword;
}
