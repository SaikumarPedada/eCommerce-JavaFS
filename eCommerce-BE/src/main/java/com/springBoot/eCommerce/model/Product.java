package com.springBoot.eCommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name="products")
public class Product {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	private String category;
	private Double price;
	private Integer stock;
	private String description;
	
	@JsonIgnore
	@Lob
	@Column(name="product_image")
	private byte[] productImage;
	
	@JsonIgnore 
	@ManyToOne
	@JoinColumn(name="merchant_id")
	private User merchant;

	public Product() {
		
	}
	
	public Product(Long id, String name, String category, Double price, Integer stock, String description,
			byte[] productImage, User merchant) {
		super();
		this.id = id;
		this.name = name;
		this.category = category;
		this.price = price;
		this.stock = stock;
		this.description = description;
		this.productImage = productImage;
		this.merchant = merchant;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public byte[] getProductImage() {
		return productImage;
	}

	public void setProductImage(byte[] productImage) {
		this.productImage = productImage;
	}

	public User getMerchant() {
		return merchant;
	}

	public void setMerchant(User merchant) {
		this.merchant = merchant;
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", category=" + category + ", price=" + price + ", stock="
				+ stock + ", description=" + description + ", merchant=" + merchant + "]";
	}
	
	
}
