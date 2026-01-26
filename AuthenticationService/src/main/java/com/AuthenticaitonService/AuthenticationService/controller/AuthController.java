package com.AuthenticaitonService.AuthenticationService.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AuthenticaitonService.AuthenticationService.dtos.LoginRequest;
import com.AuthenticaitonService.AuthenticationService.dtos.TokenResponse;
import com.AuthenticaitonService.AuthenticationService.dtos.UserRequest;

import com.AuthenticaitonService.AuthenticationService.exception.InavlidCredentials;
import com.AuthenticaitonService.AuthenticationService.model.User;
import com.AuthenticaitonService.AuthenticationService.service.FirebaseAuthService;
import com.AuthenticaitonService.AuthenticationService.service.OtpService;
import com.AuthenticaitonService.AuthenticationService.service.UserService;
import com.AuthenticaitonService.AuthenticationService.web.JwtService;
import com.google.firebase.auth.FirebaseToken;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtpRequest(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        Boolean IsVerified = userService.ExistEmail(email);

        if (IsVerified) {
            return ResponseEntity.status(409).body("Email Already Exists");
        }

        return ResponseEntity.ok(otpService.requestOtp(email));

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        String otp = req.get("otp");

        System.out.println(email + " " + otp);

        boolean IsVerified = otpService.verify(email, otp);

        if (!IsVerified) {
            return ResponseEntity.status(400).body("Invalid or Expired");
        }

        return ResponseEntity.ok("Otp Verification SuccessFull");
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest userRequest) {

        if (userService.ExistEmail(userRequest.userEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email Already Exists");
        }

        if (!otpService.isEmailVerified(userRequest.userEmail())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("OTP not verified");
        }

        return ResponseEntity.ok(userService.createUser(userRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest)
            throws InavlidCredentials {

        System.out.println("user : " + loginRequest.userEmail());
        return ResponseEntity.ok(userService.loginUser(loginRequest));

    }

    @GetMapping("/me")
    public ResponseEntity<?> fetchUser(Authentication authentication,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            String userEmail = (String) authentication.getPrincipal();

            return ResponseEntity.ok(userService.fetchUser(userEmail));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("Message", "Server Error"));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) throws Exception {

        String idToken = body.get("idToken");

        FirebaseToken decode = firebaseAuthService.verifyFirebaseToken(idToken);

        String email = decode.getEmail();
        String firebaseUid = decode.getUid();
        String name = (String) decode.getClaims().get("name");

        User user = userService.findByuserEmail(email);

        if (user == null) {
            user = userService.CreateGoogleUser(email, firebaseUid, name);
        } else {
            user = userService.linkFireBaseUidMissing(user, firebaseUid);
        }

        String jwt = jwtService.generateToken(user);

        boolean profileCompleted = user.getUsername() != null && !user.getUsername().isEmpty();

        return ResponseEntity.ok(Map.of("accessToken", jwt, "profileCompleted", profileCompleted, "User", user));

    }

}

@RestController
class Test {
    @GetMapping()
    public String test() {
        return "Test";
    }
}