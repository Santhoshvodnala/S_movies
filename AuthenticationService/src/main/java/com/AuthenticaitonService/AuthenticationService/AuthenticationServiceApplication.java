package com.AuthenticaitonService.AuthenticationService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class AuthenticationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthenticationServiceApplication.class, args);
	}

}

@Component
class EnvCheck {

	@Value("${DB_URL:NOT_FOUND}")
	private String dbUrl;

	@PostConstruct
	public void printEnv() {
		System.out.println("✅ DB_URL from env = " + dbUrl);
	}
}
