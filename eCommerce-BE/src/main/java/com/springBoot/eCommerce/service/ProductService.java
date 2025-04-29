package com.springBoot.eCommerce.service;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.ProductRepository;
import com.springBoot.eCommerce.repository.UserRepository;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Transactional
	public Product addProduct(String name, String category, Double price, Integer stock, String description,
			MultipartFile image, String username) throws IOException{
		
		User merchant=userRepository.findByUsername(username)
									.orElseThrow(()->new UsernameNotFoundException("Merchant not found"));
		Product product =new Product();
		product.setName(name);
		product.setCategory(category);
		product.setPrice(price);
		product.setStock(stock);
		product.setDescription(description);
		product.setMerchant(merchant);
		product.setProductImage(image.getBytes());
		
		return productRepository.save(product);
	}

	public List<Product> getProductsByMerchant(String username) {
		User merchant=userRepository.findByUsername(username)
									.orElseThrow(()->new UsernameNotFoundException("Merchant not Found"));
		return productRepository.findAllByMerchantUsername(username);
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public byte[] getProductImageById(Long id) {
		return productRepository.findById(id)
								.map(Product::getProductImage)
								.orElseThrow(()->new NoSuchElementException("Product Image Not Found"));
	}
	
	@Transactional
	public Product updateProduct(Long id, String name, String category, Double price, Integer stock, String description,
			MultipartFile image, String username) throws IOException {
		
		Product existing=productRepository.findById(id)
								.orElseThrow(()->new NoSuchElementException("Product not found"));
		if(!existing.getMerchant().getUsername().equals(username)) {
			throw new AccessDeniedException("You did not own this product");
			
		}
		
		existing.setName(name);
		existing.setCategory(category);
		existing.setPrice(price);
		existing.setStock(stock);
		existing.setDescription(description);
		
		if(image!=null && !image.isEmpty())
			existing.setProductImage(image.getBytes());
		
		return productRepository.save(existing);
	}
	@Transactional
	public void deletProductById(Long id, String username) {
		Product product=productRepository.findById(id)
								.orElseThrow(()-> new NoSuchElementException("Product Not Found"));
		if(!product.getMerchant().getUsername().equals(username)) {
			throw new AccessDeniedException("You do not permitted to delete this product");
			
		}
		
		productRepository.delete(product);
		
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id)
					.orElseThrow(()-> new NoSuchElementException("Product Not Found"));
	}

}
