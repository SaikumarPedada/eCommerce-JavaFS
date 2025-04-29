package com.springBoot.eCommerce.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String username;
	private String password;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@OneToMany(mappedBy="merchant", cascade=CascadeType.ALL, orphanRemoval=true)
	private List<Product> products;
	
	@OneToMany(mappedBy="customer", cascade=CascadeType.ALL, orphanRemoval=true)
	private List<Order> orders;
	
	@OneToMany(mappedBy="customer", cascade=CascadeType.ALL, orphanRemoval=true)
	private List<Cart> cart;
	
	
	public User() {
		
	}

	public User(Long id, String username, String password, Role role, List<Product> products, List<Order> orders,
			List<Cart> cart) {
		
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.products = products;
		this.orders = orders;
		this.cart = cart;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public List<Cart> getCart() {
		return cart;
	}

	public void setCart(List<Cart> cart) {
		this.cart = cart;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", password=" + password + ", role=" + role + ", products="
				+ products + ", orders=" + orders + ", cart=" + cart + "]";
	}
	
	

}
