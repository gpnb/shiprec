package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AreaAlreadyExistsException extends RuntimeException {
    public AreaAlreadyExistsException() {
        super("Area with that name already exists for this user");
    }
}