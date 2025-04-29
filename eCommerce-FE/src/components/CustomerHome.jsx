import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CustomerHome = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const searchResults = location.state?.searchResults || null;

  useEffect(() => {
    if (!searchResults) {
      fetchProducts();
    }
  }, [selectedCategory, searchResults]);

  const fetchProducts = async () => {
    setLoading(true);
    let url = '/api/customer/allProducts';
    if (selectedCategory) url = `/api/customer/filter?category=${encodeURIComponent(selectedCategory)}`;

    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
      res.data.forEach(product => fetchImage(product.id));
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async (productId) => {
    try {
      const res = await axios.get(`/api/products/${productId}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'
      });
      const base64 = btoa(
        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setImageMap(prev => ({ ...prev, [productId]: `data:image/jpeg;base64,${base64}` }));
    } catch (err) {
      console.error(`Image error for product ${productId}:`, err);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
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

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      fetchProducts();
    } else {
      try {
        setLoading(true);
        const res = await axios.get(`/api/customer/search?keyword=${encodeURIComponent(value)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        res.data.forEach(product => fetchImage(product.id));
      } catch (err) {
        console.error('Failed to search products:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>{searchResults ? "Search Results" : selectedCategory ? `${selectedCategory} Products` : "All Products"}</h2>

      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center mt-5">
              <h5>No Products Found</h5>
            </div>
          ) : (
            <Row>
              {products.map(product => (
                <Col md={4} key={product.id} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={imageMap[product.id] || '/default-image.jpg'} height="200" style={{ objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        Category: {product.category}<br />
                        Price: ₹{product.price}<br />
                        Stock: {product.stock}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button variant="primary" onClick={() => handleViewDetails(product.id)}>Details</Button>
                        <Button variant="success" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                        <Button variant="warning" onClick={() => handleBuyNowClick(product.id)}>Buy Now</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Buy Now Modal */}
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

export default CustomerHome;
