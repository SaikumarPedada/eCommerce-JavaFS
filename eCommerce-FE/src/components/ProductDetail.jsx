import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Modal, Form } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProduct(res.data))
    .catch(err => console.error("Error fetching product:", err));

    axios.get(`/api/products/${id}/image`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer"
    })
    .then(res => {
      const base64 = btoa(
        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      setImageSrc(`data:image/png;base64,${base64}`);
    })
    .catch(err => console.error("Image fetch error:", err));
  }, [id, token]);

  if (!product) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading product...</p>
      </Container>
    );
  }
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      await axios.delete(`/api/merchant/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product deleted successfully.");
      navigate("/merchant"); // go back to merchant home
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete the product.");
    }
  };
  
  const handleAddToCart = (productId) => {
    axios.post('/api/cart/addToCart', { productId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => alert('Product added to cart!'))
    .catch(err => console.error('Failed to add to cart:', err));
  };

  const handleBuyNowClick = (productId) => {
    setSelectedProductId(productId);
    setQuantity(1);
    setShowModal(true);
  };

  const handleBuyNow = () => {
    if (!address) {
      alert("Please enter delivery address.");
      return;
    }

    axios.post('/api/placeOrder/productOrder', {
      productId: selectedProductId,
      quantity: quantity,
      deliveryAddress: address,
      paymentMode: "Cash On Delivery"
    }, { headers: { Authorization: `Bearer ${token}` } })
    .then(() => {
      alert('Order placed successfully!');
      setShowModal(false);
      setAddress('');
      setQuantity(1);
    })
    .catch(err => console.error('Failed to place order:', err));
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg">
        <Row>
          <Col md={6}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            ) : (
              <div style={{ height: 400, backgroundColor: "#eee" }}>Loading image...</div>
            )}
          </Col>
          <Col md={6}>
            <h2>{product.name}</h2>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Description:</strong> {product.description || "No description available."}</p>
            {/* Optional merchant name */}
            {/* <p><strong>Merchant:</strong> {product.merchantName}</p> */}

            <div className="mt-4">
              {role === "CUSTOMER" && (
                <>
                  <Button variant="success" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                  <Button variant="warning" onClick={() => handleBuyNowClick(product.id)}>Buy Now</Button>
                </>
              )}
              {role === "MERCHANT" && (
                <>
                  <Button variant="warning" className="me-2" onClick={() => navigate(`/edit/${product.id}`)}>
                    Edit Product
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Product
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Delivery Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Form.Group>

          <p className="mt-3"><strong>Payment Mode:</strong> Cash On Delivery</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleBuyNow}>Place Order</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetail;
