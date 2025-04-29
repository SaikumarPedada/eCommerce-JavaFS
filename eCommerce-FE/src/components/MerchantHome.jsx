import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import { useNavigate } from "react-router-dom";

const MerchantHome = ({ showModal, setShowModal }) => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [imageMap, setImageMap] = useState({}); // Map productId => base64 image
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const fetchImageForProduct = async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      setImageMap(prev => ({
        ...prev,
        [productId]: `data:image/png;base64,${base64}`
      }));
    } catch (err) {
      console.error("Image fetch error for product " + productId, err);
    }
  };

  const fetchProducts = () => {
    axios.get("/api/merchant/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const products = Array.isArray(res.data) ? res.data : [];
        console.log("Fetched products:", products); 
        setProducts(products);

        // Fetch images for all products
        products.forEach(product => fetchImageForProduct(product.id));
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append("name", form.name.value);
    formData.append("category", form.category.value);
    formData.append("price", form.price.value);
    formData.append("stock", form.stock.value);
    formData.append("description", form.description.value);
    if (image) formData.append("image", image);

    axios.put(`/api/merchant/update/${editProduct.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      setShowEditModal(false);
      fetchProducts(); // refresh instead of window reload
    }).catch(err => console.error(err));
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const handleDelete = (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axios.delete(`/api/merchant/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== productId));
      })
      .catch(err => console.error(err));
  };

  return (
    <Container className="mt-3">
      <h2>My Products</h2>
      <Row>
        {Array.isArray(products) && products.map(product => (
          <Col md={4} key={product.id} className="mb-4">
            <Card>
              {imageMap[product.id] ? (
                <Card.Img src={imageMap[product.id]} height={200} style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 200, backgroundColor: "#eee" }}>Loading image...</div>
              )}
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Category: {product.category}<br />
                  Price: ₹{product.price}<br />
                  Stock: {product.stock}<br />
                </Card.Text>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(product)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleViewDetails(product.id)}>Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control name="name" defaultValue={editProduct?.name || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" defaultValue={editProduct?.category || ''}>
                <option>Electronics</option>
                <option>Fashion</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" defaultValue={editProduct?.price || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" defaultValue={editProduct?.stock || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" defaultValue={editProduct?.description} required as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="primary">Update</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <AddProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        token={token}
        onProductAdded={fetchProducts}
      />
    </Container>
  );
};

export default MerchantHome;
