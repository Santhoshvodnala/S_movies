package com.AuthenticaitonService.AuthenticationService.web;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.AuthenticaitonService.AuthenticationService.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final Key key;
    private final long ttlMillis;
    private final JwtParser parser;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-ttl-seconds:900}") long ttlSeconds) {

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlMillis = ttlSeconds * 1000;

        this.parser = Jwts.parserBuilder()
                .setSigningKey(key)
                .build();
    }

    public String generateToken(User user) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject(user.getUserEmail())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ttlMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Optional<Jws<Claims>> tryParseWithLogging(String token) {
        try {
            return Optional.of(parser.parseClaimsJws(token));
        } catch (JwtException e) {
            log.warn("Invalid JWT token");
            return Optional.empty();
        }
    }
}
