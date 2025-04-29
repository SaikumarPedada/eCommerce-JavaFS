package com.springBoot.eCommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springBoot.eCommerce.security.dto.AuthRequest;
import com.springBoot.eCommerce.security.dto.AuthResponse;
import com.springBoot.eCommerce.security.dto.RegitserRequest;
import com.springBoot.eCommerce.service.AuthService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api/auth")

public class AuthController {
	
	@Autowired
	private AuthService authService;
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody RegitserRequest request){
		return authService.register(request);
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request){
		return authService.login(request);
	}
}
