package com.springBoot.eCommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.model.User;

public interface ProductRepository extends JpaRepository<Product, Long> {
	@Query("SELECT p FROM Product p WHERE p.merchant.username = :username")
	List<Product> findAllByMerchantUsername(@Param("username") String username);
	List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String Category);
	List<Product> findByCategoryIgnoreCase(String category);

}
