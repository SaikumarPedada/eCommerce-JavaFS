package com.springBoot.eCommerce.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.UserRepository;
import com.springBoot.eCommerce.service.BuyService;

@CrossOrigin
@RestController
@RequestMapping("/api/placeOrder")
public class BuyController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BuyService buyService;
	
	private User getCurrentUser(Authentication authentication) {
		String username=authentication.getName();
		return userRepository.findByUsername(username)
							.orElseThrow(()-> new RuntimeException("User not found"));
		
	}
	
	@PostMapping("/cartOrder")
	public  ResponseEntity<String> placeCartOrder(Authentication authentication,
											@RequestBody Map<String, Object> body){
		User user=getCurrentUser(authentication);
		String deliveryAddress=body.get("deliveryAddress").toString();
		String paymentMode=body.get("paymentMode").toString();
		buyService.placeCartOrder(user,deliveryAddress, paymentMode);
		return ResponseEntity.ok("order placed successfully");
	}
	@PostMapping("/productOrder")
	public ResponseEntity<String> PlaceOrder(Authentication authentication,
										@RequestBody Map<String, Object> body){
		User user=getCurrentUser(authentication);
		Long productId=Long.valueOf(body.get("productId").toString());
		Integer quantity=Integer.parseInt(body.getOrDefault("quantity", 1).toString());
		String deliveyAddress=body.get("deliveryAddress").toString();
		String paymentMode=body.get("paymentMode").toString();
		buyService.placeOrder(user,productId,quantity,deliveyAddress, paymentMode);
		return ResponseEntity.ok("order placed sucessfully");
	}

}
