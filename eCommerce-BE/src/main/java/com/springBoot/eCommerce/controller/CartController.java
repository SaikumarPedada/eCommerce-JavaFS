package com.springBoot.eCommerce.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.springBoot.eCommerce.dto.CartItemResponseDTO;
import com.springBoot.eCommerce.model.CartItem;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.UserRepository;
import com.springBoot.eCommerce.service.CartService;

@CrossOrigin
@RestController
@RequestMapping("/api/cart")
public class CartController {
	
	@Autowired
	private  CartService cartService;
	
	@Autowired
	private UserRepository userRepository;
	
	private User getCurrentUser(Authentication authentication) {
		String username=authentication.getName();
		return userRepository.findByUsername(username)
							.orElseThrow(()-> new RuntimeException("User not found"));
		
	}
	
	@GetMapping
	public ResponseEntity<List<CartItemResponseDTO>> getCartItems(Authentication authentication) {
	    User user = getCurrentUser(authentication);
	    List<CartItemResponseDTO> responseDTOs = cartService.getCartItems(user);
	    return ResponseEntity.ok(responseDTOs);
	}
	
	@PostMapping("/addToCart")
	public ResponseEntity<String> addToCart(Authentication authentication,
											@RequestBody Map<String, Long> body){
		User user=getCurrentUser(authentication);
		Long productId=body.get("productId");
		cartService.addToCart(user, productId);
		return ResponseEntity.ok("Added to cart");
	}
	
	@DeleteMapping("/removeFromCart/{productId}")
	public ResponseEntity <String> removeFromCart(Authentication authentication, @PathVariable Long productId){
		User user=getCurrentUser(authentication);
		cartService.removeFromCart(user, productId);
		return ResponseEntity.ok("removed from cart");
	}
	
}
