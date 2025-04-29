package com.springBoot.eCommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.eCommerce.dto.OrderItemResponseDTO;
import com.springBoot.eCommerce.dto.OrderResponseDTO;
import com.springBoot.eCommerce.model.Order;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.OrderRepository;

@Service
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepository;
	
	public List<OrderResponseDTO> getOrderByUser(User user){
		List<Order> orders = orderRepository.findByCustomer(user);

        return orders.stream()
            .map(order -> new OrderResponseDTO(
                order.getId(),
                order.getDeliveryAddress(),
                order.getPaymentMode(),
                order.getOrderDate(),
                order.getOrderItems().stream()
                    .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getProduct().getDescription(),
                        item.getQuantity()
                    ))
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
	}
}
