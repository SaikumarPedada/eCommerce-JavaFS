import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddProductModal = ({ show, onHide, token, onProductAdded }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!image) {
      alert("Please upload a product image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.value);
    formData.append("category", form.category.value);
    formData.append("price", form.price.value);
    formData.append("stock", form.stock.value);
    formData.append("description", form.description.value);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post("/api/merchant/addProduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Product added:", response.data);
      onHide();
      setImage(null);
      if (onProductAdded) onProductAdded(); // ✅ trigger parent to refresh
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control name="name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category">
              <option>Electronics</option>
              <option>Fashion</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" name="price" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" name="stock" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" required as="textarea" rows={3} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;