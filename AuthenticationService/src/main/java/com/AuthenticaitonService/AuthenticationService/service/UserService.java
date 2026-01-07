package com.AuthenticaitonService.AuthenticationService.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AuthenticaitonService.AuthenticationService.dtos.LoginRequest;
import com.AuthenticaitonService.AuthenticationService.dtos.TokenResponse;
import com.AuthenticaitonService.AuthenticationService.dtos.UserRequest;
import com.AuthenticaitonService.AuthenticationService.dtos.UserResposne;
import com.AuthenticaitonService.AuthenticationService.exception.InavlidCredentials;
import com.AuthenticaitonService.AuthenticationService.exception.UserAlreadyExistsException;
import com.AuthenticaitonService.AuthenticationService.exception.UserNotFoundException;
import com.AuthenticaitonService.AuthenticationService.model.EmailOtp;
import com.AuthenticaitonService.AuthenticationService.model.User;
import com.AuthenticaitonService.AuthenticationService.repository.EmailRepository;
import com.AuthenticaitonService.AuthenticationService.repository.UserRepository;
import com.AuthenticaitonService.AuthenticationService.web.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserInterface {

    private final JwtService jwtService;

    private final EmailService emailService;

    private final UserRepository userRepository;

    private final EmailRepository emailRepository;

    private final PasswordEncoder passwordEncoder;

    public String sendOtp(String email) {

        if (userRepository.existsByUserEmail(email)) {
            throw new UserAlreadyExistsException("user already exists with this email");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        EmailOtp otpEmail = emailRepository.findTopByuserEmailAndUsedFalseOrderByCreatedAtDesc(email).get();

        if (otpEmail.getUserEmail().isEmpty()) {
            new EmailOtp();
        }

        otpEmail.setUserEmail(email);
        otpEmail.setCode(otp);
        otpEmail.setUsed(false);
        otpEmail.setCreatedAt(Instant.now());
        otpEmail.setExpiresAt(Instant.now().plusSeconds(5 * 60));

        emailRepository.save(otpEmail);

        emailService.SendmailOtp(email, otp);

        return "Otp sent Successfully";

    }

    @Override
    public UserResposne createUser(UserRequest userRequest) {

        // User user = userRepository.findByUserEmail(userRequest.userEmail());

        if (userRepository.existsByUserEmail(userRequest.userEmail())) {
            throw new UserAlreadyExistsException("user already exists with this email");
        }
        User user = new User();
        user.setUsername(userRequest.username());
        user.setUserEmail(userRequest.userEmail());
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        user.setCountryCode(userRequest.countryCode());
        user.setAddress(userRequest.address());
        user.setPhone(userRequest.phone());

        userRepository.save(user);

        return new UserResposne(user.getUsername(), user.getUserEmail(), user.getUserID(),
                user.getCountryCode(),
                user.getAddress(), user.getPhone());
    }

    @Override
    public Boolean ExistEmail(String email) {
        return userRepository.existsByUserEmail(email);
    }

    @Override
    public TokenResponse loginUser(LoginRequest loginRequest) throws InavlidCredentials {

        User requser = userRepository.findByUserEmail(loginRequest.userEmail());

        if (requser == null) {
            throw new UserNotFoundException("user not found with this email");
        }

        if (!passwordEncoder.matches(loginRequest.password(), requser.getPassword())) {

            throw new InavlidCredentials("Password doesnot match");
        }

        String token = jwtService.generateToken(requser);

        return new TokenResponse(token);
    }

}