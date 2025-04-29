package com.springBoot.eCommerce.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="orders")
public class Order {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="customer_id")
	private User customer;
	
	@OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true)
	private List<OrderItem> orderItems;
	
	private LocalDateTime orderDate;
	
	@Column(nullable=false)
	private String deliveryAddress;
	
	@Column(nullable=false)
	private String paymentMode;
	
	public Order() {
		
	}

	public Order(Long id, User customer, List<OrderItem> orderItems, LocalDateTime orderDate, String deliveryAddress,
			String paymentMode) {
		super();
		this.id = id;
		this.customer = customer;
		this.orderItems = orderItems;
		this.orderDate = orderDate;
		this.deliveryAddress = deliveryAddress;
		this.paymentMode = paymentMode;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}
	
	public List<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
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

	@Override
	public String toString() {
		return "Order [id=" + id + ", customer=" + customer + ", orderItems=" + orderItems + ", orderDate=" + orderDate
				+ ", deliveryAddress=" + deliveryAddress + ", paymentMode=" + paymentMode + "]";
	}

}
