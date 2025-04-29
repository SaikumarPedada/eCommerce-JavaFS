package com.springBoot.eCommerce.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springBoot.eCommerce.model.Order;
import com.springBoot.eCommerce.model.User;


public interface OrderRepository extends JpaRepository<Order, Long>{
	List<Order> findByCustomer(User customer);
}
