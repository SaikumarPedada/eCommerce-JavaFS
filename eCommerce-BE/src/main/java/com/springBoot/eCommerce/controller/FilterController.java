package com.springBoot.eCommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.service.FilterService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class FilterController {
	
	@Autowired
	private FilterService filterService;
	
	@GetMapping("/customer/filter")
	public ResponseEntity<List<Product>> getFilterProducts(@RequestParam(value="category") String category){
		
		return ResponseEntity.ok(filterService.getFilterProducts(category));
		
	}
}
