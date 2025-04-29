package com.springBoot.eCommerce.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springBoot.eCommerce.dto.CartItemResponseDTO;
import com.springBoot.eCommerce.model.Cart;
import com.springBoot.eCommerce.model.CartItem;
import com.springBoot.eCommerce.model.Order;
import com.springBoot.eCommerce.model.OrderItem;
import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.CartItemRepository;
import com.springBoot.eCommerce.repository.CartRepository;
import com.springBoot.eCommerce.repository.OrderItemRepository;
import com.springBoot.eCommerce.repository.OrderRepository;
import com.springBoot.eCommerce.repository.ProductRepository;

@Service
public class CartService {
	
	@Autowired
	private CartItemRepository cartItemRepository;
	
	@Autowired
	private CartRepository cartRepository;
	
	@Autowired
	private ProductRepository productRepository;
	
	public Cart getCart(User user) {
		return cartRepository.findByCustomer(user)
				.orElseGet(()->{
					Cart newCart=new Cart();
					newCart.setCustomer(user);
					newCart.setCartItems(new ArrayList<>());
					return cartRepository.save(newCart);
				});
	}
	
	public List<CartItemResponseDTO> getCartItems(User user) {
		List<CartItem> cartItems = cartItemRepository.findByCart(getCart(user));

	    return cartItems.stream()
	            .map(item -> new CartItemResponseDTO(
	                    item.getId(),
	                    item.getProduct().getId(),
	                    item.getProduct().getName(),
	                    item.getProduct().getCategory(),
	                    item.getProduct().getPrice(),
	                    item.getProduct().getDescription(),
	                    item.getQuantity()
	            ))
	            .collect(Collectors.toList());
	}

	public void addToCart(User user, Long productId) {
		Cart cart=getCart(user);
		Product product=productRepository.findById(productId)
								.orElseThrow(()-> new RuntimeException("product not found"));
		
		Optional<CartItem> existingItem=cart.getCartItems().stream()
				.filter(item-> item.getProduct().getId().equals(productId))
				.findFirst();
		
		if(existingItem.isPresent()) {
			CartItem cartItem=existingItem.get();
			cartItem.setQuantity(cartItem.getQuantity()+1);
			cartItemRepository.save(cartItem);
		}else {
			CartItem cartItem=new CartItem(null, product, 1, cart);
			cart.getCartItems().add(cartItem);
			cartRepository.save(cart);
		}
	}
	
	@Transactional
	public void removeFromCart(User user, Long productId) {
		Cart cart=getCart(user);
		Product product=new Product();
		product.setId(productId);
		cartItemRepository.deleteByCartAndProduct(cart, product);		
	}

}
