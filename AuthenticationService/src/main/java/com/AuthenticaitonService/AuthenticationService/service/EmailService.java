package com.AuthenticaitonService.AuthenticationService.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void SendmailOtp(String to, String otp) {
        SimpleMailMessage ms = new SimpleMailMessage();

        ms.setTo(to);
        ms.setSubject("Your S-movies Verification Code");
        ms.setText("Your Verification code is :" + otp + " "
                + "This Code will expire in few mintues.");

        javaMailSender.send(ms);
    }

}
