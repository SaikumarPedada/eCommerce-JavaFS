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

import com.springBoot.eCommerce.service.SearchService;

@CrossOrigin
@RestController
@RequestMapping("/api/customer/search")
public class SearchController {
	@Autowired
	private SearchService searchService;
	
	@GetMapping
	public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword){
		return ResponseEntity.ok(searchService.searchProducts(keyword));
	}
}
