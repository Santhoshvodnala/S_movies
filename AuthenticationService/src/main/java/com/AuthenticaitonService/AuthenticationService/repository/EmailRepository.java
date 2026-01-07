package com.AuthenticaitonService.AuthenticationService.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AuthenticaitonService.AuthenticationService.model.EmailOtp;

public interface EmailRepository extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findTopByuserEmailAndUsedFalseOrderByCreatedAtDesc(String userEmail);

    List<EmailOtp> findByuserEmailAndCreatedAtAfter(String userEmail, Instant After);

    boolean existsByuserEmailAndUsedTrue(String userEmail);

    Optional<EmailOtp> findTopByuserEmailOrderByCreatedAtDesc(String userEmail);
}
