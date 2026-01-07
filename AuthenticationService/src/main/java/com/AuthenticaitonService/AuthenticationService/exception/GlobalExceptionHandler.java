package com.AuthenticaitonService.AuthenticationService.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> HandleUserAlreadyException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(Map.of("Message", "User Already Exists Please try with new Email"),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(Map.of("Message", "User not Found with this Email"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InavlidCredentials.class)
    public ResponseEntity<Map<String, String>> handleInavlidOPassword(InavlidCredentials ex) {
        return new ResponseEntity<>(Map.of("Message", "Invalid Credentials"), HttpStatus.valueOf(400));
    }
}
