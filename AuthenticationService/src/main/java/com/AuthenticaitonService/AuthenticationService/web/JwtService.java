package com.AuthenticaitonService.AuthenticationService.web;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;
import org.slf4j.Logger;

import javax.crypto.IllegalBlockSizeException;

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
import io.jsonwebtoken.security.WeakKeyException;

@Service
public class JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final Key key;

    private final long ttMillis;

    private final String issuer;

    private final JwtParser jwtParser;

    public JwtService(
            @Value("${app.jwt.secret}") String secretRaw,
            @Value("${app.jwt.access-ttl-seconds:900}") long ttlSecs,
            @Value("${app.jwt.issuer:S-Movies") String issuer) {

        String secert = secretRaw == null ? "" : secretRaw.trim();

        if (secert.isEmpty()) {
            throw new IllegalStateException("app.jwt.secret must be provided and non-empty");
        }

        this.ttMillis = ttlSecs * 100L;
        this.issuer = issuer;

        try {
            byte[] keyBytes = secert.getBytes(StandardCharsets.UTF_8);
            log.info("JwtService initialized - signing key length: {} bytes (masked)", keyBytes.length);
            this.key = Keys.hmacShaKeyFor(keyBytes);

        } catch (WeakKeyException wke) {

            throw new IllegalStateException(
                    "The provided app.jwt.secret is too weak/short for HS256. Provide a 32+ byte secret", wke);
        }

        this.jwtParser = Jwts.parserBuilder()
                .setSigningKey(this.key).setAllowedClockSkewSeconds(60).build();
    }

    public String generateToken(User user) {

        long now = System.currentTimeMillis();

        return Jwts.builder().setIssuer(issuer).setSubject(user.getUserEmail()).claim("userName", user.getUsername())
                .setIssuedAt(new Date(now)).setExpiration(new Date(now + ttMillis))
                .signWith(key, SignatureAlgorithm.HS256).compact();

    }

    public Jws<Claims> parseToken(String token) {

        return jwtParser.parseClaimsJws(token);
    }

    public Optional<Jws<Claims>> tryParseWithLogging(String token) {
        if (token == null || token.isEmpty()) {
            return Optional.empty();
        }
        try {
            return Optional.of(jwtParser.parseClaimsJws(token));
        } catch (JwtException | IllegalArgumentException e) {

            log.warn("JWT parse failed: {} (tokenLen={})", e.getClass().getSimpleName(),
                    token == null ? 0 : token.length());
            log.debug("JWT parse exception:", e);

            return Optional.empty();
        }
    }

    public Claims getClaimsIfValid(String token) {
        return tryParseWithLogging(token).map(Jws::getBody).orElse(null);
    }

    public boolean validate(String token) {
        return tryParseWithLogging(token).isPresent();
    }

    public String extractEmail(String token) {
        return parseToken(token).getBody().getSubject();
    }
}
