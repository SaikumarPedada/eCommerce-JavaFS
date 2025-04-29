package com.springBoot.eCommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springBoot.eCommerce.dto.OrderResponseDTO;
import com.springBoot.eCommerce.model.Order;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.UserRepository;
import com.springBoot.eCommerce.service.OrderService;

@CrossOrigin
@RestController
@RequestMapping("/api/orders")
public class OrderController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private OrderService orderService;
	
	private User getCurrentUser(Authentication authentication) {
		String username=authentication.getName();
		return userRepository.findByUsername(username)
					.orElseThrow(()-> new RuntimeException("User not found"));
	}
	
	@GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrders(Authentication authentication) {
		User user=getCurrentUser(authentication);
        List<OrderResponseDTO> responseDTOs = orderService.getOrderByUser(user);
        return ResponseEntity.ok(responseDTOs);
    }
}
