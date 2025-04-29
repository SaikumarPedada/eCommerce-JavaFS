import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [buyType, setBuyType] = useState('cart'); // 'cart' or 'single'
  const token = localStorage.getItem("token");

  const handleCheckoutClick = (type, productId = null) => {
    setBuyType(type);
    setSelectedProductId(productId);
    setQuantity(1);
    setShowModal(true);
  };

  const handleCheckout = () => {
    if (!address) {
      alert("Please enter delivery address");
      return;
    }

    const endpoint = buyType === 'cart' ? '/api/placeOrder/cartOrder' : '/api/placeOrder/productOrder';
    const body = buyType === 'cart'
      ? { deliveryAddress: address, paymentMode: "Cash On Delivery" }
      : { productId: selectedProductId, quantity: quantity, deliveryAddress: address, paymentMode: "Cash On Delivery" };

    axios.post(endpoint, body, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        alert('Order placed successfully!');
        setCartItems([]);
        setImageMap({});
        setShowModal(false);
      })
      .catch(err => console.error('Checkout failed:', err));
  };

  useEffect(() => {
    axios.get('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCartItems(data);

      data.forEach(item => {
        if (item && item.productId !== undefined) {
          fetchImage(item.productId);
        }
      });
    })
    .catch(err => console.error('Failed to fetch cart:', err));
  }, []);

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
      console.error(`Error loading image for product ${productId}`, err);
      setImageMap(prev => ({ ...prev, [productId]: '/default-image.jpg' }));
    }
  };

  const handleRemove = (productId) => {
    axios.delete(`/api/cart/removeFromCart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      const updatedMap = { ...imageMap };
      delete updatedMap[productId];
      setImageMap(updatedMap);
    })
    .catch(err => console.error('Failed to remove item:', err));
  };

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Cart</h3>
        <Button variant="success" onClick={() => handleCheckoutClick('cart')} disabled={cartItems.length === 0}>
          Buy All
        </Button>
      </div>
      <Row>
        {cartItems.map(item => (
          <Col md={4} key={item.id} className="mb-4">
            <Card>
              {imageMap[item.productId] ? (
                <Card.Img variant="top" src={imageMap[item.productId]} height="200" style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 200, backgroundColor: "#eee" }}>Image not available</div>
              )}
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Category: {item.category}<br />
                  Price: ₹{item.price}<br />
                  Quantity in Cart: {item.quantity}<br />
                  Description: {item.description}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="warning" onClick={() => handleCheckoutClick('single', item.productId)}>Buy Now</Button>
                  <Button variant="danger" onClick={() => handleRemove(item.productId)}>Remove</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Buy Now / Checkout Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{buyType === 'cart' ? 'Checkout Cart' : 'Buy Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          {buyType !== 'cart' && (
            <Form.Group className="mt-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
          )}

          <p className="mt-2"><strong>Payment Mode:</strong> Cash On Delivery</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCheckout}>Place Order</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
