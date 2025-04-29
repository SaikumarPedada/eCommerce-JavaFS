package com.springBoot.eCommerce.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.service.ProductService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
	@PostMapping("/merchant/addProduct")
	@PreAuthorize("hasRole('MERCHANT')")
	public ResponseEntity<Product> addProduct(
					@RequestParam("name") String name,
					@RequestParam("category") String category,
					@RequestParam("price") Double price,
					@RequestParam("stock") Integer stock,
					@RequestParam("description") String description,
					@RequestParam("image") MultipartFile image,
					Authentication authentication) throws IOException{
		String username=authentication.getName();
		Product product=productService.addProduct(name, category, price, stock,description, image, username);
		return new ResponseEntity<>(product, HttpStatus.CREATED);
	}
	
	@GetMapping("/merchant/products")
	@PreAuthorize("hasRole('MERCHANT')")
	public ResponseEntity<List<Product>> getProductsByMerchant(Authentication authentication){
		String username=authentication.getName();
		return ResponseEntity.ok(productService.getProductsByMerchant(username));
	}
	
	@GetMapping("/customer/allProducts")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<List<Product>> getAllProducts(Authentication authentication){
		return ResponseEntity.ok(productService.getAllProducts());
	}
	
	@GetMapping("/products/{id}")
	@PreAuthorize("hasAnyRole('CUSTOMER','MERCHANT')")
	public ResponseEntity<Product> getProductById(@PathVariable Long id){
		Product product= productService.getProductById(id);
		return ResponseEntity.ok(product);
	}
	
	@GetMapping("/products/{id}/image")
	@PreAuthorize("hasAnyRole('CUSTOMER','MERCHANT')")
	public ResponseEntity<byte[]> getProductImage(@PathVariable Long id){
		byte[] image=productService.getProductImageById(id);
		HttpHeaders headers= new HttpHeaders();
		headers.setContentType(MediaType.IMAGE_JPEG);
		return new ResponseEntity<>(image, headers, HttpStatus.OK);
	}
	
	@PutMapping("/merchant/update/{id}")
	@PreAuthorize("hasRole('MERCHANT')")
	public ResponseEntity<Product> updateProduct(
			@PathVariable Long id,
			@RequestParam("name") String name,
			@RequestParam("category") String category,
			@RequestParam("price") Double price,
			@RequestParam("stock") Integer stock,
			@RequestParam("description") String description,
			@RequestParam(value="image", required=false) MultipartFile image,
			Authentication authentication) throws IOException{
		String username=authentication.getName();
		Product updated=productService.updateProduct(id, name, category, price, stock, description, image, username);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/merchant/delete/{id}")
	@PreAuthorize("hasRole('MERCHANT')")
	public ResponseEntity<String> deleteProduct(@PathVariable Long id, Authentication authentication){
		String username=authentication.getName();
		productService.deletProductById(id,username);
		return ResponseEntity.ok("Product deleted Successfully");
	}
}
