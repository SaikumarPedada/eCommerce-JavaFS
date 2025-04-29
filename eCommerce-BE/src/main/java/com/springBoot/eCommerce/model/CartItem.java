package com.springBoot.eCommerce.model;

import jakarta.persistence.*;

@Entity
@Table(name="cart_item")
public class CartItem {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="product_id")
	private Product product;
	
	private Integer quantity;
	
	@ManyToOne
	@JoinColumn(name="cart_id")
	private Cart cart;

	public CartItem() {
		
	}

	public CartItem(Long id, Product product, Integer quantity, Cart cart) {
		super();
		this.id = id;
		this.product = product;
		this.quantity = quantity;
		this.cart = cart;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	@Override
	public String toString() {
		return "CartItem [id=" + id + ", product=" + product + ", quantity=" + quantity + ", cart=" + cart + "]";
	}
	
}
