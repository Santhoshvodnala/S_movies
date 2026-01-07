package com.AuthenticaitonService.AuthenticationService.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginRequest(@JsonProperty("email") String userEmail, String password) {
}
