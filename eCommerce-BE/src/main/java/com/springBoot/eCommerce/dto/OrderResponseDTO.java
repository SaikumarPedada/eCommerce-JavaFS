package com.springBoot.eCommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
	private Long id;
    private String deliveryAddress;
    private String paymentMode;
    private LocalDateTime orderDate;
    private List<OrderItemResponseDTO> orderItems;

    public OrderResponseDTO() {}

    public OrderResponseDTO(Long id, String deliveryAddress, String paymentMode, LocalDateTime orderDate, List<OrderItemResponseDTO> orderItems) {
        this.id = id;
        this.deliveryAddress = deliveryAddress;
        this.paymentMode = paymentMode;
        this.orderDate = orderDate;
        this.orderItems = orderItems;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public String getPaymentMode() {
		return paymentMode;
	}

	public void setPaymentMode(String paymentMode) {
		this.paymentMode = paymentMode;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}

	public List<OrderItemResponseDTO> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItemResponseDTO> orderItems) {
		this.orderItems = orderItems;
	}
    
}
