package com.AuthenticaitonService.AuthenticationService.web;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        log.debug("[JwtFilter] Authorization header: {}", authHeader);

        if (!StringUtils.hasText(authHeader) || !authHeader.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        if (!StringUtils.hasText(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<io.jsonwebtoken.Jws<io.jsonwebtoken.Claims>> parsed = jwtService.tryParseWithLogging(token);
        if (parsed.isEmpty()) {
            log.warn("[JwtFilter] token parse failed — skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims = parsed.get().getBody();
        String email = claims.getSubject();
        // String role = claims.get("userName", String.class);

        if (!StringUtils.hasText(email)) {
            log.warn("[JwtFilter] token has no subject/email");
            filterChain.doFilter(request, response);
            return;
        }

        // List<SimpleGrantedAuthority> authorities = (role != null && !role.isBlank())
        // ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
        // : List.of();

        // UsernamePasswordAuthenticationToken auth = new
        // UsernamePasswordAuthenticationToken(email, null, authorities);

        // attach claims as details if needed later
        // auth.setDetails(claims);

        // SecurityContextHolder.getContext().setAuthentication(auth);
        // log.debug("[JwtFilter] Authentication set for principal: {}", email);

        filterChain.doFilter(request, response);

    }

}
