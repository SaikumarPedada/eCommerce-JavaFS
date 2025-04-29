package com.springBoot.eCommerce.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.springBoot.eCommerce.model.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
	
	public String generateToken(String username, Role role) {
	    return Jwts.builder()
	            .setSubject(username)
	            .claim("roles", List.of(role.name())) 
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
	            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
	            .compact();
	}
	
	public Claims extractClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
	
	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public String extractRole(String token) {
		return extractClaims(token).get("role",String.class);
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails) {
		return extractUsername(token).equals(userDetails.getUsername())& !isTokenExpired(token);
	}
	
	private boolean isTokenExpired(String token) {
		return extractClaims(token).getExpiration().before(new Date());
	}
}
