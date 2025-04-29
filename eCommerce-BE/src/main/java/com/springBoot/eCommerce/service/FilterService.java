package com.springBoot.eCommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.repository.ProductRepository;

@Service
public class FilterService {
	
	@Autowired
	private ProductRepository productRepository;
	
	public List<Product> getFilterProducts(String category) {
		return productRepository.findByCategoryIgnoreCase(category);
	}
}
