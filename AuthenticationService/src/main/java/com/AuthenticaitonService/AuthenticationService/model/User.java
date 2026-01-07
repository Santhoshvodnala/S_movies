package com.AuthenticaitonService.AuthenticationService.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    private String username;

    @Column(name = "useremail", nullable = false, unique = true, length = 191)
    private String userEmail;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "country_code", length = 10)
    @Pattern(regexp = "^\\+?[0-9]{1,4}$", message = "Invalid country code")
    private String countryCode;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "address", nullable = true, length = 200)
    private String address;

}
