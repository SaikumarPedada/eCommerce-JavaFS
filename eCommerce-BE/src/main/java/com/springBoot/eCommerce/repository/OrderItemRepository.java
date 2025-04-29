package com.springBoot.eCommerce.repository;



import org.springframework.data.jpa.repository.JpaRepository;


import com.springBoot.eCommerce.model.OrderItem;


public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{
	
}
