package com.springBoot.eCommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springBoot.eCommerce.model.Cart;
import com.springBoot.eCommerce.model.User;

public interface CartRepository extends JpaRepository< Cart, Long>{
	Optional<Cart> findByCustomer(User customer);
}
