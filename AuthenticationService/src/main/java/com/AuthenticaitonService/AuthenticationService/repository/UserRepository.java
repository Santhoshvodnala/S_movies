package com.AuthenticaitonService.AuthenticationService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AuthenticaitonService.AuthenticationService.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserEmail(String userEmail);

    boolean existsByUserEmail(String email);

}
