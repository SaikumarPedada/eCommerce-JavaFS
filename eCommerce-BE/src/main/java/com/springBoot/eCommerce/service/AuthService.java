package com.springBoot.eCommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.UserRepository;
import com.springBoot.eCommerce.security.JwtUtil;
import com.springBoot.eCommerce.security.dto.AuthRequest;
import com.springBoot.eCommerce.security.dto.AuthResponse;
import com.springBoot.eCommerce.security.dto.RegitserRequest;

@Service
public class AuthService {
	
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtUtil jwtUtil;

	public ResponseEntity<String> register(RegitserRequest request) {
		if(userRepository.existsByUsername(request.getUsername())) {
			return ResponseEntity.badRequest().body("Username already exists");
		}
		
		User user=new User();
		user.setUsername(request.getUsername());
		user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
		user.setRole(request.getRole());
		
		userRepository.save(user);
		
		return ResponseEntity.ok("User registered successfully");
	}

	public ResponseEntity<AuthResponse> login(AuthRequest request) {
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
		
		User user=userRepository.findByUsername(request.getUsername())
								.orElseThrow(()-> new RuntimeException("User not found"));
		String token=jwtUtil.generateToken(user.getUsername(),user.getRole());
		
		return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
	}

}
