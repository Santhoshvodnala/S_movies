package com.AuthenticaitonService.AuthenticationService.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserResposne(String userName, String userEmail, Long userID,
        @JsonProperty("countryCode") String countryCode,
        @JsonProperty("phone") String phone,
        @JsonProperty("address") String address) {
}
