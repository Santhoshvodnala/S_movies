package com.AuthenticaitonService.AuthenticationService.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequest(String userName, String userEmail, String password,
        // FULL NAME
        @NotBlank(message = "Full name is required") @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,99}$", message = "Full name must be 2-100 characters and contain only letters, spaces, .-'") String fullName,

        // ADDRESS is optional, so no @NotBlank
        @Size(max = 200, message = "Address cannot exceed 200 characters") String address,

        // COUNTRY CODE
        @NotBlank(message = "Country code is required") @Pattern(regexp = "^\\+?[0-9]{1,4}$", message = "Invalid country code") String countryCode,

        // PHONE NUMBER
        @NotBlank(message = "Phone number is required") @Pattern(regexp = "^[0-9]{7,15}$", message = "Phone number must be 7–15 digits") String phone

) {
}