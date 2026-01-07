package com.AuthenticaitonService.AuthenticationService.service;

import com.AuthenticaitonService.AuthenticationService.dtos.LoginRequest;
import com.AuthenticaitonService.AuthenticationService.dtos.TokenResponse;
import com.AuthenticaitonService.AuthenticationService.dtos.UserRequest;
import com.AuthenticaitonService.AuthenticationService.dtos.UserResposne;
import com.AuthenticaitonService.AuthenticationService.exception.InavlidCredentials;
import com.AuthenticaitonService.AuthenticationService.model.User;

public interface UserInterface {

    UserResposne createUser(UserRequest userRequest);

    Boolean ExistEmail(String email);

    TokenResponse loginUser(LoginRequest loginRequest) throws InavlidCredentials;

}
