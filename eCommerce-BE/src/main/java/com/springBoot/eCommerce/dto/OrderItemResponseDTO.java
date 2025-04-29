package com.springBoot.eCommerce.dto;

public class OrderItemResponseDTO {
	
	 	private Long productId;
	    private String productName;
	    private Double price;
	    private String description;
	    private int quantity;

	    public OrderItemResponseDTO() {}

	    public OrderItemResponseDTO(Long productId, String productName, Double price, String description, int quantity) {
	        this.productId = productId;
	        this.productName = productName;
	        this.price = price;
	        this.description = description;
	        this.quantity = quantity;
	    }

		public Long getProductId() {
			return productId;
		}

		public void setProductId(Long productId) {
			this.productId = productId;
		}

		public String getProductName() {
			return productName;
		}

		public void setProductName(String productName) {
			this.productName = productName;
		}

		public Double getPrice() {
			return price;
		}

		public void setPrice(Double price) {
			this.price = price;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public int getQuantity() {
			return quantity;
		}

		public void setQuantity(int quantity) {
			this.quantity = quantity;
		}
	    
}
