package com.springBoot.eCommerce.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springBoot.eCommerce.model.Cart;
import com.springBoot.eCommerce.model.CartItem;
import com.springBoot.eCommerce.model.Order;
import com.springBoot.eCommerce.model.OrderItem;
import com.springBoot.eCommerce.model.Product;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.CartItemRepository;
import com.springBoot.eCommerce.repository.CartRepository;
import com.springBoot.eCommerce.repository.OrderItemRepository;
import com.springBoot.eCommerce.repository.OrderRepository;
import com.springBoot.eCommerce.repository.ProductRepository;

@Service
public class BuyService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart getCart(User user) {
        return cartRepository.findByCustomer(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setCustomer(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public void placeCartOrder(User user, String deliveryAddress, String paymentMode) {
        Cart cart = getCart(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("No items to place order");
        }

        Order order = new Order();
        order.setCustomer(user);
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveryAddress(deliveryAddress);
        order.setPaymentMode(paymentMode);
        orderRepository.save(order); // Save order first to generate ID

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Link order object
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItems.add(orderItem);

            cartItemRepository.delete(item); // Remove from cart
        }

        orderItemRepository.saveAll(orderItems);
    }

    @Transactional
    public void placeOrder(User user, Long productId, Integer quantity, String deliveryAddress, String paymentMode) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }

        Order order = new Order();
        order.setCustomer(user);
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveryAddress(deliveryAddress);
        order.setPaymentMode(paymentMode);
        orderRepository.save(order);

        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);

        orderItemRepository.save(orderItem);

        // Optional: Remove product from cart if it existed
        Cart cart = getCart(user);
        Optional<CartItem> cartItemOptional = cartItemRepository.findByCartAndProduct(cart, product);

        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get(); 
            cartItemRepository.delete(cartItem);  
        }
    }
}
