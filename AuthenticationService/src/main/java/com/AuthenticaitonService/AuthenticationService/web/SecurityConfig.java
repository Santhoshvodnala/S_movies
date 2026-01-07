package com.AuthenticaitonService.AuthenticationService.web;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtService jwtService;

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
                return new JwtAuthenticationFilter(jwtService);
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter)
                        throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth.requestMatchers(
                                                "/api/auth/login",
                                                "/api/auth/register",
                                                "/api/auth/send-otp",
                                                "/api/auth/**",
                                                "/api/auth/verify-otp").permitAll()
                                                // public static resources
                                                .requestMatchers("/public/**", "/static/**", "/favicon.ico").permitAll()
                                                // allow swagger / openapi during dev
                                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                                                // explicitly allow OPTIONS preflight
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                // everything else must be authenticated (this includes /api/auth/me and
                                                // updateProfile)
                                                .anyRequest().authenticated());

                http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();

        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public UrlBasedCorsConfigurationSource corsSource() {
                CorsConfiguration cfg = new CorsConfiguration();

                cfg.setAllowedOriginPatterns(List.of("http://localhost:*", "http://localhost:5173",
                                "https://*.netlify.app"));
                cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE",
                                "OPTIONS"));
                cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept",
                                "X-Requested-With"));
                cfg.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
                cfg.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", cfg);
                return source;
        }

}
