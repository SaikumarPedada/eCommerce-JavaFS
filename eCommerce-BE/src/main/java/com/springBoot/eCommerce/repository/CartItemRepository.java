package com.springBoot.eCommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springBoot.eCommerce.model.Cart;
import com.springBoot.eCommerce.model.CartItem;
import com.springBoot.eCommerce.model.Product;


public interface CartItemRepository extends JpaRepository<CartItem, Long>{
	List<CartItem> findByCart(Cart cart);
	Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
	void deleteByCartAndProduct(Cart cart,Product product);
}
