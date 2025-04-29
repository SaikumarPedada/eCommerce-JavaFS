package com.springBoot.eCommerce.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="cart")
public class Cart {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="customer_id")
	private User customer;
	
	@OneToMany(mappedBy="cart", cascade=CascadeType.ALL,orphanRemoval=true)
	private List<CartItem> cartItems;

	public Cart() {
		
	}

	public Cart(Long id, User customer, List<CartItem> cartItems) {
		
		this.id = id;
		this.customer = customer;
		this.cartItems = cartItems;
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

	public List<CartItem> getCartItems() {
		return cartItems;
	}

	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}

	@Override
	public String toString() {
		return "Cart [id=" + id + ", customer=" + customer + ", cartItems=" + cartItems + "]";
	}
	
	
	
}
