package com.AuthenticaitonService.AuthenticationService.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.AuthenticaitonService.AuthenticationService.model.EmailOtp;
import com.AuthenticaitonService.AuthenticationService.repository.EmailRepository;
import com.AuthenticaitonService.AuthenticationService.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailRepository emailRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Value("${app.otp.expire-minutes:5}")
    private int otpExpiremintues;

    @Value("${app.otp.length:6}")
    private int otpLength;

    @Value("${app.otp.max.send-per-hour:5}")
    private int maxSendperhour;

    public String GenerateCode() {
        int min = (int) Math.pow(10, otpLength - 1);
        int max = (int) Math.pow(10, otpLength) - 1;
        return String.valueOf(new Random().nextInt(max - min + 1) + min);
    }

    public String requestOtp(String email) {

        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        var recent = emailRepository.findByuserEmailAndCreatedAtAfter(email, oneHourAgo);

        if (recent.size() >= maxSendperhour) {
            throw new RuntimeException("Too many OTP requests. Try after 1 hour");
        }

        String code = GenerateCode();

        EmailOtp otp = EmailOtp.builder()
                .userEmail(email)
                .code(code)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plus(otpExpiremintues, ChronoUnit.MINUTES))
                .used(false)
                .attempts(0)
                .build();

        emailRepository.save(otp);

        emailService.SendmailOtp(email, code);

        return "OTP sent successfully";
    }

    public boolean verify(String email, String code) {

        Optional<EmailOtp> opt = emailRepository.findTopByuserEmailAndUsedFalseOrderByCreatedAtDesc(email);

        if (opt.isEmpty())
            return false;

        EmailOtp otp = opt.get();

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            // otp.setUsed(true);
            // emailRepository.save(otp);
            return false;
        }

        if (!otp.getCode().equals(code)) {
            otp.setAttempts(otp.getAttempts() + 1);
            emailRepository.save(otp);
            return false;
        }

        otp.setUsed(true);
        emailRepository.save(otp);
        return true;
    }

    public boolean isEmailVerified(String email) {
        Boolean map = emailRepository.existsByuserEmailAndUsedTrue(email);
        System.out.println(map);

        return map;
    }
}
